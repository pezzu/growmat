var express = require('express');
var app = express();

var box = require('./box/control.js');

var port = 8080;

app.use(express.static('public'));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/api/box_params.json', function(req, res) {

    data = box.getParams();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));

});

app.post('/api/set_params', function(req, res) {

});

app.listen(port);
console.log("Server running at port " + port);