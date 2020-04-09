import { Injectable } from '@angular/core';
export class Message {
	id: string;
	token: string;
	message: string;
}
export class Jsonformat{
	username: string;
	message: string;
}
@Injectable()
export class chatMessage {
  dicussion: Array<string>;
}