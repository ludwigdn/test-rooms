import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: HttpParams) {
    return this.http.get(environment.api_url + endpoint, { params: params });
  }

  post(endpoint: string, body: any) {
    return this.http.post(environment.api_url + endpoint, body);
  }

  put(endpoint: string, body: any) {
    return this.http.put(environment.api_url + endpoint, body);
  }

  delete(endpoint: string) {
    return this.http.delete(environment.api_url + endpoint);
  }
}