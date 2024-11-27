import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonAlert } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-question-alert',
  templateUrl: './question-alert.component.html',
  styleUrls: ['./question-alert.component.scss'],
})
export class QuestionAlertComponent implements OnInit {
  @ViewChild('alert') alert: IonAlert;
  @Input() text?: string;
  @Output() action = new EventEmitter<boolean>();

  constructor(private _translate: TranslateService) {}

  ngOnInit(): void {}

  public alertButtons = [
    {
      text: this._translate.instant('general.cancel'),
      role: 'cancel',
      handler: () => {
        this.alert.isOpen = false;
        this.action.emit(false);
      },
    },
    {
      text: this._translate.instant('general.confirm'),
      role: 'confirm',
      handler: () => {
        this.action.emit(true);
      },
    },
  ];

  showQuestionAlert() {
    this.alert.isOpen = true;
  }

  closeQuestionAlert() {
    this.alert.isOpen = false;
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }
}
