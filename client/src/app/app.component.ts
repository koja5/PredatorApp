import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public imageSource: any;

  constructor(
    private _domSanitizer: DomSanitizer,
    private _translateService: TranslateService,
    private _storageService: StorageService
  ) {
    // Add languages to the translation service
    this._translateService.addLangs(['en', 'de']);
  }

  ngOnInit() {
    this.initializeLanguage();
  }

  initializeLanguage() {
    setTimeout(() => {
      const language = this._storageService.getSelectedLanguage();
      if (language) {
        this._translateService.setDefaultLang(language);
        this._translateService.use(language);
      } else if (this._translateService.currentLang) {
        this._translateService.setDefaultLang(
          this._translateService.currentLang
        );
        this._translateService.use(this._translateService.currentLang);
      } else {
        const appLanguage = 'de';
        this._translateService.setDefaultLang(appLanguage);
        this._translateService.use(appLanguage);
      }
    }, 10);
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      saveToGallery: false,
      promptLabelHeader: 'Take a photo',
    });

    this.imageSource = this._domSanitizer.bypassSecurityTrustUrl(
      image.webPath ? image.webPath : ''
    );
  };

  getPhoto() {
    return this.imageSource;
  }
}
