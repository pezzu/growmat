const audit = require('./../commons/audit.js');
const express = require('express');
const app = express();

const http = require('http');
const https = require('https');
const WebSocket = require('ws');

const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const helmet = require('helmet');

// setup authentication
require('./app/passport.js')(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

const sessionStore = new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
});


const sessionParser = session({
    name:               'sessionId',
    store:              sessionStore,
    resave:             false,
    saveUninitialized:  false,
    secret:             'godsavethequeenplease'
});

app.use(sessionParser);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./app/routes.js')(app, passport);


const httpPort   = process.argv[2] || process.env.WEB_PORT    || 8443;
const streamPort = process.argv[3] || process.env.STREAM_PORT || 8081;

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../../cert/key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../../cert/cert.pem'))
};

// Web server
const webServer = https.createServer(options, app).listen(httpPort);

// Websocket Server
const wss = new WebSocket.Server({verifyClient: VerifyClient, server: webServer, perMessageDeflate: false});

function VerifyClient(info, done) {
    sessionParser(info.req, {}, () => {
        console.log(info.req.session);

        if(info.req.session && info.req.session.passport && info.req.session.passport.user) {
            done(true);
        }
        else {
            done(false, 401, 'Not authenticated!');
        }
    });
}

wss.broadcast = function(data) {
    wss.clients.forEach(function each(client) {
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
        wss.broadcast(data);
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
audit.log("Streaming server listens at port " + streamPort);