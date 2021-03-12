
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const url = 'mongodb://localhost/AlienDBex';
const path = require('path');

const bcrypt = require('bcrypt');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const passportlocalmongoose = require ('passport-local-mongoose');


const LocalStrategy = require('passport-local').Strategy;

const doctorsRouter = require('./routes/doctors');
const specialitySchema = require('./routes/specialities');
const appointRouter = require('./routes/appoint');
const User = require('./models/user');
//const { Passport, session } = require('passport');

const app = express();

app.use(express.json());
app.use('/doctors',doctorsRouter);
app.use('/specialities',specialitySchema);
app.use('/appiont',appointRouter);


mongoose.set('useNewUrlParser',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex',true);
mongoose.set('useUnifiedTopology',true);
mongoose.connect(url, {useNewUrlParser:true});
const con = mongoose.connection;
con.on('open', () => {
    console.log('connected... to mongoDB');
});


//login routes
app.set('views', path.join(__dirname, '/views'));
app.set('view-engine','ejs');
app.use(express.static('./public'));
app.use(express.json());

app.use(express.urlencoded({ extended: false}));
//app.use(express.urlencoded({ extended: true}));
app.use(flash());
app.use(require("express-session")({
    secret: "Jyothsna",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



   

app.get('/dashboard', checkAuthenticated,(req,res) => {
    res.render('dashboard.ejs', {name: req.user.username});
});

app.get('/login', (req,res) => {
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
    successRedirect:'/dashboard',
    failureRedirect:'/login',
    failureFlash: true
}));

app.get('/register',(req,res) => {
    res.render('register.ejs');
});

app.post('/register',  (req,res) => {
    var username = req.body.username
    var password = req.body.password
    User.register(new User({username: username}),
        password,function(err,user){
            if(err){
                console.log(err);
                res.render('register.ejs');
            }

            passport.authenticate('local')(
                req,res, function(){
                    return res.render('login.ejs');
                });
        });
});

app.get('/home', (req,res) => {
    res.render('home.ejs');
});

app.post('/home', (req,res) => {
    
});

app.get('/logout',(req,res) => {
    req.logout();
    res.redirect('/');
});

function checkAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}





app.listen(4000, () =>{
    console.log('server started');
});