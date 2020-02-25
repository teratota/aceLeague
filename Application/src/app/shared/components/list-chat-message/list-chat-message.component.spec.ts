import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChatMessageComponent } from './list-chat-message.component';

describe('ListChatMessageComponent', () => {
  let component: ListChatMessageComponent;
  let fixture: ComponentFixture<ListChatMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChatMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
