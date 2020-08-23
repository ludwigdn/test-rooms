import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../i18n/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  page: string = "Index";

  welcomeDescription_text: string = "WELCOMEDESCRIPTION_TEXT";
  welcomeTitle_text: string = "WELCOMETITLE_TEXT";
  roomsButton_text: string = "ROOMSBUTTON_TEXT";
  bookButton_text: string = "BOOKBUTTON_TEXT";
  bookingsButton_text: string = "BOOKINGSBUTTON_TEXT";
  creditsButton_text: string = "CREDITSBUTTON_TEXT";
  thanksTitle_text: string = "THANKSTITLE_TEXT";
  thanksDescription_text: string = "THANKSDESCRIPTION_TEXT";
  thanksButton_text: string = "THANKSBUTTON_TEXT";

  // todo update this sytem when ther's more than these two languages
  isEnglishSelected = false;

  get language() {
    return this.isEnglishSelected ? 'en' : 'fr';
  } 

  constructor(private _translate: TranslateService) {}

  ngOnInit(): void {
    this._setLanguage(this.language);
  }

  switchLang() {
    this.isEnglishSelected = !this.isEnglishSelected;
    this._setLanguage(this.language);
  }

  private _setLanguage(lang) {
    this._translate.use(lang);
  }
}