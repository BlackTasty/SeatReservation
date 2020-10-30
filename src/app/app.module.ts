import { ControlsModule } from './controls.module';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BasicAuthInterceptor } from './core/authentication/basic-auth.interceptor';
import { ErrorInterceptor } from './core/authentication/error.interceptor';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { MovieBannerComponent } from './shared/components/movie-banner/movie-banner.component';
import { MovieCardComponent } from './shared/components/movie-card/movie-card.component';
import { LoginComponent } from './components/login/login.component';

import localeDeAt from '@angular/common/locales/de-AT';
import { MatNativeDateModule } from '@angular/material';
import { ClickableSeatComponent } from './shared/components/clickable-seat/clickable-seat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountComponent,
    SettingsComponent,
    PageNotFoundComponent,
    MovieBannerComponent,
    MovieCardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    ControlsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'de-AT' },
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeDeAt);
  }
}
