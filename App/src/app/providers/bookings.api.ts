import { Injectable } from '@angular/core';
import { Api } from './api';
import { HttpParams } from '@angular/common/http';
import { Booking } from '../classes/booking';

@Injectable()
export class BookingsApi {
  private _url: string = 'bookings/';

  constructor(private _api: Api) {
  }

  getAll(beginsBefore?: Date, endsAfter?: Date, roomName?: string) {
    let params = new HttpParams();
    if (beginsBefore && beginsBefore.toString().trim()) {
      params = params.append("beginsBefore", beginsBefore.toISOString());
    }
    if (endsAfter && endsAfter.toString().trim()) {
      params = params.append("endsAfter", endsAfter.toISOString());
    }
    if (roomName && roomName.toString().trim()) {
      params = params.append("roomName", roomName);
    }
    return this._api.get(this._url, params);
  }

  get(id: string) {
    return this._api.get(this._url + id);
  }

  create(newBooking: Booking) {
    return this._api.post(this._url, newBooking.toJsonBody());
  }

  delete(id: string) {
    return this._api.delete(this._url + id);
  }
}