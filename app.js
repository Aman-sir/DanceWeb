
const { hashSync } = require('bcrypt')
const express = require('express')
const UserModel = require('./config/database')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const path = require('path')
const bodyparser = require('body-parser')
let contact = require('./config/contact')
let { body, validationResult } = require('express-validator')

const app = express()
const port = 500

const dotenv = require('dotenv')

dotenv.config()


app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }))
app.set("views", path.join(__dirname + "/views"))

app.use(session({
    secret: process.env.RANDOM,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.PASS, collectionName: "Sessions" }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

require('./config/passport');


app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).render('home');
    } else {
        res.status(401).render('login')
    };
})


app.get('/contact', (req, res) => {

    if (req.isAuthenticated()) {
        res.status(200).render('contact');
    } else {
        res.status(401).render('login')
    };
})

app.post('/contact', [
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('number').notEmpty()
], (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    let contacts = new contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.number,
        address: req.body.address,
        goal: req.body.goal

    })
    contacts.save()
    res.redirect("/contact")

})



app.get('/faculty', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).render('faculty')
    } else {
        res.status(401).render('login')
    }

})



app.get('/gallary', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).render('gallary')
    } else {
        res.status(401).render('login')
    }

})

app.get('/class-info', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).render('class')
    } else {
        res.status(401).render('login')
    }

})


app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/unauthorized' }))

app.post('/signup', [
    body('username', 'Enter a valid username').notEmpty(),
    body('password', 'Enter a valid Password').isLength({ min: 8 })
], (req, res) => {
    let { username, password } = req.body
    let error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }

    UserModel.findOne({ username }).then((data) => {
        if (data) {
            return res.status(400).json({ error: 'User with this User name is already exists' });

        }
        let user = new UserModel({
            username: req.body.username,
            password: hashSync(req.body.password, 10)
        })

        user.save()

        res.render("login  ")

    }).catch((err) => {
        console.log(err)
    })

})

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

app.get("/unauthorized", (req, res) => {
    res.status(404).json({ error: "Unathorized Access" })
})




// start the server

app.listen(port, () => {
    console.log(`server is listening at http://127.0.0.1:${port}`)
})