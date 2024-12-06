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
import { environment } from 'src/environments/environment';

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

  ngOnInit() {
    if (this.value) {
      if (typeof this.value == 'string') {
        if (this.value.startsWith('data:image')) {
          // const blob = new Blob([this.value], { type: 'image/png' });
          const blob = this.b64toBlob(
            this.value.split('data:image/jpeg;base64,')[1]
          );
          this.files.push(
            new File([blob], 'name.jpeg', { type: 'image/jpeg' })
          );
          this.packImagesToGallery();
          this.appendFormData();
        } else if (this.value.indexOf(';') != -1) {
          const gallery = this.convertGalleryStringToGalleryArray();
          for (let i = 0; i < gallery.length; i++) {
            this.gallery.push(environment.GALLERY_STORAGE + gallery[i]);
          }
        } else if (this.value.startsWith('blob:')) {
          this.gallery.push(this.value);
        } else if (this.value.startsWith('https://localhost')) {
          this.gallery.push(this.value);
        } else {
          this.gallery.push(environment.GALLERY_STORAGE + this.value);
        }
      } else if (this.value instanceof Blob) {
        this.gallery.push(window.URL.createObjectURL(this.value));
        this.files.push(
          new File([this.value], 'name.jpeg', { type: 'image/jpeg' })
        );
      }

      this.packImageForPreview();
    }
  }

  ngOnChanges() {
    // this.gallery = [];
    // if (this.value) {
    //   if (this.value.indexOf(';') != -1) {
    //     const gallery = this.convertGalleryStringToGalleryArray();
    //     for (let i = 0; i < gallery.length; i++) {
    //       this.gallery.push(environment.GALLERY_STORAGE + gallery[i]);
    //     }
    //   } else {
    //     if (typeof this.value == 'string') {
    //       if (this.value.startsWith('data:image')) {
    //         this.gallery.push(this.value);
    //         this.changeEmit.emit({
    //           gallery: this.convertGalleryArrayToGalleryString(),
    //           uploaded: this.files,
    //         });
    //       } else {
    //         this.gallery.push(environment.GALLERY_STORAGE + this.value);
    //       }
    //     }
    //   }
    //   this.packImageForPreview();
    // }
  }

  close() {
    this.modal.isOpen = !this.modal.isOpen;
  }

  fileBrowseHandler(events: any) {
    this.prepareFilesList(events.files);
  }

  prepareFilesList(files: Array<any>) {
    // this.files = [];
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.packImagesToGallery();
    this.appendFormData();
  }

  appendFormData() {
    let formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append('files[]', this.files[i], this.files[i].name);
    }

    this.changeEmit.emit({
      gallery: this.gallery,
      uploaded: this.files,
    });
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
    this.changeEmit.emit({
      gallery: this.convertGalleryArrayToGalleryString(),
      uploaded: this.files,
    });
  }

  convertGalleryStringToGalleryArray() {
    return this.value.split(';');
  }

  convertGalleryArrayToGalleryString() {
    let gallery = '';
    for (let i = 0; i < this.gallery.length; i++) {
      if (this.gallery[i].includes(environment.GALLERY_STORAGE)) {
        gallery += this.gallery[i].split(environment.GALLERY_STORAGE)[1];
        if (i < this.gallery.length - 1) {
          gallery += ';';
        }
      }
    }
    return gallery;
  }

  b64toBlob(b64Data: any, contentType: string = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
