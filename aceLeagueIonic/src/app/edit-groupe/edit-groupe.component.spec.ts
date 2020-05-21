import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditGroupeComponent } from './edit-groupe.component';

describe('EditGroupeComponent', () => {
  let component: EditGroupeComponent;
  let fixture: ComponentFixture<EditGroupeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
