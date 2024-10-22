import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public imageSource: any;

  constructor(private _domSanitizer: DomSanitizer) {}

  alert1() {
    alert('Test');
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      saveToGallery: false,
      promptLabelHeader: "Take a photo"
    });

    this.imageSource = this._domSanitizer.bypassSecurityTrustUrl(
      image.webPath ? image.webPath : ''
    );
  };

  getPhoto() {
    return this.imageSource;
  }
}
