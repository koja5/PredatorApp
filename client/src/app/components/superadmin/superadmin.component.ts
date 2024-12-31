import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.scss'],
})
export class SuperadminComponent implements OnInit {
  public navigations: any;
  public currentUser: any;

  constructor(
    private _configurationService: ConfigurationService,
    private _storageService: StorageService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this._storageService.getDecodeToken();
    this.getNavigation();
  }

  getNavigation() {
    this._configurationService
      .getConfiguration('navigation-menu', 'superadmin.json')
      .subscribe((data) => {
        this.navigations = data;
      });
  }

  logout() {
    this._storageService.deleteToken();
    this._router.navigate(['/auth/login']);
  }
}
