'use strict';
var fs = require('fs');
var uuid = require('uuid');
var utils = require ('./utils');
var dataPath = __dirname + '/../data/';
var bookingsPath = dataPath + 'bookings/'

/**
 * Creates a new lock for the bookings file, to prevent conflicts
 * @param {*} callback callback(error, newLockName)
 */
exports.createNewLocktForBookingsFile = function(callback) {
    let randomLockName = uuid.v4().toString().split('-')[0]  + '.lock';
    let lockPath = bookingsPath + randomLockName;
    try {
        fs.writeFileSync(lockPath, 'a');
        console.debug('lock created: ' + randomLockName);
        return callback(undefined, randomLockName);
    } catch (error) {
        console.debug('Error logged: ' + error);
        return callback(error);
    }
}

/**
 * Check if any lock is currently set and wait for it to be released
 * @param {*} callback callback(error)
 */
exports.waitForBookingsFileLockRelease = function(callback) {
    try {   
        let delay = 5 * 1000; // 5 seconds
        let date = new Date();
        let timer = date.setTime(date.getTime() + delay);

        // Wait for 5s before forcing to release the lock
        let hasActiveLocks = _hasActiveLocks();
        console.debug('has active locks: looping');
        while (hasActiveLocks){
            console.debug('still has locks. ');
            let now = new Date();
            console.debug(now.getTime() - timer  + ' ms remaining before forcing lock release');
            if (now > timer){
                console.debug('Forcing locks relase...');
                this.releaseBookingsFileLock(undefined, function(err) {
                    if (err) return callback(err);
                    callback();
                });
                return;
            }
            hasActiveLocks = _hasActiveLocks();
        }
        console.debug('Has any more lock: ' + hasActiveLocks);
        return callback();        
    } catch (error) {        
        // If lock exists, signal the error. Else, do nothing
        if (_hasActiveLocks()){
            console.debug(error);
            console.debug('Error thrown while waiting for lock release, and there\'s still locks.');
            return callback(error);
        } else {
            console.debug('Error thrown while waiting for lock release, but all the locks are now gone.');
            return callback();
        }
    }
}

/**
 * Release booking locks
 * @param {*} lockName If specified, releaseit. If not, release all pending locks.
 * @param {*} callback callback(error)
 */
exports.releaseBookingsFileLock = function(lockName, callback) {
    try {
        // If a lock name is specified, try deleting it
        if (!utils.isNullOrWhitespace(lockName)) {
            console.debug('About to release given lock: ' + lockName);
            let lockPath = bookingsPath + lockName;
            if (fs.existsSync(lockPath)) {
                console.debug('Lock found. Releasing it...');
                fs.unlinkSync(lockPath);
                console.debug('Lock ' + lockName + ' released');
            }
            return callback();
        }

        // Else, force deleting all the locks
        console.debug('About to release existing locks');
        let bookingsDirCont = fs.readdirSync(bookingsPath);
        let files = bookingsDirCont.filter( function( elm ) {return elm.match(/.*\.(lock)/ig);});
        console.debug('Locks found: ' + (files.length > 0 ? files.length : ' none'));
        for (let i = files.length ; i > 0; i--) {
            console.debug('About to release given lock: ' + files[i-1]);
            let currentLock = bookingsPath + files[i-1];
            if (fs.existsSync(currentLock)) {
                console.debug('Lock found. Releasing it...');
                fs.unlinkSync(currentLock);
                console.debug('Lock released');
            }
        }
        console.debug('Done releasing locks!');
        callback();
    } catch (error) {
        console.debug('Error while releasing booking lock(s): ' + error);
        callback(error);
    }
}


/** Private functions */

function _hasActiveLocks(){
    let bookingsDirCont = fs.readdirSync(bookingsPath);
    let files = bookingsDirCont.filter( function( elm ) {return elm.match(/.*\.(lock)/ig);});
    console.debug('Found ' + files.length + ' locks');
    return files.length > 0;
}
