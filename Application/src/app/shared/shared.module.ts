import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CvComponent } from './components/cv/cv.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SearchComponent } from './components/search/search.component';
import { PublicationComponent } from './components/publication/publication.component';
import { ListPublicationComponent } from './components/list-publication/list-publication.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ListNotificationComponent } from './components/list-notification/list-notification.component';
import { ListCommunicationComponent } from './components/list-communication/list-communication.component';
import { ChatComponent } from './components/chat/chat.component';
import { ListChatMessageComponent } from './components/list-chat-message/list-chat-message.component';
import { SendChatMessageComponent } from './components/send-chat-message/send-chat-message.component';
import { RouterModule } from '@angular/router';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, AuthenticationComponent, LoginComponent, RegisterComponent, CvComponent, ProfileComponent, SettingsComponent, SearchComponent, PublicationComponent, ListPublicationComponent, NotificationComponent, ListNotificationComponent, ListCommunicationComponent, ChatComponent, ListChatMessageComponent, SendChatMessageComponent, NewsFeedComponent],
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [TranslateModule, WebviewDirective, FormsModule]
})
export class SharedModule {}
