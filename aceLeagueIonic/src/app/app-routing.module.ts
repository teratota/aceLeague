import { ListSettingsComponent } from './list-settings/list-settings.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { ListCommunicationComponent } from './list-communication/list-communication.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { NotificationComponent } from './notification/notification.component';
import { ProfileComponent } from './profile/profile.component';
import { PublicationComponent } from './publication/publication.component';
import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditCommunicationComponent } from './edit-communication/edit-communication.component';
import { ProComponent } from './pro/pro.component';
import { GroupeComponent } from './groupe/groupe.component';
import { EditProComponent } from './edit-pro/edit-pro.component';
import { EditGroupeComponent } from './edit-groupe/edit-groupe.component';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { CommentaireComponent } from './commentaire/commentaire.component';
import { ListUnvalidateFriendComponent } from './list-unvalidate-friend/list-unvalidate-friend.component';
import { EditUserGroupeComponent } from './edit-user-groupe/edit-user-groupe.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path : '', component : LoginComponent},
  { path : 'app', component : AppComponent},
  { path : 'register', component : RegisterComponent},
  { path : 'navbar', component : NavbarComponent},
  { path : 'header', component : HeaderComponent},
  { path : 'chat', component : ChatComponent},
  { path : 'listCommunication', component : ListCommunicationComponent},
  { path : 'listNotification', component : ListNotificationComponent},
  { path : 'notification', component : NotificationComponent},
  { path : 'profile', component : ProfileComponent},
  { path : 'profileReload', component : ProfileComponent},
  { path : 'publication', component : PublicationComponent},
  { path : 'search', component : SearchComponent},
  { path : 'settings', component : SettingsComponent},
  { path : 'newsfeed', component : NewsFeedComponent},
  { path : 'newsfeedReload', component : NewsFeedComponent},
  { path : 'edit', component : EditProfileComponent},
  { path : 'listSetting', component : ListSettingsComponent},
  { path : 'editCommunication', component : EditCommunicationComponent},
  { path : 'pro', component : ProComponent},
  { path : 'proReload', component : ProComponent},
  { path : 'groupe', component : GroupeComponent},
  { path : 'groupeReload', component : GroupeComponent},
  { path : 'editPro', component : EditProComponent},
  { path : 'editGroupe', component : EditGroupeComponent},
  { path : 'uploadPicture', component : UploadPictureComponent},
  { path : 'commentaire', component : CommentaireComponent},
  { path : 'listfriendnotvalidate', component : ListUnvalidateFriendComponent},
  { path : 'editusergroupe', component : EditUserGroupeComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
