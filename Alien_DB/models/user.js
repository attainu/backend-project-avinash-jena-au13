const express = require('express');
const mongoose  = require('mongoose');
const passportlocalmongoose = require ('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User",userSchema);