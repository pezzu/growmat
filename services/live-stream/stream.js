const audit = require('./../commons/audit.js');
const express = require('express');
const app = express();

const http = require('http');
const https = require('https');
const WebSocket = require('ws');

const fs = require('fs');
const path = require('path');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

// setup authentication
require('./app/passport.js')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// required for passport
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'godsavethequeenplease'
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./app/routes.js')(app, passport);


const httpPort   = process.argv[2] || process.env.WEB_PORT    || 8443;
const wsPort     = process.argv[3] || process.env.SOCKET_PORT || parseInt(httpPort) + 1;
const streamPort = process.argv[4] || process.env.STREAM_PORT || parseInt(httpPort) + 2;

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../../cert/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../../cert/cert.pem'))
};

// Web server
const webServer = https.createServer(options, app).listen(httpPort);

// Websocket Server
const https4ws = https.createServer(options, app).listen(wsPort);
const socketServer = new WebSocket.Server({server: https4ws, perMessageDeflate: false});

socketServer.broadcast = function(data) {
    socketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

// HTTP Server to accept incomming MPEG-TS Stream from ffmpeg
const streamServer = http.createServer( function(request, response) {
    // var params = request.url.substr(1).split('/');
    //
    // if (params[0] !== STREAM_SECRET) {
    //     console.log(
    //         'Failed Stream Connection: '+ request.socket.remoteAddress + ':' +
    //         request.socket.remotePort + ' - wrong secret.'
    //     );
    //     response.end();
    // }

    response.connection.setTimeout(0);
    audit.log(
        'Stream connected: ' +
        request.socket.remoteAddress + ':' +
        request.socket.remotePort
    );
    request.on('data', function(data){
        socketServer.broadcast(data);
        if (request.socket.recording) {
            request.socket.recording.write(data);
        }
    });
    request.on('end',function(){
        audit.log('Screen closed');
        if (request.socket.recording) {
            request.socket.recording.close();
        }
    });
}).listen(streamPort);

audit.log("Web server running at port " + httpPort);
audit.log("Socket server running at port " + wsPort);
audit.log("Streaming server listens at port " + streamPort);