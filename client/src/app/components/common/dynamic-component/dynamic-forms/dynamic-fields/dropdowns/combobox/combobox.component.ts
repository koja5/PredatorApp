import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ConfigurationFile } from "../../../models/complex-properties/configuration-file";
import { FieldConfig } from "../../../models/field-config";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DynamicFormsComponent } from "../../../dynamic-forms.component";
import { CallApiService } from "src/app/services/call-api.service";
import { HelpService } from "src/app/services/help.service";
import { ConfigurationService } from "src/app/services/configuration.service";
import { StorageService } from "src/app/services/storage.service";


@Component({
  selector: "app-combobox",
  templateUrl: "./combobox.component.html",
  styleUrls: ["./combobox.component.scss"],
  standalone: false
})
export class ComboboxComponent implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  @ViewChild("modalForm") modalForm: TemplateRef<any>;
  @ViewChild(DynamicFormsComponent) form!: DynamicFormsComponent;
  @ViewChild("modalNewEntrie") modal: TemplateRef<any>;
  public modalDialog: any;

  public data: any;
  public language: any;
  public loading = false;
  public configForm: any;

  constructor(
    private _service: CallApiService,
    private _helpService: HelpService,
    private _configurationService: ConfigurationService,
    private _modalService: NgbModal,
    private _storageService: StorageService
  ) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {
    this.language = this._helpService.getLanguage();
    if (this.config.data && this.config.data["translation"]) {
      this.config.field = this.config.data["translation"]["fields"];
    } else {
      this.initialization();
    }
  }

  async initialization() {
    if (this.config.request!.localData) {
      this.getLocalData(this.config.request!.localData);
    } else {
      if (this.config.request!.type === "POST") {
      } else {
        await this.getApiRequest();
      }
    }
  }

  postApiRequest() {
    this._service.callPostMethod(
      this.config.request!.api,
      this._service.packParametarPost(
        this.config.data,
        this.config.request!.fields
      )
    );
  }

  async getApiRequest() {
    this.loading = true;
    (await this._service.callApi(this.config, this.config.request!.fields)).subscribe(
      (data) => {
        if (this.config.request!.root) {
          // this.data = data[this.config.request!.root];
        } else {
          this.data = data;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getLocalData(localDataRequest: ConfigurationFile) {
    this._configurationService
      .getConfiguration(localDataRequest.path!, localDataRequest.file!)
      .subscribe((data) => {
        this.data = data;
      });
  }

  clickOnTag() {
    this._configurationService
      .getConfiguration(
        this.config.addTag.clickTagPath,
        this.config.addTag.clickTagFile
      )
      .subscribe((data) => {
        this.configForm = data;
        this.modalDialog = this._modalService.open(this.modalForm, {
          centered: true,
          windowClass:
            this.configForm.formDialog && this.configForm.formDialog.windowClass
              ? this.configForm.formDialog.windowClass
              : "modal modal-default",
          size:
            this.configForm.formDialog && this.configForm.formDialog.size
              ? this.configForm.formDialog.size
              : "md",
        });
      });
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.code.toLocaleLowerCase().indexOf(term) > -1 ||
      item.countryName.toLocaleLowerCase() === term
    );
  }

  onChange(event: any) {
    if (this.config.additionalField) {
      for (let i = 0; i < this.config.additionalField.length; i++) {
        this.group.addControl(
          this.config.additionalField[i].key,
          new FormControl(event[this.config.additionalField[i].value])
        );
      }
    }
    this.group.controls[this.config.name].setValue(
      event[this.config.field.value]
    );
  }

  submitEmitter(event: any) {
    this.config.value = event.firstname + " " + event.lastname;
  }

  openModalNewEntrie() {
    setTimeout(() => {
      this.modalDialog = this._modalService.open(this.modal, {
        centered: true,
        windowClass: "modal modal-danger",
      });
    }, 20);
  }

  async submitNewEntriesEmitter(event: any) {
    if (
      this._helpService.checkUndefinedProperty(event) &&
      event.type != "submit"
    ) {
      let body = {};

      if (this.config.addTag) {
        if (this.config.addTag.request) {
          body = this._service.buildParameterDate(
            this.config.addTag.request,
            event
          );
        }
      }

      (await this._service
        .callPostMethod(this.config.addTag.request.api, body))
        .subscribe(async (entryId) => {
          this.loading = true;
          (await this._service
            .callApi(this.config, this.config.request!.fields))
            .subscribe(
              (data) => {
                if (this.config.request!.root) {
                  // this.data = data[this.config.request!.root];
                } else {
                  this.data = data;
                  this.group.controls[this.config.name].setValue(entryId);
                  this.modalDialog.close();
                  this.loading = false;
                }
              },
              (error) => {
                this.loading = false;
              }
            );
        });
    }
  }
}
