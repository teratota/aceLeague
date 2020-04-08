

/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-chat-message',
  templateUrl: './list-chat-message.component.html',
  styleUrls: ['./list-chat-message.component.scss']
})
export class ListChatMessageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DocumentService } from './../../service/chat.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './list-chat-message.component.html',
  styleUrls: ['./list-chat-message.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Observable<string[]>;
  currentDoc: string;
  private _docSub: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.documents = this.documentService.documents;
    this._docSub = this.documentService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  loadDoc(id: string) {
    this.documentService.getDocument(id);
  }

  newDoc() {
    this.documentService.newDocument();
  }

}