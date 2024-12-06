import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CallApiService } from 'src/app/services/call-api.service';
import {
  ActivityModel,
  DataPredatorsModel,
  PredatorItemModel,
  TerritoryModel,
  TypeOfWaterModel,
} from './data-predators.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { PredatorModel } from '../../models/predator.model';
import { QuestionAlertComponent } from 'src/app/components/common/question-alert/question-alert.component';
import { HttpProviderService } from 'src/app/services/http-provider/http-provider.service';
import { HttpNativeService } from 'src/app/services/http-provider/http-native.service';

@Component({
  selector: 'app-predator-edit',
  templateUrl: './predator-edit.component.html',
  styleUrls: ['./predator-edit.component.scss'],
})
export class PredatorEditComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(QuestionAlertComponent) alertQuestion: QuestionAlertComponent;
  @Input() gallery: any;
  @Output() refreshEmit = new EventEmitter();

  public message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  public name!: string;
  public isModalOpen = false;
  public data = new PredatorModel();
  public uploaded: any = [];
  public allItems = new DataPredatorsModel();
  public isGalleryOpen = false;
  public predatorNotes: any;
  public loader = false;

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _http: HttpNativeService
  ) {}

  //#region INIT

  async ngOnInit() {
    this.getAllPredators();
    this.getAllTypeOfWaters();
    this.getAllTerritories();
    this.getAllActivities();

    if (this.gallery) {
      this.data.gallery = this.gallery;
    } else if (this._activatedRouter.snapshot.params.id != 'new') {
      this.loader = true;
      this._service
        .callGetMethod(
          '/api/user/getPredatorForEditById',
          this._activatedRouter.snapshot.params.id
        )
        .subscribe((data: any) => {
          this.data = data;
          this.loader = false;
        });
    }

    if (!this.data.longitude && !this.data.latitude) {
      const geolocation = await Geolocation.getCurrentPosition();

      this.data.longitude = geolocation.coords.longitude;
      this.data.latitude = geolocation.coords.latitude;
    }

    this.isModalOpen = true;
  }

  //#endregion

  //#region GET REQUIRED DATA

  getAllPredators() {
    this._service
      .callGetMethod('/api/user/getAllPredators')
      .subscribe((data: PredatorItemModel) => {
        this.allItems.predators = data;
      });
  }

  getAllTypeOfWaters() {
    this._service
      .callGetMethod('/api/user/getAllTypeOfWaters')
      .subscribe((data: TypeOfWaterModel) => {
        this.allItems.typeOfWaters = data;
      });
  }

  getAllTerritories() {
    this._service
      .callGetMethod('/api/user/getAllTerritories')
      .subscribe((data: TerritoryModel) => {
        this.allItems.territories = data;
      });
  }

  getAllActivities() {
    this._service
      .callGetMethod('/api/user/getAllActivities')
      .subscribe((data: ActivityModel) => {
        this.allItems.activities = data;
      });
  }

  //#endregion

  open() {
    this.isModalOpen = true;
  }

  cancel() {
    this.backToPreviousPage();
  }

  //#region SAVE

  save() {
    const data = this.packData();

    // this._service.callPostMethod('/api/upload/setPredator', data).subscribe(
    //   (data: any) => {
    //     this.backToPreviousPage();
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
    this.loader = true;
    this._http.post('/api/upload/setPredator', data).then((data: any) => {
      this.loader = false;
      this.backToPreviousPage();
    });
  }

  packData(): FormData {
    let data = new FormData();

    for (let [key, value] of Object.entries(this.data)) {
      data.append(key, value);
    }

    for (let i = 0; i < this.uploaded.length; i++) {
      data.append(
        'gallery[]',
        this.uploaded[i],
        this.uploaded[i].name ? this.uploaded[i].name : this.uploaded[i]
      );
    }

    return data;
  }

  //#endregion

  decisionDeletePredator(event: boolean) {
    if (event) {
      this.deletePredator();
    }
  }

  deletePredator() {
    this._service
      .callPostMethod('/api/user/deletePredator', this.data)
      .subscribe((data: any) => {
        if (data) {
          this.isModalOpen = false;
          setTimeout(() => {
            this._router.navigate(['home/predators']);
          }, 100);
        }
      });
  }

  backToPreviousPage() {
    this.isModalOpen = false;
    if (this._activatedRouter.snapshot.params.id) {
      this._location.back();
    } else {
      this.refreshEmit.emit();
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  //#region CHANGE EMITTER

  changeEmitPredator(event: number) {
    this.data.id_predator = event;
  }

  changeEmitTypeOfWater(event: number) {
    this.data.id_type_of_water = event;
  }

  changeEmitDistanceToWater(event: number) {
    this.data.distance_to_water = event;
  }

  changeEmitTerritory(event: number) {
    this.data.id_territory = event;
  }

  changeEmitActivity(event: number) {
    this.data.id_activity = event;
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
    this.data.gallery = event.gallery;
    this.uploaded = event.uploaded;
  }

  //#endregion
}
