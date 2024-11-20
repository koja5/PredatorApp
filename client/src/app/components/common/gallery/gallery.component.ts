import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, IonModal } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  GalleryModule,
  GalleryComponent as GalleryComponentModule,
  ImageItem,
  VideoItem,
  YoutubeItem,
  IframeItem,
} from 'ng-gallery';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(GalleryComponentModule) galleryPreview: GalleryComponentModule;
  @Input() value: any;
  @Input() images: any;
  @Input() gallery: any[] = [];
  @Output() changeEmit = new EventEmitter();

  public isGalleryOpen = false;
  files: any[] = [];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private _translate: TranslateService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.value) {
      // if (this.value.startsWith('data:image')) {
      //   this.gallery.push(this.value);
      // } else
      if (this.value.indexOf(';') != -1) {
        const gallery = this.value.split(';');
        for (let i = 0; i < gallery.length; i++) {
          this.gallery.push('./assets/file-storage/' + gallery[i]);
        }
      } else {
        this.gallery.push('./assets/file-storage/' + this.value);
      }
      this.packImageForPreview();
    }
  }

  close() {
    this.modal.isOpen = !this.modal.isOpen;
  }

  addMorePhoto = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    this.gallery.push(image.dataUrl);
  };

  fileBrowseHandler(events: any) {
    this.prepareFilesList(events.files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.packImagesToGallery();
    this.uploadFiles(0);
  }

  uploadFiles(index: number) {
    let formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append('files[]', this.files[i], this.files[i].name);
    }

    this.changeEmit.emit(this.files);
  }

  getCountOfOtherPictures() {
    if (this.gallery.length > 2) {
      return '+' + (this.gallery.length - 2);
    }
    return false;
  }

  packImageForPreview() {
    this.images = [];
    for (let i = 0; i < this.gallery.length; i++) {
      this.images.push(
        new ImageItem({
          src: this.gallery[i],
          thumb: this.gallery[i],
        })
      );
    }
  }

  packImagesToGallery() {
    for (let i = 0; i < this.files.length; i++) {
      this.gallery.push(URL.createObjectURL(this.files[i]));
    }
  }

  openImage(index: number) {
    this.modal.isOpen = true;
    setTimeout(() => {
      this.galleryPreview.set(index);
    }, 100);
  }

  removePhoto(index: number) {
    this.gallery.splice(index, 1);
    this.files.splice(index, 1);
    this.changeEmit.emit(this.gallery);
  }
}
