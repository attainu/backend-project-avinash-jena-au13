const mongoose = require('mongoose');
const express = require('express');

const appointSchema = new mongoose.Schema({

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
    }
});

module.exports = mongoose.model('Appont',appointSchema);