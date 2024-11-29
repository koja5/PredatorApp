import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-predator-profile-user',
  templateUrl: './predator-profile-user.component.html',
  styleUrls: ['./predator-profile-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PredatorProfileUserComponent implements OnInit {
  public user: any;

  constructor(private _storage: StorageService) {}

  ngOnInit() {
    this.user = this._storage.getDecodeToken();
  }
}
