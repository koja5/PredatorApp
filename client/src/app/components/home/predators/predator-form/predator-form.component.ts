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
      .subscribe((data: PredatorFormModel) => {
        this.data = data;
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

  packData(): FormData {
    let data = new FormData();

    for (let [key, value] of Object.entries(this.data)) {
      data.append(key, value);
    }

    if (this.data.gallery) {
      for (let i = 0; i < this.data.gallery.length; i++) {
        data.append(
          'gallery[]',
          this.data.gallery[i],
          this.data.gallery[i].name
        );
      }
    }

    return data;
  }

  confirm() {
    this.isModalOpen = false;

    // let formData = new FormData();
    // for (let i = 0; i < this.data.gallery.length; i++) {
    //   formData.append(
    //     'gallery[]',
    //     this.data.gallery[i],
    //     this.data.gallery[i].name
    //   );
    // }

    const data = this.packData();

    this._service
      .callPostMethod('api/upload/setPredator', data)
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
    this.data.type_of_water = event;
  }

  changeEmitDistanceToWater(event: number) {
    this.data.distance_to_water = event;
  }

  changeEmitTerritory(event: number) {
    this.data.territory = event;
  }

  changeEmitActivity(event: number) {
    this.data.activity = event;
  }

  changeEmitTotalNumber(event: number) {
    this.data.total_number = event;
  }

  changeEmitIncludingYoungAnimals(event: number) {
    this.data.including_young_animals = event;
  }

  changeEmitIncludingFemaleAnimals(event: number) {
    this.data.including_female_animals = event;
  }

  changeEmitIncludingMaleAnimals(event: number) {
    this.data.including_male_animals = event;
  }

  changeEmitComment(event: string) {
    this.data.comment = event;
  }

  changeGalleryImage(event: any) {
    this.data.gallery = event;
  }
}
