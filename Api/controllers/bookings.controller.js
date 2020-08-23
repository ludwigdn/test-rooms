var dataPath = __dirname + '/../data/';
var bookingsPath = dataPath + '/bookings/bookings.json';
var bookingsList = require(bookingsPath);
var fs = require('fs');
var utils = require('./../utils/utils');
var lockUtils = require('../utils/lockUtils');
var Booking = require('../objects/booking');


/**
 * 
 * @param {*} beginsBefore 
 * @param {*} endsAfter 
 * @param {*} roomName 
 * @param {*} callback callback(error, bookingsList)
 */
exports.GetBookings = function(beginsBefore, endsAfter, roomName, callback) {
    try {
        let hasBeginDate = !utils.isNullOrWhitespace(beginsBefore);
        let hasEndDate = !utils.isNullOrWhitespace(endsAfter);
        let hasRoomName = !utils.isNullOrWhitespace(roomName);

        // Check if dates are valid and consistent between each other
        if (hasBeginDate && hasEndDate){
            if (new Date(endsAfter) >= new Date(beginsBefore))
                callback('End date can not be previous or equal to start date.');
        }
    
        // Setting up the list to return
        let roomsToReturn = bookingsList;
    
        // Filter bookings on min date
        if (hasBeginDate) {
            roomsToReturn = roomsToReturn.filter(booking => new Date(beginsBefore) > new Date(booking.bookedFrom));
        }
        // Filter bookings on max date
        if (hasEndDate) {
            roomsToReturn = roomsToReturn.filter(booking => new Date(endsAfter) < new Date(booking.bookedTo));
        }
        // Filter bookings on room name
        if (hasRoomName)  {
            roomsToReturn = roomsToReturn.filter(booking => booking.roomName.toLowerCase().includes(roomName.toLowerCase())); 
        }

        // Returns rooms
        callback(undefined, roomsToReturn);
    } catch (error) {
        callback(error);
    }
}

/**
 * 
 * @param {*} roomName 
 * @param {*} booker 
 * @param {*} bookedFrom 
 * @param {*} bookedTo 
 * @param {*} callback callback(error, newBooking)
 */
exports.AddBooking = function(roomName, booker, bookedFrom, bookedTo, callback) {
    try {
        // In-chain checks
        if(utils.isNullOrWhitespace(roomName) 
        || utils.isNullOrWhitespace(booker)
        || utils.isNullOrWhitespace(bookedFrom)
        || utils.isNullOrWhitespace(bookedTo)){
            return callback('Bad request');
        }

        // check if booking can be saved (with id)
        _checkIfBookingCanBeSaved(roomName, booker, bookedFrom, bookedTo, function(err, canBeSaved){
            if (err) return callback(err);
            if (canBeSaved === false) {
                console.debug('Can not add booking: already exists');
                callback({ status: 409 });
            } else if (canBeSaved === true) {
                // Wait to be able to add the booking
                console.debug('Wait to be able to add the booking');
                lockUtils.waitForBookingsFileLockRelease(function(err){
                    if (err) return callback(err);
                    // Add lock to prevent conflict with other users
                    console.debug('Add lock to prevent conflict with other users');
                    lockUtils.createNewLocktForBookingsFile(function(err, lockName){
                        if (err) return callback(err);
                        // Create the new booking
                        console.debug('Create the new booking');
                        let newBooking = new Booking(roomName, booker, bookedFrom, bookedTo);
                        let jsonFile = bookingsList;
                        jsonFile.push(newBooking);
                        // Add the new booking to the file
                        console.debug('Add the new booking to the file');
                        fs.writeFile(bookingsPath, JSON.stringify(jsonFile), {}, function(err){
                            if (err) return callback(err);
                            // Release the lock
                            console.debug('Release the lock');
                            lockUtils.releaseBookingsFileLock(lockName, function(err){
                                if (err) return callback(err);
                                callback();
                            })
                        });
                    });
                });
            } else {
                throw new Error('Problem occured while checking booking availability');
            }
        })
    } catch (error) {
        callback(error);
    }
}

/**
 * 
 * @param {*} roomName 
 * @param {*} callback callback(error)
 */
exports.DeleteBooking = function(bookingId, callback) {
    try {
        if(utils.isNullOrWhitespace(bookingId)){
            return callback('Bad request');
        }
        // check if booking can be saved (with id)
        _getBookingFromId(bookingId, function(err, booking){
            if (err) return callback(err);
            if (utils.isNullOrWhitespace(booking)) {
                console.debug('Can not delete bookins: does not exists');
                callback({ status: 404 });
            } else {
                // Wait to be able to add the booking
                console.debug('Wait to be able to delete booking');
                lockUtils.waitForBookingsFileLockRelease(function(err){
                    if (err) return callback(err);
                    // Add lock to prevent conflict with other users
                    console.debug('Add lock to prevent conflict with other users');
                    lockUtils.createNewLocktForBookingsFile(function(err, lockName){
                        if (err) return callback(err);
                        // Create the new booking
                        console.debug('Delete found booking');
                        let jsonFile = bookingsList;
                        let index = jsonFile.map(b => b._id).indexOf(bookingId);
                        jsonFile.splice(index, 1);
                        // Add the new booking to the file
                        fs.writeFile(bookingsPath, JSON.stringify(jsonFile), {}, function(err){
                            if (err) return callback(err);
                            // Release the lock
                            console.debug('Releasing created lock');
                            lockUtils.releaseBookingsFileLock(lockName, function(err){
                                if (err) return callback(err);
                                callback();
                            })
                        });
                    });
                });
            }
        })
    } catch (error) {
        callback(error);
    }
}


// Private functions

/**
 * 
 * @param {*} roomName 
 * @param {*} booker 
 * @param {*} bookedFrom 
 * @param {*} bookedTo 
 * @param {*} callback callback(error, canBeSaved)
 */
function _checkIfBookingCanBeSaved(roomName, booker, bookedFrom, bookedTo, callback) {
    try {
        let newBooking = new Booking(roomName, booker, bookedFrom, bookedTo);
        let overlappingBookings = bookingsList.filter(booking => newBooking.isOverlapping(Booking.createFromJson(booking)));
        callback(undefined, overlappingBookings.length == 0);
    } catch (error) {
        callback(error);
    }
}

/**
 * 
 * @param {*} roomName 
 * @param {*} booker 
 * @param {*} bookedFrom 
 * @param {*} bookedTo 
 * @param {*} callback callback(error, booking)
 */
function _getBookingFromId(bookingId, callback) {
    try {
        let bookings = bookingsList.filter(booking => Booking.createFromJson(booking)._id === bookingId.toLowerCase());
        if (bookings.length > 1) return callback({ status: 409, message: 'Conflicts for this booking id'});
        callback(undefined, bookings[0]);
    } catch (error) {
        callback(error);
    }
}