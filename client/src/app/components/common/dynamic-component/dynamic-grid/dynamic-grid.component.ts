import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { HelpService } from 'src/app/services/help.service';
import { MethodRequest } from '../enums/method-request';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormsComponent } from '../dynamic-forms/dynamic-forms.component';
import { ToastrComponent } from '../../toastr/toastr.component';
import { QuestionAlertComponent } from '../../question-alert/question-alert.component';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.scss'],
  standalone: false
})
export class DynamicGridComponent implements OnInit {
  @ViewChild('form') form: DynamicFormsComponent;
  @ViewChild(QuestionAlertComponent) alertQuestion: QuestionAlertComponent;
  @Input() path: string;
  @Input() file: string;
  @Input() config: any;
  @Input() data: any;
  @Input() disableCRUD: boolean;
  @Output() submit = new EventEmitter();

  public isModalOpen = false;
  public loader = false;
  public executeActionConfig: any;
  public ColumnMode = ColumnMode;

  constructor(
    private _configurationService: ConfigurationService,
    private _service: CallApiService,
    private _helpService: HelpService,
    private _router: Router,
    private _activateRouter: ActivatedRoute,
    private _toastr: ToastrComponent
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    if (this.path && this.file) {
      this._configurationService
        .getConfiguration(this.path, this.file)
        .subscribe((config) => {
          this.config = config;
          this.getData(config);
        });
    }
  }

  async getData(config: any) {
    (await this._service.callApi(config)).subscribe((data: any) => {
      this.data = data;
    });
  }

  actionColumn(item: any, value: any, row: any) {
    if (item.routerLink) {
      if (value && item.routerLink.indexOf('{{value}}') != -1) {
        item.routerLink = item.routerLink.replace('{{value}}', value);
      }
      this._router.navigate([item.routerLink]);
    } else if (item.type) {
      if (item.type === 'edit' || item.type === 'show') {
        this.checkConfigurationFunctionsForEditOption(item, row);
      }

      if (item.executeAction && item.executeAction.showQuestionBeforeExecute) {
        this.executeActionConfig = item.executeAction;
        this.executeActionConfig.body = row;
        this.alertQuestion.showQuestionAlert();
      }
    }
  }

  checkConfigurationFunctionsForEditOption(item: any, row: any) {
    setTimeout(() => {
      this.setValue(this.config.config, row);
    }, 50);

    this.isModalOpen = true;
  }

  setValue(fields: any, values: any) {
    for (let i = 0; i < fields.length; i++) {
      this.form.setValue(
        fields[i]['name'],
        values[fields[i]['name']],
        fields[i]['type']
      );
    }
  }

  openLink(routerLink: any, data: any) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onWillDismiss(event: any) {}

  submitEmitter(event: any, noCloseEditForm?: boolean) {
    console.log(event);
    if (
      (this._helpService.checkUndefinedProperty(event) &&
        event.type != 'submit') ||
      event instanceof FormData
    ) {
      if (
        this.config.editSettingsRequest &&
        this.config.editSettingsRequest.add.type === MethodRequest.EMIT
      ) {
        this.isModalOpen = false;
        this.submit.emit(event);
      } else if (this.config.editSettingsRequest.add.type) {
        this.callServerMethod(
          this.config.editSettingsRequest.add,
          event,
          noCloseEditForm
        );
      }
    }
  }

  allowExecuteActionFromModal(answer: boolean) {
    if (answer) {
      this.callServerMethod(
        this.executeActionConfig.request,
        this.executeActionConfig.body
      );
      this.alertQuestion.closeQuestionAlert();
    }
  }

  async callServerMethod(
    request: any,
    event: any,
    noResponseMessage?: boolean,
    noCloseEditForm?: boolean
  ) {
    this.loader = true;
    (await this._service
      .callServerMethod(request, event, this._activateRouter))
      .subscribe((data: any) => {
        if (data) {
          if (!noResponseMessage) {
            this._toastr.showSuccess();
            this.isModalOpen = false;
            this.refreshDataFromServer();
          }
        } else {
          this._toastr.showError();
          this.isModalOpen = false;
          this.loader = false;
        }
      });
  }

  async refreshDataFromServer() {
    if (this.config.request) {
      (await this._service
        .callApi(this.config, this._activateRouter))
        .subscribe((data: any) => {
          this.loader = false;
          this.setResponseData(data);
        });
    }
  }

  setResponseData(data: any) {
    if (this.config.request.type === 'GET') {
      this.data = data;
      this.submit.emit({
        rows: this.data,
        total: this.data.length,
      });
    }
  }
}
