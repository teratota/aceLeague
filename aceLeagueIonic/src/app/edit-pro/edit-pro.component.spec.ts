import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditProComponent } from './edit-pro.component';

describe('EditProComponent', () => {
  let component: EditProComponent;
  let fixture: ComponentFixture<EditProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
