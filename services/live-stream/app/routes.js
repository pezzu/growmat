const path = require('path');

module.exports = function (app, passport) {

    const sendOptions = {
        root: path.resolve(__dirname, '../public/')
    };

    app.get('/', function(req, res) {
        res.sendFile('login.html', sendOptions);
    });

    app.get('/lib/:name', function(req, res) {
        res.sendFile('lib/' + req.params.name, sendOptions);
    });

    app.get('/live', isLoggedIn, function (req, res) {
        res.sendFile('live.html', sendOptions);
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {


        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();
        else
        // if they aren't redirect to login page
            res.redirect('/');
    }

    // process the signup form
    app.post('/', passport.authenticate('local-signup', {
        successRedirect : '/live', // redirect to the secure profile section
        failureRedirect : '/' // redirect back to the signup page if there is an error
        // failureFlash : true // allow flash messages
    }));
};