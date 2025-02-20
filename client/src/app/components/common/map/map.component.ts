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
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Geolocation } from '@capacitor/geolocation';
import { useGeographic } from 'ol/proj';
import { StorageService } from 'src/app/services/storage.service';

useGeographic();

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() longitude: number;
  @Input() latitude: number;
  @Input() manual: boolean = true;

  @ViewChild('map') public map!: Map;

  constructor(private _storageService: StorageService) {}

  async ngOnInit() {
    if (!this.longitude && !this.latitude) {
      const geolocation = await Geolocation.getCurrentPosition();
      this.setPoint(geolocation.coords.longitude, geolocation.coords.latitude);
    } else {
      this.setPoint(this.longitude, this.latitude);
    }

    if (this.manual) {
      this.map.on('singleclick', function (this: MapComponent, evt) {
        const coordinate = evt.coordinate;
        coordinate[1] += 0.0001;
        const iconFeature = new Feature({
          geometry: new Point([coordinate[0], coordinate[1]]),
          name: 'Null Island',
          population: 4000,
          rainfall: 500,
        });

        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'assets/icon/map-marker.svg',
            width: 25,
            height: 25,
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

        evt.map.setLayers([
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ]);
        evt.map.setView(
          new View({
            center: [coordinate[0], coordinate[1]],
            zoom: 80,
            maxZoom: 18,
          })
        );
        localStorage.setItem(
          'coordination',
          JSON.stringify({ log: coordinate[0], lat: coordinate[1] })
        );
      });
    }
  }

  setPoint(longitude: number, latitude: number) {
    const iconFeature = new Feature({
      geometry: new Point([longitude, latitude]),
      name: 'Null Island',
      population: 4000,
      rainfall: 500,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/icon/map-marker.svg',
        width: 25,
        height: 25,
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

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      target: 'map',
      view: new View({
        center: [longitude, latitude],
        zoom: 80,
        maxZoom: 18,
      }),
    });
  }

  // addMarker(longitude, latitude) {
  //   console.log('lon:', lon);
  //   console.log('lat:', lat);

  //   var iconFeatures = [];

  //   const iconStyle = new Style({
  //     image: new Icon({
  //       anchor: [0.5, 46],
  //       anchorXUnits: 'fraction',
  //       anchorYUnits: 'pixels',
  //       src: 'assets/icon/map-marker.png',
  //       width: 32,
  //       height: 32,
  //     }),
  //   });
  //   const iconFeature = new Feature({
  //     geometry: new Point([longitude, latitude]),
  //     name: 'Null Island',
  //     population: 4000,
  //     rainfall: 500,
  //   });

  //   this.map.addLayer(iconFeature);
  // }
}
