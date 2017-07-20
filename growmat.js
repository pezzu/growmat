const express = require('express');
const app = express();


app.use(express.static('public'));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

require('./app/web/routes.js')(app);

const port = process.argv[2] || process.env.PORT || 8080;

app.listen(port);
console.log("Server running at port " + port);