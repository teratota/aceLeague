import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { ListChatMessageComponent } from './list-chat-message/list-chat-message.component';
import { ListCommunicationComponent } from './list-communication/list-communication.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { ListPublicationComponent } from './list-publication/list-publication.component';
import { NotificationComponent } from './notification/notification.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicationComponent } from './publication/publication.component';
import { SearchComponent } from './search/search.component';
import { SendChatMessageComponent } from './send-chat-message/send-chat-message.component';
import { SettingsComponent } from './settings/settings.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  { path : '', component : LoginComponent},
  { path : 'register', component : RegisterComponent},
  { path : 'chat', component : ChatComponent},
  { path : 'listChatMessage', component : ListChatMessageComponent},
  { path : 'listCommunication', component : ListCommunicationComponent},
  { path : 'listNotification', component : ListNotificationComponent},
  { path : 'listPublication', component : ListPublicationComponent},
  { path : 'notification', component : NotificationComponent},
  { path : 'profile', component : ProfileComponent},
  { path : 'publication', component : PublicationComponent},
  { path : 'search', component : SearchComponent},
  { path : 'sendChatMessage', component : SendChatMessageComponent},
  { path : 'settings', component : SettingsComponent},
  { path : 'newsfeed', component : NewsFeedComponent},
  { path : 'edit', component : EditProfileComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
