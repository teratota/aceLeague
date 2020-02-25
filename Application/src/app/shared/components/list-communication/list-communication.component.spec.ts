import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommunicationComponent } from './list-communication.component';

describe('ListCommunicationComponent', () => {
  let component: ListCommunicationComponent;
  let fixture: ComponentFixture<ListCommunicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCommunicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
