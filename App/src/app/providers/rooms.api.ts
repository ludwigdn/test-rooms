import { Injectable } from '@angular/core';
import { Api } from './api';
import { HttpParams } from '@angular/common/http';
import { Equipment } from '../classes/equipment';

@Injectable()
export class RoomsApi {
  private _url: string = 'rooms/';

  constructor(private _api: Api) {
  }

  getAll(name?: string, minCapacity?: number, maxCapacity?: number, equipments?: Equipment[]) {
    let params = new HttpParams();   
    if (name && name.toString().trim()) {
      params = params.append("name", encodeURIComponent(name));
    }
    if (minCapacity && minCapacity.toString().trim()) {
      params = params.append("minCapacity", minCapacity.toString());
    }
    if (maxCapacity && maxCapacity.toString().trim()) {
      params = params.append("maxCapacity", maxCapacity.toString());
    }
    if (equipments && equipments.length > 0) {
      params = params.append("equipments", equipments.filter(x => x && x.Name && x.Name.trim()).map(x => x.Name + ",").toString());
    }
    return this._api.get(this._url, params);
  }

  get(id: string) {
    return this._api.get(this._url + id);
  }
}