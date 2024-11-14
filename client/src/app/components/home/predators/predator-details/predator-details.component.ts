import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { CallApiService } from 'src/app/services/call-api.service';
import { PredatorModel } from '../../models/predator.model';

@Component({
  selector: 'app-predator-details',
  templateUrl: './predator-details.component.html',
  styleUrls: ['./predator-details.component.scss'],
})
export class PredatorDetailsComponent implements OnInit {
  public data: PredatorModel;
  public images: any = [];
  public loader = true;

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loader = true;
    this._service
      .callGetMethod(
        '/api/user/getPredatorById',
        this._activatedRouter.snapshot.params.id
      )
      .subscribe((data: any) => {
        this.data = data;
        this.packGallery();
        this.loader = false;
      });
  }

  packGallery() {
    const gallery =
      this.data.gallery.indexOf(';') != -1
        ? this.data.gallery.split(';')
        : this.data.gallery;
    if (gallery && gallery.length) {
      for (let i = 0; i < gallery.length; i++) {
        this.images.push(
          new ImageItem({
            src: './assets/file-storage/' + gallery[i],
            thumb: './assets/file-storage/' + gallery[i],
          })
        );
      }
    }
  }
}
