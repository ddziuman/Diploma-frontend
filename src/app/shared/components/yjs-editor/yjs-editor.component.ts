import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import Quill from 'quill';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';
import { QUILL_CONFIG } from './yjs-editor-config';
import { environment } from 'src/environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { registerModules } from './comments';
import {
  Observable,
  ReplaySubject,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';

registerModules(Quill);

export interface Comment {
  commentId: string;
  comment: string;
  commentTimestamp: string;
  commentAuthor: string;
  commentIndex: string;
}
@Component({
  selector: 'app-yjs-editor',
  templateUrl: './yjs-editor.component.html',
  styleUrls: ['./yjs-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YjsEditorComponent implements AfterViewInit {
  @ViewChild('editor') editorElementRef: ElementRef;
  yDoc: Y.Doc;

  editor: Quill;
  buinding: QuillBinding;
  yjsProvider: WebsocketProvider;

  notebookPage: string;

  comments$$: ReplaySubject<Comment[]> = new ReplaySubject(1);
  comments$: Observable<Comment[]>;

  get type() {
    return this.yDoc.getText(`doc${this.notebookPage}`);
  }
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.yDoc = new Y.Doc();
  }

  ngAfterViewInit(): void {
    this.decorateComments$Obs();
    this.editor = new Quill(this.editorElementRef.nativeElement, QUILL_CONFIG);

    (window as any).mathquill4quill()(this.editor, {
      operators: [
        ['\\sqrt[n]{x}', '\\nthroot'],
        ['\\frac{x}{y}', '\\frac'],
        ['\\pm', '\\pm'],
        ['\\sqrt{x}', '\\sqrt'],
        ['\\sqrt[3]{x}', '\\sqrt[3]{}'],
        ['\\sqrt[n]{x}', '\\nthroot'],
        ['\\frac{x}{y}', '\\frac'],
        ['\\sum^{s}_{x}{d}', '\\sum'],
        ['\\prod^{s}_{x}{d}', '\\prod'],
        ['\\coprod^{s}_{x}{d}', '\\coprod'],
        ['\\int^{s}_{x}{d}', '\\int'],
        ['\\binom{n}{k}', '\\binom'],
        ,
      ],
      displayHistory: true,
      historyCacheKey: '__my_app_math_history_cachekey_',
      historySize: 20,
    });

    this.editor.on('text-change', () => {
      let deltaOps = this.editor.getContents().ops;
      let comments = deltaOps
        .filter(
          (op, index, arr) =>
            arr.findIndex((i) => {
              return (
                i.attributes?.['commentId'] === op.attributes?.['commentId']
              );
            }) === index &&
            op.attributes &&
            op.attributes?.['commentId']
        )
        .map((op) => op.attributes)
        .map(
          (op: any) =>
            <Comment>{
              comment: op.comment,
              commentId: op.commentId,
              commentTimestamp: op.commentTimestamp,
              commentIndex: op.commentIndex,
            }
        )
        .sort((a, b) => {
          if (a.commentTimestamp > b.commentTimestamp) {
            return 1;
          } else if (a.commentTimestamp < b.commentTimestamp) {
            return -1;
          } else {
            return 0;
          }
        });
      this.comments$$.next(comments);
      this.cdr.detectChanges();
    });
    this.route.paramMap.subscribe((params) => {
      this.initProviderAndBinding();
    });
  }

  decorateComments$Obs() {
    this.comments$ = this.comments$$.pipe(
      debounceTime(100),
      distinctUntilChanged((prev, curr) => {
        if (prev.length !== curr.length) {
          return false;
        }
        let isSame = true;
        prev.forEach((i, index) => {
          isSame = prev[index].commentId === curr[index].commentId;
        });
        return isSame;
      })
    );
  }

  focusOnComment(comment: Comment, type?: string) {
    this.editor.focus();
    this.editor.setSelection(parseInt(comment.commentIndex), 0);
  }

  initProviderAndBinding() {
    if (this.yjsProvider) {
      this.yjsProvider.disconnect();
      this.yjsProvider.destroy();
    }
    this.notebookPage = (
      this.route.snapshot.params as { notebookPage: string }
    ).notebookPage;
    this.yjsProvider = new WebsocketProvider(
      `${environment.wsUrl}`,
      'notebook1',
      this.yDoc,
      {
        params: {
          userId: '1',
          page: this.notebookPage,
        },
      }
    );
    if (this.buinding) {
      this.buinding.destroy();
    }
    this.buinding = new QuillBinding(
      this.type,
      this.editor,
      this.yjsProvider.awareness
    );
    const cursors = this.editor.getModule('cursors');
    cursors.clearCursors();
  }

  handlePageEvent($event: PageEvent) {
    console.log($event);
    this.router.navigate([`../../notebookPage/${$event.pageIndex + 1}`], {
      relativeTo: this.route,
    });
  }

  onCommentBlur($event: any, comment: Comment) {
    let relatedTo = this.el.nativeElement.querySelectorAll(
      `#${comment.commentId}`
    ) as NodeList;
    relatedTo.forEach((item) => {
      this.renderer.removeStyle(item, 'color');
      this.renderer.removeStyle(item, 'font-weight');
    });
  }

  onCommentFocus($event: any, comment: Comment) {
    let relatedTo = this.el.nativeElement.querySelectorAll(
      `#${comment.commentId}`
    ) as NodeList;
    relatedTo.forEach((item) => {
      this.renderer.setStyle(item, 'color', 'red');
      this.renderer.setStyle(item, 'font-weight', 'bold');
    });
  }
}
