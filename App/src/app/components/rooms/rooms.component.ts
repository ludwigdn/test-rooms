import { Component, OnInit, OnDestroy } from '@angular/core';
import { Room } from '../../classes/room';
import { RoomsApi } from '../../providers/rooms.api';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {
  // Text to translate
  roomsTitle_text: string = "ROOMSTITLE_TEXT";
  roomsPeopleMaximum_text: string = "ROOMSPEOPLEMAXIMUM_TEXT";
  roomsDescription_text: string = "ROOMSDESCRIPTION_TEXT";
  roomsEquipments_text: string = "ROOMSEQUIPMENTS_TEXT";
  refreshButton_text: string = "REFRESH_TEXT";
  // Subscriptions
  private _roomsSubscription: Subscription = undefined;
  // Binded values
  rooms: Room[] = [];
  isLoading: boolean = false;

  constructor(private _api: RoomsApi) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    this._getRooms();
  }

  ngOnDestroy(): void {
    this.rooms = [];
    this.isLoading = false;

    if (this._roomsSubscription) {
      this._roomsSubscription.unsubscribe();
    }

    this._roomsSubscription = undefined;
  }

  private _getRooms() {
    this._roomsSubscription = this._api.getAll().subscribe((res) => {
      let tempArray: Room[] = [];
      if (res) {
        for (var index in res) {
          let collection = res[index];
          tempArray.push(Room.NewFromJson(collection));
        }
      }
      this.rooms = this.sortArray(tempArray);
    }, err => {
      this.rooms = [];
    }, () => {
      this.isLoading = false;
    });
  }

  sortArray(array) {
    return array.sort(function (a, b) { return a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1 })
  }
}