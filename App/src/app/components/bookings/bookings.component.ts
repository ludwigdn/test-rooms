import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from '../../classes/booking';
import { BookingsApi } from '../../providers/bookings.api';
import { Subscription } from '../../../../node_modules/rxjs';
import { TranslateService } from '../../i18n/translate.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit, OnDestroy {
  // Text to translate
  bookingsTitle_text: string = "BOOKINGSTITLE_TEXT";
  bookingsFrom_text: string = "FROMHOUR_TEXT";
  bookingsTo_text: string = "TOHOUR_TEXT";
  bookingsRoomName_text: string = "BOOKINGSROOMNAME_TEXT";
  bookingsBooker_text: string = "BOOKINGSBOOKER_TEXT";
  refreshButton_text: string = "REFRESH_TEXT";
  noBookings_text: string = "NOBOOKINGS_TEXT";
  ongoingBookings_text: string = "ONGOINGBOOKINGS_TEXT";
  passedBookings_text: string = "PASSEDBOOKINGS_TEXT";
  // Subscriptions
  private _bookingsSubscription: Subscription = undefined;
  private _deleteBookingSubscription: Subscription = undefined;
  // Binded values
  bookings: Booking[] = [];
  passedBookings: Booking[] = [];
  isLoading: boolean = false;

  constructor(private _api: BookingsApi, private _translate: TranslateService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    this._getBookings();
  }

  ngOnDestroy(): void {
    this.bookings = [];
    this.passedBookings = [];
    this.isLoading = false;

    if (this._bookingsSubscription) {
      this._bookingsSubscription.unsubscribe();
    }
    if (this._deleteBookingSubscription) {
      this._deleteBookingSubscription.unsubscribe();
    }

    this._deleteBookingSubscription = undefined;
    this._bookingsSubscription = undefined;
  }

  private _getBookings() {
    this._bookingsSubscription = this._api.getAll().subscribe((res) => {
      let tempArray: Booking[] = [];
      if (res) {
        for (var index in res) {
          let collection = res[index];
          tempArray.push(Booking.NewFromJson(collection));
        }
      }

      let now = new Date();
      let ongoinBookings = tempArray.filter(booking => booking.BookedFrom >= now);

      let overBookings = tempArray.filter(booking => booking.BookedTo < now);

      this.bookings = this._sortArray(ongoinBookings, false);
      this.passedBookings = this._sortArray(overBookings);
    }, err => {
      this.bookings = [];
      this.passedBookings = [];
    }, () => {
      this.isLoading = false;
    });
  }

  _sortArray(array, desc: boolean = true) {

    return desc
      ? array.sort(function (a: Booking, b: Booking) { return a.BookedFrom < b.BookedFrom ? 1 : -1 })
      : array.sort(function (a: Booking, b: Booking) { return a.BookedFrom > b.BookedFrom ? 1 : -1 });
  }

  deleteBooking(id) {
    this._deleteBookingSubscription = this._api.delete(id).subscribe((res) => {
      if (res) { }
    }, err => {
    }, () => {
      this.isLoading = false;
      this.refresh();
    });
  }

  getFormattedDateInformation(booking: Booking): string {
    let fromText = this._translate.do(this.bookingsFrom_text);
    let toText = this._translate.do(this.bookingsTo_text);
    let date = booking.BookedFrom.toLocaleDateString();
    let startTime = booking.BookedFrom.getHours() + ':' + (booking.BookedFrom.getMinutes()<10?'0':'') + booking.BookedFrom.getMinutes();
    let endTime = booking.BookedTo.getHours() + ':' + (booking.BookedTo.getMinutes()<10?'0':'') +booking.BookedTo.getMinutes();

    return date + ' ' + fromText + ' ' + startTime + ' ' + toText + ' ' + endTime ;
  }
}
