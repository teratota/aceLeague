import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ListPublicationComponent } from './list-publication/list-publication.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { ListCommunicationComponent } from './list-communication/list-communication.component';
import { ListChatMessageComponent } from './list-chat-message/list-chat-message.component';
import { PublicationComponent } from './publication/publication.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { SendChatMessageComponent } from './send-chat-message/send-chat-message.component';
import { SearchComponent } from './search/search.component';
import { NotificationComponent } from './notification/notification.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ListSettingsComponent } from './list-settings/list-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RegisterComponent,
    ListPublicationComponent,
    ListNotificationComponent,
    ListCommunicationComponent,
    ListChatMessageComponent,
    PublicationComponent,
    ProfileComponent,
    SettingsComponent,
    SendChatMessageComponent,
    SearchComponent,
    NotificationComponent,
    NewsFeedComponent,
    NavbarComponent,
    EditProfileComponent,
    ListSettingsComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule,HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
