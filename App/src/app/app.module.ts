import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Components
import { AppComponent } from './components/app/app.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BookComponent } from './components/book/book.component';
// Providers
import { RoomsApi } from './providers/rooms.api';
import { Api } from './providers/api';
import { BookingsApi } from './providers/bookings.api';
// Translation
import { TRANSLATION_PROVIDERS } from './i18n/translations';
import { TranslateService } from './i18n/translate.service';
import { TranslatePipe } from './i18n/translate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    BookingsComponent,
    BookComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CalendarModule,
    SliderModule
  ],
  providers: [
    Api,
    RoomsApi,
    BookingsApi,
    TRANSLATION_PROVIDERS,
    TranslateService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
