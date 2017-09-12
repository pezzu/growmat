const ctrl = require('./controller.js');

module.exports = function(app) {

    app.get('/api/params.json', function(req, res) {
        ctrl.getParams().then(data => res.json(data));
    });

    app.post('/api/params.json', function(req, res) {
        ctrl.setParams(req.body.params).then(data => res.json(data));
    });

}