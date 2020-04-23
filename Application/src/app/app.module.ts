import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConnexionComponent } from './shared/components/connexion/connexion.component';

import { AppComponent } from './app.component';
import { HomeModule } from './shared/components/home/home.module';
import { RouterModule } from '@angular/router';

// Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// TinySlider 
import {NgxTinySliderModule} from 'ngx-tiny-slider';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    ConnexionComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    RouterModule,
    SharedModule,
    HomeModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    NgxTinySliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    NgxTinySliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
