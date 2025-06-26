import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../models/field-config';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: false
})
export class SwitchComponent implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;

  constructor(private _helpService: HelpService) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {}

  checkRights() {
    return this._helpService.checkRights(this.config?.rights);
  }
}
