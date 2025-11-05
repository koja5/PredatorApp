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
  standalone: false,
})
export class GalleryComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(GalleryComponentModule) galleryPreview: GalleryComponentModule;
  @Input() value: any;
  @Input() images: any;
  @Input() gallery: any[] = [];
  @Input() editable = false;
  @Output() changeEmit = new EventEmitter();

  public isGalleryOpen = false;
  files: any[] = [];
  public imageFromCamera: any;
  selectedItem: any = null;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.value && this.value != 'undefined') {
      if (typeof this.value == 'string') {
        if (this.value.startsWith('data:image')) {
          this.imageFromCamera = this.b64toBlob(
            this.value.split('data:image/jpeg;base64,')[1]
          );
          this.packImageFromCamera();
          this.packImagesToGallery(this.imageFromCamera);
          this.appendFormData();
        } else if (this.value.indexOf(';') != -1) {
          this.packGallery();
        } else if (this.value.startsWith('blob:')) {
          this.gallery.push(this.value);
        } else if (this.value.startsWith('https://localhost')) {
          this.gallery.push(this.value);
        } else {
          const file = environment.GALLERY_STORAGE + this.value;
          this.pushToGallery(file);
        }
      } else if (this.value instanceof Blob) {
        this.pushToGallery(URL.createObjectURL(this.value), this.value.type);
        this.imageFromCamera = this.value;
        this.packImageFromCamera();
        this.appendFormData();
      }
    }
  }

  packGallery() {
    this.gallery = [];
    if (this.value) {
      const items = this.value.split(';').filter(Boolean);
      for (const fileName of items) {
        const fileUrl = environment.GALLERY_STORAGE + fileName;
        this.pushToGallery(fileUrl);
      }
    }
  }

  pushToGallery(file: any, extension?: string) {
    const ext = extension ? extension : file.split('.').pop()?.toLowerCase();
    if (
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].some((type) => ext.includes(type))
    ) {
      this.gallery.push({ type: 'image', src: file });
    } else if (
      ['mp4', 'mov', 'avi', 'mkv', 'webm'].some((type) => ext.includes(type))
    ) {
      this.gallery.push({ type: 'video', src: file });
    }
  }

  openLightbox(item: any) {
    this.selectedItem = item;
  }

  closeLightbox() {
    this.selectedItem = null;
  }

  prevItem() {
    if (!this.selectedItem) return;
    const index = this.gallery.indexOf(this.selectedItem);
    this.selectedItem =
      this.gallery[(index - 1 + this.gallery.length) % this.gallery.length];
  }

  nextItem() {
    if (!this.selectedItem) return;
    const index = this.gallery.indexOf(this.selectedItem);
    this.selectedItem = this.gallery[(index + 1) % this.gallery.length];
  }

  close() {
    this.modal.isOpen = !this.modal.isOpen;
  }

  fileBrowseHandler(events: any) {
    this.prepareFilesList(events.files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      this.packImagesToGallery(item);
    }
    this.appendFormData();
  }

  initializeAllAndKeepFromCamera() {
    let ind = 1;
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].name === 'fromCamera.jpeg') {
        ind = 0;
        if (i > 1) {
          this.files.splice(0, i - 1);
        }
        if (i < this.files.length) {
          this.files.slice(i + 1, this.files.length);
        }
      }
    }
    if (ind) {
      this.files = [];
    }
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

  packImagesToGallery(image: any) {
    this.pushToGallery(URL.createObjectURL(image), image.type);
  }

  packImageFromCamera() {
    if (this.imageFromCamera) {
      const mimeType = this.imageFromCamera.type || 'image/jpeg';
      const extension = mimeType.split('/')[1] || 'jpeg';

      this.files.push(
        new File([this.imageFromCamera], `fromCamera.${extension}`, {
          type: mimeType,
        })
      );
    }
  }

  checkIsImageInGallery(image: any) {
    for (let i = 0; i < this.gallery.length; i++) {
      if (this.gallery[i] === image) {
        return true;
      }
    }
    return false;
  }

  removePhoto(index: number) {
    this.gallery.splice(index, 1);
    this.files.splice(index, 1);
    this.changeEmit.emit({
      gallery: this.convertGalleryArrayToGalleryString(),
      uploaded: this.files,
    });
  }

  convertGalleryArrayToGalleryString() {
    let gallery = '';
    for (let i = 0; i < this.gallery.length; i++) {
      if (this.gallery[i].src.includes(environment.GALLERY_STORAGE)) {
        gallery += this.gallery[i].src.split(environment.GALLERY_STORAGE)[1];
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
