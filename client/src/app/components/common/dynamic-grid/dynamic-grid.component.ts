import { Component, Input, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/services/call-api.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.scss'],
})
export class DynamicGridComponent implements OnInit {
  @Input() path: string;
  @Input() file: string;
  @Input() config: any;
  @Input() data: any;
  @Input() disableCRUD: boolean;

  constructor(
    private _configurationService: ConfigurationService,
    private _service: CallApiService
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

  getData(config: any) {
    this._service.callApi(config).subscribe((data) => {
      this.data = data;
    });
  }

  actionColumn(item: any, value: any, row: any) {}

  openLink(routerLink: any, data: any) {}
}
