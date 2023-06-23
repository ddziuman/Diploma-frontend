import {
  Component,
  inject,
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import App from './react-paint/app';
import { NgReact } from './react-paint/ngContext';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit, OnDestroy {
  private ngReact = inject(NgReact);
  private root = this.ngReact.createRoot(inject(ElementRef).nativeElement);

  ngOnInit() {
    this.ngReact.render(this.root, App);
  }

  ngOnDestroy() {
    this.root.unmount();
  }
}
