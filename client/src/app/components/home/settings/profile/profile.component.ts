import { Component, OnInit } from '@angular/core';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
})
export class ProfileComponent implements OnInit {
  public path = 'forms/user';
  public file = 'profile.json';
  public profileImage: string = '';
  public profileImageCropped: string = '';
  public coverImage: string = '';
  public coverImageCropped: string = '';
  public user: any;
  public data: any;

  constructor(
    private _storageService: StorageService,
    private _service: CallApiService,
    private _toastr: ToastrComponent
  ) {}

  async ngOnInit() {
    this.user = await this._storageService.getDecodeToken();
    this.setAvatar();
    this.setCover();
   this.getMe();
  }

  async getMe() {
    (await this._service
      .callGetMethod('/api/user/getMe'))
      .subscribe((data: any) => {
        this.data = data;
      });
  }

  setAvatar() {
    if (this.user.avatar) {
      this.profileImageCropped =
        environment.DOMAIN + '/assets/images/profile/' + this.user.avatar;
    }
  }

  setCover() {
    if (this.user.cover) {
      this.coverImageCropped =
        environment.DOMAIN + '/assets/images/cover/' + this.user.cover;
    }
  }

  async onFileChangeCover(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      this.coverImage = URL.createObjectURL(files[0]);

      this.coverImageCropped = this.coverImage;
      let formData = new FormData();
      let blobImage = this.coverImageCropped;
      formData.append('uploads[]', files[0], files[0].name);
      formData.append('id', this.user.id);

      (await this._service
        .callPostMethod('api/user/setMyCover', formData))
        .subscribe((data: any) => {
          this._storageService.setToken(data);
        });
    }
  }

  async onFileChangeProfile(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      this.profileImage = URL.createObjectURL(files[0]);

      this.profileImageCropped = this.profileImage;
      let formData = new FormData();
      let blobImage = this.profileImageCropped;
      formData.append('uploads[]', files[0], files[0].name);
      formData.append('id', this.user.id);

      (await this._service
        .callPostMethod('api/user/setMyAvatar', formData))
        .subscribe((data: any) => {
          this._storageService.setToken(data);
        });
    }
  }

  async submit() {
    (await this._service.callPostMethod('/api/user/setMe', this.data)).subscribe(data => {
      if(data) {
        this._toastr.showSuccess();
      }
    })
  }
}
