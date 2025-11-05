import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem, VideoItem } from 'ng-gallery';
import { CallApiService } from 'src/app/services/call-api.service';
import { PredatorModel } from '../../models/predator.model';
import Map from 'ol/Map';
import { environment } from 'src/environments/environment';
import { QuestionAlertComponent } from 'src/app/components/common/question-alert/question-alert.component';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-predator-details',
  templateUrl: './predator-details.component.html',
  styleUrls: ['./predator-details.component.scss'],
  standalone: false,
})
export class PredatorDetailsComponent {
  @ViewChild(QuestionAlertComponent) alertQuestion: QuestionAlertComponent;
  public data: PredatorModel;
  public gallery: any = [];
  selectedItem: any = null;
  public loader = true;
  public map!: Map;

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private platform: Platform,
    private _location: Location
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this._location.back();
    });
  }

  ionViewWillEnter() {
    this.getData();
  }

  async getData() {
    this.loader = true;
    (await this._service
      .callGetMethod(
        '/api/user/getPredatorById',
        this._activatedRouter.snapshot.params.id
      ))
      .subscribe((data: any) => {
        if (data) {
          this.data = data;
          this.packGallery();
        }
        this.loader = false;
      });
  }

  packGallery() {
    this.gallery = [];
    if (this.data?.gallery) {
      const items = this.data.gallery.split(';').filter(Boolean);
      for (const fileName of items) {
        const fileUrl = environment.GALLERY_STORAGE + fileName;
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
          this.gallery.push({ type: 'image', src: fileUrl });
        } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
          this.gallery.push({ type: 'video', src: fileUrl });
        }
      }
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

  predatorEdit() {
    this._router.navigate(['home/predator-edit/' + this.data.id]);
  }

  async completedReport(event: boolean) {
    if (event) {
      (await this._service
        .callPostMethod('/api/user/completedReport', this.data))
        .subscribe((data: any) => {
          if (data) {
            this.getData();
          }
        });
    }
  }

  back() {
    this._location.back();
  }
}
