const { compareSync } = require('bcrypt');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./database')

passport.use(new LocalStrategy(
    function (username, password, done) {
        // console.log(username,password);
        UserModel.findOne({ username: username }).then((user) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });

            }

            if (!compareSync(password, user.password)) {
                //When password is invalid 
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
            //When user is valid
        }).catch((err) => {
            console.log('aman')
            return done(err);
        })
    }
));

//Persists user data inside session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(function (id, done) {
    UserModel.findById(id).then((user) => {
        done(null, user);
    }).catch((err) => {
        done(err)
    });
});