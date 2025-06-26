import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-predator-profile-user',
  templateUrl: './predator-profile-user.component.html',
  styleUrls: ['./predator-profile-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class PredatorProfileUserComponent implements OnInit {
  public user: any;
  public avatar: string;

  constructor(private _storage: StorageService) {}

  ngOnInit() {
    this.user = this._storage.getDecodeToken();
    this.setAvatar();
  }

  setAvatar() {
    if (this.user.avatar) {
      this.avatar =
        window.location.origin + '/assets/images/profile/' + this.user.avatar;
    }
  }
}
