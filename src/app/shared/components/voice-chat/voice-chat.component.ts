import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import {
  Observable,
  of,
  switchMap,
  interval,
  from,
  defer,
  tap,
  fromEventPattern,
  delay,
  take,
  filter,
  ReplaySubject,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Peer, MediaConnection } from 'peerjs';

interface VideoElement {
  srcObject: MediaStream;
  userId: string;
  audioTracker$: Observable<boolean>;
  microMutedControl: FormControl<boolean>;
}
@Component({
  selector: 'app-voice-chat',
  templateUrl: './voice-chat.component.html',
  styleUrls: ['./voice-chat.component.scss'],
})
export class VoiceChatComponent implements OnInit {
  @ViewChild('screenShareVideo', { static: true })
  screenShareVideoRef: ElementRef;

  currentUserId: string = uuidv4();
  connectedUsers = [];
  videos: VideoElement[] = [];
  myStream: MediaStream;

  peers: Map<string, MediaConnection> = new Map();
  currentRemoteShareScreen: MediaConnection;

  localShareScreenStream: MediaStream;
  localShareScreenPeers: Map<string, MediaConnection> = new Map();

  microMutedControl = new FormControl(true);

  Peer: Peer;

  room: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly socket: Socket
  ) {}

  ngOnInit(): void {
    this.room = (this.route.snapshot.params as { roomId: string }).roomId;
    this.initializePeer();
    this.joinRoom();

    this.getUserMediaObservable$()
      .pipe(
        tap((stream: MediaStream | null) => {
          this.myStream = stream;

          if (stream) {
            this.addMyMedia(stream);
          }
          this.subscribeOnIncomingCalls();
          this.subscribeOnVideoSharingCall();
          this.subscribeOnUserConnected();
          this.subscribeOnMicroToggle();
          this.subscribeOnStopDemo();
        })
      )
      .subscribe();

    this.getEventAsObservable$('user-disconnected', this.socket).subscribe(
      (userId) => {
        this.videos = this.videos.filter((video) => video.userId !== userId);
        this.localShareScreenPeers.delete(userId);
      }
    );
  }

  addMyMedia(stream: MediaStream) {
    this.microMutedControl.valueChanges.subscribe(() => {
      let video = this.videos.find((v) => v.userId === this.currentUserId);
      let audioTrack = video.srcObject.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;

      this.socket.emit('toggle-micro', {
        userId: video.userId,
        roomId: this.room,
        isMicroEnabled: audioTrack.enabled,
      });
    });

    stream.getAudioTracks()[0].enabled = !this.microMutedControl.value;

    this.videos.push({
      srcObject: stream,
      userId: this.currentUserId,
      audioTracker$: this.createAudioTracker$(stream),
      microMutedControl: this.microMutedControl,
    });
  }

  addOtherMedia(userId: string, stream: MediaStream) {
    const alreadyExisting = this.videos.find(
      (video) => video.userId === userId
    );

    if (alreadyExisting) {
      if (alreadyExisting.srcObject !== stream) {
        alreadyExisting.srcObject = stream;
      }
      return;
    }

    this.videos.push({
      srcObject: stream,
      userId: userId,
      audioTracker$: this.createAudioTracker$(stream),
      microMutedControl: new FormControl({
        disabled: true,
        value: true,
      }),
    });
  }

  private initializePeer() {
    this.Peer = new (window as any).Peer(this.currentUserId, {
      host: '/',
      port: 3003,
    });

    this.getEventAsObservable$('connection', this.Peer)
      .pipe(
        switchMap((conn) =>
          this.getEventAsObservable$('open', conn).pipe(
            switchMap(() => {
              conn.send({
                userId: this.currentUserId,
                muted: this.microMutedControl.value,
              });
              return this.getEventAsObservable$('data', conn).pipe(
                tap(({ userId, muted }: any) => {
                  this.videos
                    .find((v) => v.userId === userId)
                    .microMutedControl.setValue(muted);
                })
              );
            })
          )
        )
      )
      .subscribe();
  }

  private joinRoom() {
    this.getEventAsObservable$('open', this.Peer).subscribe((userId) => {
      this.socket.emit('join-room', {
        userId: userId,
        roomId: this.room,
      });
    });
  }

  private getUserMediaObservable$() {
    return defer(() =>
      from(
        navigator.mediaDevices.getUserMedia({ audio: true }).catch((err) => {
          console.error('[Error] Not able to retrieve user media', err);
          return null;
        })
      )
    );
  }

  private getEventAsObservable$(
    eventName: any,
    eventHolder: any
  ): Observable<any> {
    const eventPattern = (handler: any) => {
      eventHolder.on(eventName, handler);
    };
    return fromEventPattern(eventPattern);
  }

  private subscribeOnUserConnected() {
    this.getEventAsObservable$('user-connected', this.socket)
      .pipe(
        delay(1000),
        tap((userId) => {
          if (userId === this.currentUserId) return;

          const call = this.Peer.call(userId, this.myStream, {
            metadata: {
              userId: this.currentUserId,
              muted: this.microMutedControl.value,
            },
          });

          this.peers.set(userId, call);
          this.getEventAsObservable$('stream', call)
            .pipe(
              take(1),
              tap((otherUserMediaStream) => {
                this.addOtherMedia(userId, otherUserMediaStream);

                if (this.localShareScreenStream) {
                  let call = this.Peer.call(
                    userId,
                    this.localShareScreenStream,
                    {
                      metadata: {
                        userId: this.currentUserId,
                        shareScreen: true,
                      },
                    }
                  );
                  this.localShareScreenPeers.set(userId, call);
                }
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  private subscribeOnIncomingCalls() {
    this.getEventAsObservable$('call', this.Peer)
      .pipe(
        filter((call: MediaConnection) => !call.metadata.shareScreen),
        tap((call: MediaConnection) => {
          call.answer(this.myStream);
          let stream$ = new ReplaySubject<MediaStream>(1);
          call.on('stream', (otherUserMediaStream) => {
            stream$.next(otherUserMediaStream);
          });

          stream$
            .pipe(
              take(1),
              tap((otherUserMediaStream) => {
                this.peers.set(call.metadata.userId, call);
                this.addOtherMedia(call.metadata.userId, otherUserMediaStream);

                const dataConnection = this.Peer.connect(call.peer);
                this.getEventAsObservable$('open', dataConnection)
                  .pipe(
                    switchMap(() => {
                      dataConnection.send({
                        userId: this.currentUserId,
                        muted: this.microMutedControl.value,
                      });
                      return this.getEventAsObservable$('data', dataConnection);
                    }),
                    tap(({ userId, muted }: any) => {
                      this.videos
                        .find((v) => v.userId === userId)
                        .microMutedControl.setValue(muted);
                    })
                  )
                  .subscribe();
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  private subscribeOnVideoSharingCall() {
    this.getEventAsObservable$('call', this.Peer)
      .pipe(
        filter((call: MediaConnection) => call.metadata.shareScreen),
        switchMap((call: MediaConnection) => {
          call.answer();

          return this.getEventAsObservable$('stream', call).pipe(
            take(1),
            tap((otherUserMediaStream: MediaStream) => {
              this.currentRemoteShareScreen = call;
              this.screenShareVideoRef.nativeElement.srcObject =
                otherUserMediaStream;
            })
          );
        })
      )
      .subscribe();
  }

  private subscribeOnMicroToggle() {
    this.getEventAsObservable$('micro-toggled', this.socket)
      .pipe(
        tap(({ userId, isMicroEnabled }) => {
          console.log(userId, isMicroEnabled);
          this.videos
            .find((v) => v.userId === userId)
            .microMutedControl.setValue(!isMicroEnabled);
        })
      )
      .subscribe();
  }

  private subscribeOnStopDemo() {
    this.getEventAsObservable$('screen-shared', this.socket)
      .pipe(
        tap(() => {
          this.cleanCurrentStream();
        })
      )
      .subscribe();
  }

  syncStream() {
    this.peers.forEach((peer, key) => {
      let call = this.Peer.call(key, this.localShareScreenStream, {
        metadata: { userId: this.currentUserId, shareScreen: true },
      });
      this.localShareScreenPeers.set(key, call);
    });
  }

  async cleanCurrentStream() {
    this.localShareScreenPeers.forEach((call, key, map) => {
      call.peerConnection.getSenders()[0].track.stop();
      call.close();
    });
    this.localShareScreenPeers.clear();
    this.screenShareVideoRef.nativeElement.srcObject = null;
    this.localShareScreenStream = null;
  }

  async startScreenSharing() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    if (this.localShareScreenStream) {
      this.localShareScreenStream.getTracks()[0].stop();
      this.localShareScreenPeers.forEach((peer, key) => {
        let sender = peer.peerConnection.getSenders()[0];
        sender.track.stop();
        sender.replaceTrack(stream.getTracks()[0]);
      });
      this.screenShareVideoRef.nativeElement.srcObject = stream;
      this.localShareScreenStream.getTracks()[0].stop();
      this.localShareScreenStream = stream;
      return;
    }
    this.stopScreenSharing();
    this.screenShareVideoRef.nativeElement.srcObject = stream;
    this.localShareScreenStream = stream;

    this.syncStream();
  }

  stopScreenSharing() {
    this.socket.emit('stop-screen-sharing', { roomId: this.room });
    this.cleanCurrentStream();
  }

  createAudioTracker$(stream: MediaStream) {
    const audioContext = new AudioContext();

    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 64;
    analyser.minDecibels = -80;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.3;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    mediaStreamSource.connect(analyser);

    return interval(400).pipe(
      switchMap(() => {
        analyser.getByteFrequencyData(dataArray);

        // Check if there is any audio activity
        const isAudioActive = Array.from(dataArray).some((value) => value > 50);
        return of(isAudioActive);
      })
    );
  }
}
