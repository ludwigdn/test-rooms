var roomsList = require('../data/rooms/rooms');
var utils = require ('../utils/utils');


/**
 * 
 * @param {*} name 
 * @param {*} minCapacity 
 * @param {*} maxCapacity 
 * @param {*} equipments 
 * @param {*} callback callback(error, rooms)
 */
exports.GetRooms = function(name, minCapacity, maxCapacity, equipments, callback) {
    try {
        let listToReturn = roomsList;
        // Filter rooms on name
        if (!utils.isNullOrWhitespace(name)){
            listToReturn = listToReturn.filter(room => room.name.toLowerCase().includes(name.toLowerCase()));
        }
        // Filter rooms on minimum capacity
        if (utils.isValidNumber(minCapacity)){
            listToReturn = listToReturn.filter(room => room.capacity >= minCapacity);
        }
        // Filter rooms on maximum capacity
        if (utils.isValidNumber(maxCapacity)) {
            listToReturn = listToReturn.filter(room => room.capacity <= maxCapacity);
        }
        // Filter rooms on equipments
        if (!utils.isNullOrWhitespace(equipments)) {
            let splittedEquipments = equipments.split(',').map(o => o.toLowerCase());
            if (splittedEquipments.length > 0) {
                let validEquipments = splittedEquipments.filter(equipment => !utils.isNullOrWhitespace(equipment));            
                listToReturn = listToReturn.filter(room => room.equipements
                    && room.equipements.length > 0
                    && room.equipements.some(equipment => validEquipments.includes((equipment.name || "").toLowerCase())));
            }
        }
        // Returns rooms
        callback (undefined, listToReturn);
    } catch (error) {
        callback (error);
    }
}

/**
 * 
 * @param {*} roomName 
 * @param {*} callback callback(error, room)
 */
exports.GetRoom = function(roomName, callback) {
    try {
        let room = roomsList.filter(room => room.name === roomName);
        callback(undefined, room);
    } catch (error) {
        callback (error);
    }
}