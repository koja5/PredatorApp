import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CallApiService } from 'src/app/services/call-api.service';
import {
  ActivityModel,
  DataPredatorsModel,
  PredatorModel,
  TerritoryModel,
  TypeOfWaterModel,
} from './data-predators.model';
import { ImageItem } from 'ng-gallery';
import { PredatorFormModel } from './predator-form.model';

@Component({
  selector: 'app-predator-form',
  templateUrl: './predator-form.component.html',
  styleUrls: ['./predator-form.component.scss'],
})
export class PredatorFormComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  public message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  public name!: string;
  public isModalOpen = false;
  public data = new PredatorFormModel();
  public allItems = new DataPredatorsModel();
  public isGalleryOpen = false;
  public predatorNotes: any;

  constructor(private _service: CallApiService) {}

  ngOnInit() {
    this.getAllPredators();
    this.getAllTypeOfWaters();
    this.getAllTerritories();
    this.getAllActivities();

    this._service
      .callGetMethod('api/user/getAllPredatorNotes')
      .subscribe((data) => {
        this.predatorNotes = data;
      });
  }

  getAllPredators() {
    this._service
      .callGetMethod('api/user/getAllPredators')
      .subscribe((data: PredatorModel) => {
        this.allItems.predators = data;
      });
  }

  getAllTypeOfWaters() {
    this._service
      .callGetMethod('api/user/getAllTypeOfWaters')
      .subscribe((data: TypeOfWaterModel) => {
        this.allItems.typeOfWaters = data;
      });
  }

  getAllTerritories() {
    this._service
      .callGetMethod('api/user/getAllTerritories')
      .subscribe((data: TerritoryModel) => {
        this.allItems.territories = data;
      });
  }

  getAllActivities() {
    this._service
      .callGetMethod('api/user/getAllActivities')
      .subscribe((data: ActivityModel) => {
        this.allItems.activities = data;
      });
  }

  open() {
    this.isModalOpen = true;
  }

  cancel() {
    this.isModalOpen = false;
  }

  confirm() {
    this.isModalOpen = false;

    let formData = new FormData();
    for (let i = 0; i < this.data.gallery.length; i++) {
      formData.append(
        'gallery[]',
        this.data.gallery[i],
        this.data.gallery[i].name
      );
    }

    this._service
      .callPostMethod('api/upload/setPredator', formData)
      .subscribe((data) => {
        console.log(data);
      });
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  changeEmitPredator(event: number) {
    this.data.predator = event;
  }

  changeEmitTypeOfWater(event: number) {
    this.data.typeOfWater = event;
  }

  changeEmitDistanceToWater(event: number) {
    this.data.distanceToWater = event;
  }

  changeEmitTerritory(event: number) {
    this.data.territory = event;
  }

  changeEmitActivity(event: number) {
    this.data.activity = event;
  }

  changeEmitTotalNumber(event: number) {
    this.data.totalNumber = event;
  }

  changeEmitIncludingYoungAnimals(event: number) {
    this.data.includingYoungAnimals = event;
  }

  changeEmitIncludingFemaleAnimals(event: number) {
    this.data.includingFemaleAnimals = event;
  }

  changeEmitIncludingMaleAnimals(event: number) {
    this.data.includingMaleAnimals = event;
  }

  changeEmitComment(event: string) {
    this.data.comment = event;
  }

  changeGalleryImage(event: any) {
    this.data.gallery = event;
  }
}
