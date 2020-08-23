'use strict';
var express = require('express');
var helmet = require('helmet');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var { errors } = require('celebrate');
var fs = require('fs');
var util = require('util');
var dateFormat = require('dateformat');
var mkdirp = require('mkdirp');
var uuiv4 = require('uuid/v4');
var uniqueTag = uuiv4();



// -----------------
// APPLICATION SETUP
// -----------------

var app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errors());



// ---------------------
// LOGGING PROCESS SETUP
// ---------------------

var isDevelopment = app.get('env') === 'development';
console.log(app.get('env'));

if (isDevelopment) app.use(logger('dev'));

app.use(function (req, res, next) {
    uniqueTag = uuiv4().split('-')[0];

    if (isDevelopment) {
        // Redirect console.debug to console.log
        console.debug = function(message) { console.log('DEBUG | ' + new Date().toISOString() + ' | ' + uniqueTag + ' | ' + message)};   
    } else {
        // Redirect console.debug to a file
        console.debug = function (message) {
            let now = new Date();
            let year = now.getUTCFullYear();
            let month = now.getUTCMonth() + 1;
            let path = './data/logs/' + year + '/' + month + '/';
            mkdirp.sync(path);
            let fileName = dateFormat(now, "yyyy-mm-dd", true) + '.log'
            let log = dateFormat(new Date(), "yyyymmdd_HHMMss", true) + ' | ' + uniqueTag + ' | ' + util.format(message) + '\n';
            let options = { flags: 'w' };
            fs.appendFile(path + fileName, log, options, (error) => { if (error) console.error("Error while writing to file:" + error); });
        };
    }    

    // First log message printed for each new request
    console.debug('A user tried to access: ' + req.method + ' ' + req.path);
    next();
});



// -------------
// ROUTING SETUP
// -------------

app.use('/rooms', require('./routes/rooms.routes'));
app.use('/bookings', require('./routes/bookings.routes'));



// --------------
// ERROR HANDLERS
// --------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (isDevelopment) {
    // development error handler - will print stacktrace
    app.use(function (err, req, res, next) {     
        // defines error status. It it comes from Joi (security middleware) then it's a 401
        let status = err.isJoi === true ? 400 : (err.status || 500);
        let toSend = { message: err.message, error: err };
        res.status(status).send(toSend);
    });
} else {
    // production error handler - no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        // defines error status. It it comes from Joi (security middleware) then it's a 401
        let status = err.isJoi === true ? 400 : (err.status || 500);
        let toSend = { message: err.message, error: {} };
        res.status(status).send(toSend);
    });
}



// ------------
// SERVER SETUP
// ------------

_setupDataDir();

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    console.debug('Express server listening on port ' + server.address().port);
});



// -----------------
// PRIVATE FUNCTIONS
// -----------------

function _setupDataDir() {
    let path = './data/';
    if (!fs.existsSync(path)) {
        mkdirp.sync(path);
        // Creates bookings data file
        let bookingsPath = path + 'bookings/';
        if (!fs.existsSync(bookingsPath)) {
            mkdirp.sync(bookingsPath);
            fs.appendFileSync(bookingsPath + 'bookings.json','[]');
        }
        // Creates rooms data file
        let roomsPath = path + 'rooms/';
        if (!fs.existsSync(roomsPath)) {
            mkdirp.sync(roomsPath);
            fs.appendFileSync(roomsPath + 'rooms.json','[]');
        }
    }
}