export class Booking {
    Id: string;
    BookedFrom: Date;
    BookedTo: Date;
    RoomName: string;
    Booker: string;
    
    private constructor(json) {
        this.Id = json["_id"];
        this.BookedFrom = new Date(json["bookedFrom"]);
        this.BookedTo = new Date(json["bookedTo"]);
        this.RoomName = json["roomName"];
        this.Booker = json["booker"];
    }

    public getFromDate() :Date {
        return new Date(this.BookedFrom);
    }
    public getToDate() :Date {
        return new Date(this.BookedTo);
    }

    static NewFromJson(json): Booking {
        return new Booking(json);
    }

    static NewFromFields(id, bookedFrom, bookedTo, roomName, booker): Booking {
        var json = {
            _id: id,
            bookedFrom: bookedFrom,
            bookedTo: bookedTo,
            roomName: roomName,
            booker: booker,
        };
        return new Booking(json);
    }

    public toJsonBody() {
        return {
          "bookedFrom": this.BookedFrom.toISOString(),
          "bookedTo": this.BookedTo.toISOString(),
          "roomName": this.RoomName,
          "booker": this.Booker
        }
    }
}