const ctrl = require('./controller.js');

module.exports = function(app) {

    app.get('/api/params.json', function(req, res) {
        const data = ctrl.getParams();
        res.json(data);
    });

    // app.post('/api/params.json', function(req, res) {

    // });

}