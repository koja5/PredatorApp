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

  constructor(private _service: CallApiService, private _router: Router) {}

  ngOnInit() {
    this.getPredators();
  }

  getPredators() {
    this._service
      .callGetMethod('/api/user/getAllPredatorNotes')
      .subscribe((data) => {
        this.predators = data;
      });
  }

  takePicture = async () => {
    this.active = '';
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.imageSource = image.dataUrl;
  };

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
        return './assets/file-storage/' + gallery.split(';')[0];
      } else {
        return './assets/file-storage/' + gallery;
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
}
