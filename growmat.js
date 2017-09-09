const audit = require('./app/audit.js');
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'));

require('./app/routes.js')(app);

const port = process.argv[2] || process.env.PORT || 8080;

const server = https.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
}, app).listen(port);

const wss = new WebSocket.Server({'server': server, perMessageDeflate: false});
require('./video/socket.js')(wss);

// server.listen(port);
audit.log("Server running at port " + port);
