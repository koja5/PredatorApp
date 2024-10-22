import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  public geolocation: any;

  constructor() {}

  async ngOnInit() {
    this.geolocation = await Geolocation.getCurrentPosition();
  }

  onIonInfinite(ev: any) {
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
