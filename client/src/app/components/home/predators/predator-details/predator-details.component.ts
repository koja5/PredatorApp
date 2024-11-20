import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { CallApiService } from 'src/app/services/call-api.service';
import { PredatorModel } from '../../models/predator.model';
import Map from 'ol/Map';
import View from 'ol/View';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-predator-details',
  templateUrl: './predator-details.component.html',
  styleUrls: ['./predator-details.component.scss'],
})
export class PredatorDetailsComponent implements OnInit {
  public data: PredatorModel;
  public images: any = [];
  public loader = true;
  public map!: Map;

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router
  ) {}

  async ngOnInit() {
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
    if (this.data.gallery.indexOf(';')) {
      const gallery = this.data.gallery.split(';');
      for (let i = 0; i < gallery.length; i++) {
        this.images.push(
          new ImageItem({
            src: './assets/file-storage/' + gallery[i],
            thumb: './assets/file-storage/' + gallery[i],
          })
        );
      }
    } else {
      this.images.push(
        new ImageItem({
          src: './assets/file-storage/' + this.data.gallery,
          thumb: './assets/file-storage/' + this.data.gallery,
        })
      );
    }
  }

  predatorEdit() {
    this._router.navigate(['home/predator-edit/' + this.data.id]);
  }
}
