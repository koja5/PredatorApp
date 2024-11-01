import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ion-input',
  templateUrl: './app-ion-input.component.html',
  styleUrls: ['./app-ion-input.component.scss'],
})
export class AppIonInputComponent implements OnInit {
  @Input() label?: string;
  @Input() value?: any;
  @Input() placeholder?: string = '';
  @Input() type?: any;
  @Output() changeEmit = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  change(event: any) {
    this.value = event.target.value;
    this.changeEmit.emit(this.value);
  }
}
