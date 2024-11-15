import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageItem } from 'ng-gallery';
import { CallApiService } from 'src/app/services/call-api.service';
import { PredatorModel } from '../../models/predator.model';
import Map from 'ol/Map';
import View from 'ol/View';
import { OGCMapTile, OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Geolocation } from '@capacitor/geolocation';
import { useGeographic } from 'ol/proj';

useGeographic();

const iconFeature = new Feature({
  geometry: new Point([13.330013, 41.929868]),
  name: 'Null Island',
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

const rasterLayer = new TileLayer({
  source: new OGCMapTile({
    url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
    crossOrigin: '',
  }),
});

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

    const geolocation = await Geolocation.getCurrentPosition();

    this.map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: 'map',
      view: new View({
        center: [13.330013, 41.929868],
        zoom: 5,
        maxZoom: 18,
      }),
    });
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
