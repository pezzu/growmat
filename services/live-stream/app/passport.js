const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, id);
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy(
        function(username, password, done) {
            if (!validPassword(username, password)) {
                console.log('Invalid user or password: ' + username + '/' + password);
                return done(null, false, { message: 'Invalid user or password' });
            }
            console.log('Login OK');
            return done(null, username);
        })
    );
};

function validPassword(username, password) {
    return password === 'morisorangeponynow';
}