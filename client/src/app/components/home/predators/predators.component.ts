import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PredatorFormComponent } from './predator-form/predator-form.component';

@Component({
  selector: 'app-predators',
  templateUrl: './predators.component.html',
  styleUrls: ['./predators.component.scss'],
})
export class PredatorsComponent implements OnInit {
  @ViewChild('createNewEntryButton') createNewEntryButton!: ElementRef;
  @ViewChild(PredatorFormComponent)
  editFormComponent!: PredatorFormComponent;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: any): void {
    if (!this.createNewEntryButton.nativeElement.contains(event.target)) {
      this.active = '';
    }
  }

  public imageSource: any;
  public active = '';

  constructor() {}

  ngOnInit() {}

  takePicture = async () => {
    this.active = '';
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.imageSource = image.dataUrl;
  };

  openAction() {
    if (this.active === '') {
      this.active = 'active';
    } else {
      this.active = '';
    }
  }

  addManually() {
    this.editFormComponent.open();
  }
}
