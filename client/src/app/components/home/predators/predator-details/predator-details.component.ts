import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { CallApiService } from 'src/app/services/call-api.service';
import { PredatorModel } from '../../models/predator.model';
import Map from 'ol/Map';
import { environment } from 'src/environments/environment';
import { QuestionAlertComponent } from 'src/app/components/common/question-alert/question-alert.component';

@Component({
  selector: 'app-predator-details',
  templateUrl: './predator-details.component.html',
  styleUrls: ['./predator-details.component.scss'],
})
export class PredatorDetailsComponent implements OnInit {
  @ViewChild(QuestionAlertComponent) alertQuestion: QuestionAlertComponent;
  public data: PredatorModel;
  public images: any = [];
  public loader = true;
  public map!: Map;

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router
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
        if (data) {
          this.data = data;
          this.packGallery();
        }
        this.loader = false;
      });
  }

  packGallery() {
    if (this.data && this.data.gallery) {
      if (this.data.gallery.indexOf(';')) {
        const gallery = this.data.gallery.split(';');
        for (let i = 0; i < gallery.length; i++) {
          this.images.push(
            new ImageItem({
              src: environment.GALLERY_STORAGE + gallery[i],
              thumb: environment.GALLERY_STORAGE + gallery[i],
            })
          );
        }
      } else {
        this.images.push(
          new ImageItem({
            src: environment.GALLERY_STORAGE + this.data.gallery,
            thumb: environment.GALLERY_STORAGE + this.data.gallery,
          })
        );
      }
    }
  }

  predatorEdit() {
    this._router.navigate(['home/predator-edit/' + this.data.id]);
  }

  completedReport(event: boolean) {
    if (event) {
      this._service
        .callPostMethod('/api/user/completedReport', this.data)
        .subscribe((data) => {
          if (data) {
            this.getData();
          }
        });
    }
  }

  getCoordinate(event: any) {
    console.log(event);
  }
}
