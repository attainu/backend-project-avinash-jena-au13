const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Appiont = require('../models/appointment');

router.get('/appoint',(req,res) =>{
    res.send('Sample text');
});

module.exports = router;