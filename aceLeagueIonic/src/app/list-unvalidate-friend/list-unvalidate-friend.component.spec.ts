import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListUnvalidateFriendComponent } from './list-unvalidate-friend.component';

describe('ListUnvalidateFriendComponent', () => {
  let component: ListUnvalidateFriendComponent;
  let fixture: ComponentFixture<ListUnvalidateFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUnvalidateFriendComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListUnvalidateFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
