import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendChatMessageComponent } from './send-chat-message.component';

describe('SendChatMessageComponent', () => {
  let component: SendChatMessageComponent;
  let fixture: ComponentFixture<SendChatMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendChatMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
