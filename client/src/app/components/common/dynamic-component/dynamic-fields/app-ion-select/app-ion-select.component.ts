import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigModel } from 'src/app/models/config.model';
import { CallApiService } from 'src/app/services/call-api.service';

@Component({
  selector: 'app-ion-select',
  templateUrl: './app-ion-select.component.html',
  styleUrls: ['./app-ion-select.component.scss'],
})
export class AppIonSelectComponent implements OnInit {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() data: any;
  @Input() value: any;
  @Input() config?: ConfigModel;
  @Output() changeEmit = new EventEmitter<any>();

  constructor(private _service: CallApiService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    if (this.config) {
      this._service.callApi(this.config).subscribe((data: any) => {
        this.data = data;
      });
    }
  }

  change(event: any) {
    console.log(event.target.value);
    // this.ionChange.emit(event.detail.value);
    this.value = event.target.value;
    this.changeEmit.emit(this.value);
  }
}
