import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { ListCommunicationComponent } from './list-communication/list-communication.component';
import { PublicationComponent } from './publication/publication.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchComponent } from './search/search.component';
import { NotificationComponent } from './notification/notification.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ListSettingsComponent } from './list-settings/list-settings.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { EditCommunicationComponent } from './edit-communication/edit-communication.component';
import { HeaderComponent } from './header/header.component';
import { ProComponent } from './pro/pro.component';
import { GroupeComponent } from './groupe/groupe.component';
import { EditGroupeComponent } from './edit-groupe/edit-groupe.component';
import { EditProComponent } from './edit-pro/edit-pro.component';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { CommentaireComponent } from './commentaire/commentaire.component';
import { ListUnvalidateFriendComponent } from './list-unvalidate-friend/list-unvalidate-friend.component';
import { EditUserGroupeComponent } from './edit-user-groupe/edit-user-groupe.component';
import {NgxImageCompressService} from 'ngx-image-compress';
const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RegisterComponent,
    ListNotificationComponent,
    ListCommunicationComponent,
    PublicationComponent,
    ProfileComponent,
    SettingsComponent,
    SearchComponent,
    NotificationComponent,
    NewsFeedComponent,
    NavbarComponent,
    EditProfileComponent,
    ListSettingsComponent,
    EditCommunicationComponent,
    HeaderComponent,
    ProComponent,
    GroupeComponent,
    EditGroupeComponent,
    EditProComponent,
    UploadPictureComponent,
    CommentaireComponent,
    ListUnvalidateFriendComponent,
    EditUserGroupeComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, HttpClientModule, SocketIoModule.forRoot(config)],
  providers: [
    StatusBar,
    NgxImageCompressService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
