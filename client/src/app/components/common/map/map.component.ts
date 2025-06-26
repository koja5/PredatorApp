import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { OGCMapTile, OSM, TileDebug } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { Feature, Overlay } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Geolocation } from '@capacitor/geolocation';
import { useGeographic } from 'ol/proj';
import { StorageService } from 'src/app/services/storage.service';
import { HelpService } from 'src/app/services/help.service';

useGeographic();

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})
export class MapComponent implements OnInit {
  @Input() longitude: number;
  @Input() latitude: number;
  @Input() manual: boolean = true;
  @Input() mapMarkers: any = [];
  @ViewChild('map') public map!: Map;

  public loader = true;

  constructor(
    private _storageService: StorageService,
    private _helpService: HelpService
  ) {}

  async ngOnInit() {
    setTimeout(async () => {
      this.initializeMap();

      setTimeout(() => {
        if (this.manual) {
          this.map.on('singleclick', (evt) => {
            const coordinate = evt.coordinate;
            // coordinate[1] += 0.00011;
            const view = this.map.getView();
            // if (view['values_'] && view['values_'].zoom) {
            //   if (view['values_'].zoom / 10000 > 0.0017) {
            //     coordinate[1] += view['values_'].zoom / 10000 - 0.0017;
            //   } else {
            //     const difference = view['values_'].zoom / 10000 - 0.00025;
            //     coordinate[1] += view['values_'].zoom / 10000 - difference;
            //   }
            // } else {
            //   coordinate[1] += 0.00011;
            // }
            this.setPoint(coordinate[0], coordinate[1], evt.map);
            this._storageService.setLocalStorage('coordination', {
              log: coordinate[0],
              lat: coordinate[1],
            });
          });
        }
      }, 100);
    }, 20);
  }

  async initializeMap() {
    if (!this.longitude && !this.latitude) {
      const geolocation = await Geolocation.getCurrentPosition();
      this.setPoint(geolocation.coords.longitude, geolocation.coords.latitude);
    } else {
      this.setPoint(this.longitude, this.latitude);
    }
  }

  setPoint(longitude: number, latitude: number, map?: any) {
    if (map) {
      this.map = map;
    } else {
      this.map = new Map({});
    }

    const iconFeature = new Feature({
      geometry: new Point([longitude, latitude]),
      population: 4000,
      rainfall: 500,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/icon/map-marker.png',
        width: 32,
        height: 32,
      }),
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map.setLayers([
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer,
    ]);
    this.map.setTarget('map');
    const view = this.map.getView();
    this.map.setView(
      new View({
        center: [longitude, latitude],
        zoom: view && view['values_'].zoom ? view['values_'].zoom : 80,
        maxZoom: 18,
      })
    );
  }

  async getMyLocation() {
    const geolocation = await this._helpService.getCurrentLocation();
    if (geolocation) {
      this.longitude = geolocation.coords.longitude;
      this.latitude = geolocation.coords.latitude;
      localStorage.setItem(
        'coordination',
        JSON.stringify({
          log: this.longitude,
          lat: this.latitude,
        })
      );
      this.loader = false;
      setTimeout(() => {
        this.loader = true;
        this.ngOnInit();
      }, 100);
    }
  }
}
