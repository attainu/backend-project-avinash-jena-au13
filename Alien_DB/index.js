
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const url = 'mongodb://localhost/AlienDBex';
const path = require('path');

const bcrypt = require('bcrypt');
const passport = require('passport');
const bodyparser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const passportlocalmongoose = require ('passport-local-mongoose');

const exphbs = require('express-handlebars');
const LocalStrategy = require('passport-local').Strategy;

const doctorsRouter = require('./routes/doctors');

const specialitySchema = require('./routes/specialities');

const appointmentSchema = require('./models/appointment');
const User = require('./models/user');
//const { Passport, session } = require('passport');
const Appointment = require('./models/appointment');
const app = express();

app.use(express.json());
app.use('/doctors',doctorsRouter);
app.use('/specialities',specialitySchema);
app.use('/appointment',appointmentSchema);


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
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
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


//appointment routes

app.get('/appointments', (req,res) =>{
    //const appointments = await Appointment.find().sort('name');
   // res.send(specialities);
    res.render('addOrEdit.ejs',{
        viewTitle: "Book Appointment",
       // appointment: req.body
    });
});

app.post('/appointments', (req,res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req,res) {
    var appointment = new Appointment();
    appointment.fullName = req.body.fullName;
    appointment.email = req.body.email;
    appointment.mobile = req.body.mobile;
    appointment.city = req.body.city;
    appointment.doctorname = req.body.doctorname;
    appointment.date = req.body.date;
    appointment.save((err,doc) => {
        if(!err){
            res.redirect('/list');
        }
        else{
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("/addOrEdit", {
                    viewTitle: "Insert Appointment",
                    appointment: req.body
                });
            }
            else
                console.log('Error during record insertion:', +err);
        }
    });
}

function updateRecord(req, res) {
    Appointment.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("/addOrEdit", {
                    viewTitle: 'Update Appointment',
                    appointment: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}



app.get('/list', (req,res) =>{
    Appointment.find((err, docs) => {
        if (!err) {
            res.render("/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving module list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

app.get('/:id', (req, res) => {
    Appointment.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("/addOrEdit", {
                viewTitle: "Update Appointment",
                appointment: doc
            });
        }
    });
});

app.get('/delete/:id', (req, res) => {
    Appointment.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/list');
        }
        else { console.log('Error in module delete :' + err); }
    });
});




app.listen(4000, () =>{
    console.log('server started');
});