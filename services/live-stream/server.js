// const audit = require('./app/audit.js');
const express = require('express');
const app = express();

const http = require('http');
const https = require('https');
const WebSocket = require('ws');

const fs = require('fs');

app.use(express.static('public'));

const httpPort = process.argv[2] || 8080;
const wsPort = process.argv[3] || httpPort + 1;
const streamPort = process.argv[4] || httpPort + 2;

const options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
};

// Web server
const httpServer = https.createServer(options, app).listen(httpPort);

// Websocket Server
const socketServer = new WebSocket.Server({port: wsPort, perMessageDeflate: false});

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
    console.log(
        'Stream Connected: ' +
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
        console.log('close');
        if (request.socket.recording) {
            request.socket.recording.close();
        }
    });
}).listen(streamPort);

console.log("Web server running at port " + httpPort);
console.log("Socket server running at port " + wsPort);
console.log("Streaming server listens at port " + streamPort);