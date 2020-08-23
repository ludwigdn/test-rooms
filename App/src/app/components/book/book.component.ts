import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Time } from '../../../../node_modules/@angular/common';
import { TranslateService } from '../../i18n';
import { RoomsApi } from '../../providers/rooms.api';
import { Subscription } from '../../../../node_modules/rxjs';
import { Room } from '../../classes/room';
import { BookingsApi } from '../../providers/bookings.api';
import { Booking } from '../../classes/booking';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, OnDestroy {
  // Default data
  bookerName: string = "The Joker"; // Set by default, but dynamic in a full app
  // Text to translate
  bookTitle_text: string = "BOOKTITLE_TEXT";
  bookFrom_text: string = "FROMHOUR_TEXT";
  bookTo_text: string = "TOHOUR_TEXT";
  onThe_text: string = "ONTHE_TEXT";
  refreshButton_text: string = "REFRESH_TEXT";
  roomsPeopleMaximum_text: string = "ROOMSPEOPLEMAXIMUM_TEXT";
  roomsDescription_text: string = "ROOMSDESCRIPTION_TEXT";
  roomsEquipments_text: string = "ROOMSEQUIPMENTS_TEXT";
  noEquipment_text: string = "NOEQUIPMENT_TEXT";
  bookRoomButton_text: string = "BOOKROOMBUTTON_TEXT";
  noRooms_text: string = "NOROOMS_TEXT";
  roomNameInput_text: string = "ROOMNAMEINPUT_TEXT"
  peopleAmountInput_text: string = "PEOPLEAMOUNTINPUT_TEXT"
  // Subscriptions
  private _roomsSubscription: Subscription = undefined;
  private _bookRoomSubscription: Subscription = undefined;
  private _bookingsSubscription: Subscription = undefined;
  // Bindeds values
  fr: any;
  en: any;
  rooms: Room[] = [];
  isLoading: boolean = false;
  minDate: Date = new Date();
  bookDay: Date = new Date();
  bookHourStart: Date = this._setTime(this.bookDay);
  bookHourEnd: Date = this._setTime(this.bookHourStart);
  input_room_Name: string = "";
  input_people_amount: number = 1;
  // Inputs  
  private _lang = '';
  @Input()
  set lang(lang: string) {
    this._lang = lang;
  }
  get lang(): string { return this._lang; }
  // Computed values
  get dateFormat() {
    return this.lang == 'fr' ? 'dd/mm/yy' : 'mm/dd/yy';
  }
  get localeTranslations() {
    switch (this.lang) {
      case "fr": return this.fr;
      case "en": return this.en;
      default: return this.fr;
    }
  }

  private get _dateFrom() {
    let year = this.bookDay.getFullYear();
    let month = this.bookDay.getMonth();
    let day = this.bookDay.getDate();
    let hour = this.bookHourStart.getHours();
    let minutes = this.bookHourStart.getMinutes();
    return new Date(year, month, day, hour, minutes);
  }

  private get _dateTo() {
    let year = this.bookDay.getFullYear();
    let month = this.bookDay.getMonth();
    let day = this.bookDay.getDate();
    let hour = this.bookHourEnd.getHours();
    let minutes = this.bookHourEnd.getMinutes();
    return new Date(year, month, day, hour, minutes);
  }

  constructor(private _translationService: TranslateService, private _roomsApi: RoomsApi, private _bookingsApi: BookingsApi) {
  }

  ngOnInit() {
    this.fr = {
      firstDayOfWeek: 0,
      dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
      monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"],
      monthNamesShort: ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juill", "Août", "Sept", "Oct", "Nov", "Déc"],
      today: 'Aujourd\'hui',
      clear: 'Réinitialiser'
    };
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: 'Today',
      clear: 'Clear'
    };
  }

  ngOnDestroy(): void {
    this.rooms = [];
    this.isLoading = false;

    if (this._roomsSubscription) {
      this._roomsSubscription.unsubscribe();
    }
    if (this._bookRoomSubscription) {
      this._bookRoomSubscription.unsubscribe();
    }
    if (this._bookingsSubscription) {
      this._bookingsSubscription.unsubscribe();
    }

    this._bookingsSubscription = undefined;
    this._bookRoomSubscription = undefined;
    this._roomsSubscription = undefined;
  }

  refresh() {
    this.isLoading = true;
    this._getRooms();
  }

  private _getRooms() {    
    this._bookingsSubscription = this._bookingsApi.getAll(this._dateTo, this._dateFrom).subscribe((res) => {
      if (res) {
        let bookingsTempArray: string[] = [];
        for (var index in res) {
          let collection = res[index];
          let roomName = Booking.NewFromJson(collection).RoomName;
          if (bookingsTempArray.includes(roomName)) continue;
          bookingsTempArray.push(roomName);
        }
        this._roomsSubscription = this._roomsApi.getAll(this.input_room_Name, this.input_people_amount).subscribe((res) => {
          let tempArray: Room[] = [];
          if (res) {
            for (var index in res) {
              let collection = res[index];
              let room = Room.NewFromJson(collection);
              if (bookingsTempArray.includes(room.Name)) continue;
              tempArray.push(room);
            }
          }
          this.rooms = this._sortArray(tempArray);
          this.isLoading = false;
        }, err => {
          this.isLoading = false;
          this.rooms = [];
        });
      }
    }, err => {
      this.isLoading = false;
      this.rooms = [];
    });
  }

  bookRoom(roomName) {
    let newBooking = Booking.NewFromFields(0, this._dateFrom, this._dateTo, roomName, this.bookerName);
    this._bookRoomSubscription = this._bookingsApi.create(newBooking).subscribe((res) => {
      this.isLoading = false
    }, err => {
      this.isLoading = false;
      this.rooms = [];
    }, () => {
      this.refresh();
    });
  }

  private _sortArray(array) {
    return array.sort(function (a, b) { return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1 })
  }

  private _setTime(baseTime): Date {
    let isPastHalf = baseTime.getMinutes() >= 30;
    let hour = isPastHalf ? baseTime.getHours() + 1 : baseTime.getHours();
    let minutes = isPastHalf ? 0 : 30;
    return new Date(1, 1, 1, hour, minutes)
  }
}
