import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllTypeOfWatersComponent } from './all-type-of-waters.component';

describe('AllTypeOfWatersComponent', () => {
  let component: AllTypeOfWatersComponent;
  let fixture: ComponentFixture<AllTypeOfWatersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTypeOfWatersComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllTypeOfWatersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
