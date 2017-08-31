const audit = require('./app/audit.js');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'));


require('./app/routes.js')(app);

const port = process.argv[2] || process.env.PORT || 8080;

app.listen(port);
audit.log("Server running at port " + port);