import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppIonDatetimeButtonComponent } from './app-ion-datetime-button.component';

describe('AppIonDatetimeButtonComponent', () => {
  let component: AppIonDatetimeButtonComponent;
  let fixture: ComponentFixture<AppIonDatetimeButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIonDatetimeButtonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppIonDatetimeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
