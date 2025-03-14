import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonDatetime, IonDatetimeButton, IonModal } from '@ionic/angular';

@Component({
  selector: 'app-app-ion-datetime-button',
  templateUrl: './app-ion-datetime-button.component.html',
  styleUrls: ['./app-ion-datetime-button.component.scss'],
})
export class AppIonDatetimeButtonComponent implements OnInit {
  @Input() value: string;
  @Output() changeEmit = new EventEmitter<any>();
  public date: string;

  constructor() {}

  ngOnInit() {
    console.log(this.value);
  }

  change(event: any) {
    this.changeEmit.emit(event);
  }
}
