import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ion-textarea',
  templateUrl: './app-ion-textarea.component.html',
  styleUrls: ['./app-ion-textarea.component.scss'],
})
export class AppIonTextareaComponent implements OnInit {
  @Input() label?: string;
  @Input() placeholder?: string = '';
  @Input() value?: any;
  @Output() changeEmit = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  change(event: any) {
    this.value = event.target.value;
    this.changeEmit.emit(this.value);
  }
}
