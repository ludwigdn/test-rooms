'use strict';
var express = require('express');
var router = express.Router();
var { celebrate, Joi, errors } = require('celebrate');
var roomsController = require('../controllers/rooms.controller');


/* GET rooms */
router.get('/', celebrate({
    query: {
        name: Joi.string().trim().optional(),
        minCapacity: Joi.number().integer().optional(),
        maxCapacity: Joi.number().integer().optional(),
        equipments: Joi.string().trim().optional()
    }
}), (req, res) => {
    console.debug('Redeeming rooms:');
    var name = decodeURIComponent(req.query.name);
    console.debug('name: ' + name);
    var minCapacity = req.query.minCapacity;
    console.debug('minCapacity: ' + minCapacity);
    var maxCapacity = req.query.maxCapacity;
    console.debug('minCapacity: ' + minCapacity);
    var equipments = decodeURIComponent(req.query.equipments);
    roomsController.GetRooms(name, minCapacity, maxCapacity, equipments, function(err, rooms){
        if (err) res.status(400).send();
        else res.send(rooms);
    });
});


/* GET a specific room */
router.get('/:id', celebrate({
    params: Joi.object().keys({
        id: Joi.string().trim().required()
    })
}), (req, res) => {
    console.debug('Redeeming a specific room');
    var roomName = decodeURIComponent(req.params.id);
    console.debug('roomName: ' + roomName);
    roomsController.GetRoom(roomName, function(err, room){
        if (err) res.status(400).send();
        else res.send(room);
    });
});

module.exports = router;
