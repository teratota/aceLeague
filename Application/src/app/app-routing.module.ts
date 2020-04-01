import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { HomeComponent } from './shared/components/home/home.component';
import { AuthenticationComponent } from './shared/components/authentication/authentication.component';
import { ChatComponent } from './shared/components/chat/chat.component';
import { CvComponent } from './shared/components/cv/cv.component';
import { ListChatMessageComponent } from './shared/components/list-chat-message/list-chat-message.component';
import { ListCommunicationComponent } from './shared/components/list-communication/list-communication.component';
import { ListNotificationComponent } from './shared/components/list-notification/list-notification.component';
import { ListPublicationComponent } from './shared/components/list-publication/list-publication.component';
import { LoginComponent } from './shared/components/login/login.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { PublicationComponent } from './shared/components/publication/publication.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { SearchComponent } from './shared/components/search/search.component';
import { SendChatMessageComponent } from './shared/components/send-chat-message/send-chat-message.component';
import { SettingsComponent } from './shared/components/settings/settings.component';

const routes: Routes = [
  /*{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },*/
  { path : '', component : AuthenticationComponent},
  { path : 'home', component : HomeComponent},
  { path : 'chat', component : ChatComponent},
  { path : 'cv', component : CvComponent},
  { path : 'listChatMessage', component : ListChatMessageComponent},
  { path : 'listCommunication', component : ListCommunicationComponent},
  { path : 'listNotification', component : ListNotificationComponent},
  { path : 'listPublication', component : ListPublicationComponent},
  { path : 'login', component : LoginComponent},
  { path : 'notification', component : NotificationComponent},
  { path : 'profile', component : ProfileComponent},
  { path : 'publication', component : PublicationComponent},
  { path : 'register', component : RegisterComponent},
  { path : 'search', component : SearchComponent},
  { path : 'sendChatMessage', component : SendChatMessageComponent},
  { path : 'settings', component : SettingsComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
