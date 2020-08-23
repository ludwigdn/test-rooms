function Booking(roomName, booker, bookedFrom, bookedTo) {
    let bookedFromIso = new Date(bookedFrom).toISOString();
    let bookedToIso = new Date(bookedTo).toISOString();

    // _id field is all fields concatenated, while only keeping alphanums characters
    this._id = (roomName + booker + bookedFromIso + bookedToIso).replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
    
    this.roomName = roomName;
    this.booker = booker;
    this.bookedFrom = bookedFromIso;
    this.bookedTo = bookedToIso;
}

Booking.prototype.isOverlapping = function (newBooking) {
    let hasSameId = newBooking._id == this._id;
    let isSameRoom = newBooking.roomName === this.roomName;
    let isStartOverlapping = new Date(newBooking.bookedFrom) >= new Date(this.bookedFrom) && new Date(newBooking.bookedFrom) < new Date(this.bookedTo);
    let isEndOverlapping = new Date(newBooking.bookedTo) <= new Date(this.bookedTo) && new Date(newBooking.bookedTo) > new Date(this.bookedFrom);
    var isOverlapping =  hasSameId || (isSameRoom && (isStartOverlapping || isEndOverlapping));
    return isOverlapping;
}

Booking.createFromJson = function (json) {
    return new Booking(json.roomName, json.booker, json.bookedFrom, json.bookedTo);
}

module.exports = Booking;