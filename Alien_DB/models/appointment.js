const express = require('express');
const mongoose = require('mongoose');


const appointmentSchema =  new mongoose.Schema({
    Name:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    city: {
        type: String
    },
    doctor:{
        type:String
    },
    date:{
        type: String
    }
});

appointmentSchema.path('email').validate((val) => {
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

module.exports = mongoose.model('Appointment',appointmentSchema);

//var appoint =mongoose.model('appoint',appointmentSchema);
//exports.appointmentSchema = appointmentSchema;
//module.exports = appoint;
//module.exports = mongoose.model('Appointment',appointmentSchema);
//module.exports = router;