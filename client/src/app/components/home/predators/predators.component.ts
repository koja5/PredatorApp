import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PredatorEditComponent } from './predator-edit/predator-edit.component';
import { CallApiService } from 'src/app/services/call-api.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-predators',
  templateUrl: './predators.component.html',
  styleUrls: ['./predators.component.scss'],
})
export class PredatorsComponent implements OnInit {
  @ViewChild('createNewEntryButton') createNewEntryButton!: ElementRef;
  @ViewChild(PredatorEditComponent)
  editFormComponent!: PredatorEditComponent;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {
    if (!this.createNewEntryButton.nativeElement.contains(event.target)) {
      this.active = '';
    }
  }

  public imageSource: any;
  public active = '';
  public predators: any;
  public loader = true;

  constructor(private _service: CallApiService, private _router: Router) {}

  ngOnInit() {
    this.getPredators();
  }

  getPredators() {
    this.loader = true;
    this._service
      .callGetMethod('/api/user/getAllPredatorNotes')
      .subscribe((data) => {
        this.predators = data;
        this.loader = false;
      });
  }

  takePicture = async () => {
    this.active = '';
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    console.log(image);

    // const fileSrc = Capacitor.convertFileSrc(image.path!);

    // const checkCameraPermissions = await Camera.checkPermissions();
    // if (checkCameraPermissions.photos !== 'granted') {
    //   await Camera.requestPermissions({ permissions: ['photos'] });
    // }

    // const image = await Camera.getPhoto({
    //   resultType: CameraResultType.Uri,
    //   source: CameraSource.Camera,
    //   quality: 100,
    // });

    // if (!image) return;

    const imageBlob = this.base64toBlob(image.base64String, 'image/jpeg');
    if (!imageBlob) return;

    this.imageSource = imageBlob;

    // this._router.navigate([
    //   'home/predator-edit/new?gallery=' + this.imageSource,
    // ]);
    // this.editFormComponent.open();
  };

  base64toBlob(base64Data: any, contentType: any) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  getBlobImage(blob: any) {
    return window.URL.createObjectURL(blob);
  }

  openAction() {
    if (this.active === '') {
      this.active = 'active';
    } else {
      this.active = '';
    }
  }

  addManually() {
    this._router.navigate(['home/predator-edit/new']);
  }

  getImageForPreviewFromGallery(gallery: string) {
    if (gallery) {
      if (gallery.indexOf(';') != -1) {
        return environment.GALLERY_STORAGE + gallery.split(';')[0];
      } else {
        return environment.GALLERY_STORAGE + gallery;
      }
    } else {
      return './assets/icon/no-image.svg';
    }
  }

  getMorePhotosIcon(gallery: string) {
    if (
      gallery &&
      gallery.indexOf(';') != -1 &&
      gallery.split(';').length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  showDetails(id: number) {
    this._router.navigate(['home/predator-details/' + id]);
  }

  refresh() {
    this.getPredators();
  }
}
