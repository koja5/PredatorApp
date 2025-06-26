import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
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
import { Geolocation, GeolocationOptions } from '@capacitor/geolocation';
import { PredatorModel } from '../../models/predator.model';
import { QuestionAlertComponent } from 'src/app/components/common/question-alert/question-alert.component';
import { HttpProviderService } from 'src/app/services/http-provider/http-provider.service';
import { HttpNativeService } from 'src/app/services/http-provider/http-native.service';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { HelpService } from 'src/app/services/help.service';

@Component({
  selector: 'app-predator-edit',
  templateUrl: './predator-edit.component.html',
  styleUrls: ['./predator-edit.component.scss'],
  standalone: false
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
  public requiredFields = [
    'id_activity',
    'id_predator',
    'id_territory',
    'id_type_of_water',
    'id_user',
  ];

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _http: HttpNativeService,
    private _toastr: ToastrComponent,
    private _translate: TranslateService,
    private _storageService: StorageService,
    private _helpService: HelpService,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(5, () => {
      this.isModalOpen = false;
      this.refreshEmit.emit();
      this._location.back();
    });
  }

  //#region INIT

  async ngOnInit() {
    this.isModalOpen = true;
    this.getAllPredators();
    this.getAllTypeOfWaters();
    this.getAllTerritories();
    this.getAllActivities();

    if (this.gallery) {
      this.data.gallery = this.gallery;
      this.checkGeolocation();
      this.initializeCreationDate();
    } else if (this._activatedRouter.snapshot.params.id != 'new') {
      this.loader = true;
      this._service
        .callGetMethod(
          '/api/user/getPredatorForEditById',
          this._activatedRouter.snapshot.params.id
        )
        .subscribe((data: any) => {
          this.data = data;
          this.checkGeolocation();
          this.loader = false;
        });
    } else {
      this.checkGeolocation();
      this.initializeCreationDate();
    }
  }

  initializeCreationDate() {
    const timezone = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)![1];
    this.data.creation_date = this._helpService.convertDateToIsoString(
      new Date()
    );
  }

  async checkGeolocation() {
    if (!this.data.longitude && !this.data.latitude) {
      const geolocation = await this._helpService.getCurrentLocation();
      this.loader = true;
      // const geolocation = await Geolocation.getCurrentPosition({
      //   enableHighAccuracy: true,
      //   timeout: 5000,
      //   maximumAge: 0,
      // });
      if (geolocation && geolocation.coords!) {
        this.data.longitude = geolocation.coords.longitude;
        this.data.latitude = geolocation.coords.latitude;
      }
      this.loader = false;
    }

    // const internalGetCurrentPosition = async (
    //   options: GeolocationOptions = {}
    // ): Promise<GeolocationPosition> => {
    //   return new Promise<GeolocationPosition>((resolve, reject) => {
    //     const id = Geolocation.watchPosition(options, (position, err) => {
    //       // Geolocation.clearWatch({ id });
    //       if (err) {
    //         reject(err);
    //         return;
    //       }
    //       console.log(position);
    //       // resolve(position);
    //     });
    //   });
    // };
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
    if (!this.checkRequiredValues()) {
      this._toastr.showErrorCustom(
        this._translate.instant('general.needToFillAllFields')
      );
      return;
    }

    const data = this.packData();

    this.loader = true;
    this._http.post('/api/upload/setPredator', data).then((data: any) => {
      this.loader = false;
      this.backToPreviousPage();
    });
  }

  checkRequiredValues() {
    if (!this.data.id_predator || !this.data.total_number) return false;

    return true;
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

    if (this._storageService.getLocalStorage('coordination')) {
      const coordinate = this._storageService.getLocalStorage('coordination');
      data.set('latitude', coordinate.lat);
      data.set('longitude', coordinate.log);

      this._storageService.removeLocalStorage('coordination');
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
    this.data.id_water = event;
  }

  changeEmitDistanceToWater(event: number) {
    this.data.distance_to_water = event;
  }

  changeEmitTerritory(event: number) {
    this.data.id_fish_district = event;
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

  changeEmitCreationDate(event: any) {
    this.data.creation_date = event;
  }

  //#endregion
}
