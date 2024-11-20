import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() longitude: number;
  @Input() latitude: number;

  public map!: Map;

  constructor() {}

  async ngOnInit() {
    if (!this.longitude && !this.latitude) {
      const geolocation = await Geolocation.getCurrentPosition();
      this.setPoint(geolocation.coords.longitude, geolocation.coords.latitude);
    } else {
      this.setPoint(this.longitude, this.latitude);
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

    this.map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: 'map',
      view: new View({
        center: [longitude, latitude],
        zoom: 5,
        maxZoom: 18,
      }),
    });
  }
}
