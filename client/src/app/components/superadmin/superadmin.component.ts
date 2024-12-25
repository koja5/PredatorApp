import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.scss'],
})
export class SuperadminComponent implements OnInit {
  public navigations: any;

  constructor(private _configurationService: ConfigurationService) {}

  ngOnInit() {
    this.getNavigation();
  }

  getNavigation() {
    this._configurationService
      .getConfiguration('navigation-menu', 'superadmin.json')
      .subscribe((data) => {
        this.navigations = data;
      });
  }
}
