'use strict';
var express = require('express');
var router = express.Router();
var { celebrate, Joi, errors } = require('celebrate');
var bookingsController = require ('../controllers/bookings.controller');


/* GET bookings */
router.get('/', celebrate({
    query: Joi.object().keys({
        beginsBefore: Joi.date().iso().optional(),
        endsAfter: Joi.date().iso().optional(),
        roomName: Joi.string().trim().optional()
    })
}), (req, res) => {
    console.debug('Redeeming bookings');
    let beginsBefore = req.query.beginsBefore;
    console.debug('beginsBefore: ' + beginsBefore);
    let endsAfter = req.query.endsAfter;;
    console.debug('endsAfter: ' + endsAfter);
    let roomName =  decodeURIComponent(req.query.roomName);
    bookingsController.GetBookings(beginsBefore, endsAfter, roomName, function(err, bookings) {
        if (err) res.status(err.status || 400).send();
        else res.send(bookings);
    });
});


/* POST a new booking */
router.post('/', celebrate({
    body: Joi.object().keys({
        roomName: Joi.string().trim().required(),
        booker: Joi.string().trim().required(),
        bookedFrom: Joi.date().iso().required(),
        bookedTo: Joi.date().iso().required()
    })
}), (req, res) => {
    console.debug('Redeem adding new booking:');
    let roomName = req.body.roomName;
    console.debug('roomName: ' + roomName);
    let booker = req.body.booker;
    console.debug('booker: ' + booker);
    let bookedFrom = req.body.bookedFrom;
    console.debug('bookedFrom: ' + bookedFrom);
    let bookedTo = req.body.bookedTo;
    console.debug('bookedTo: ' + bookedTo);
    bookingsController.AddBooking(roomName, booker, bookedFrom, bookedTo, function(err, booking){
        if (err) res.status(err.status || 400).send();
        else res.status(201).send(booking);
    })
});


/* DELETE a booking */
router.delete('/:id', celebrate({
    params: Joi.object().keys({
        id: Joi.string().trim().required()
    })
}), (req, res) => {
    console.debug('Redeem deleting a specific booking');
    let bookingId = req.params.id;
    console.debug('Id: ' + bookingId);
    bookingsController.DeleteBooking(bookingId, function(err){
        if (err) res.status(err.status || 400).send(err.message);
        else res.status(200).send();
    })
});

module.exports = router;
