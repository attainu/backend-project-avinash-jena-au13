const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();
//const Speciality = require('../models/speciality');
 

const Speciality = mongoose.model('Speciality', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    speciality:{
        type:String
    }
}));

router.get('/', async(req,res) =>{
    const specialities = await Speciality.find().sort('name');
    res.send(specialities);
});

router.post('/', async(req,res) => {
    const { error } = function validateSpeciality(speciality)  {
        const schema = Joi.object({
            name: Joi.string().min(5).required()
        });
        const validation = schema.validate(req.body);
        res.send(validation);
    }

    
    if (error) return res.status(400).send(error.details[0].message);

    let speciality = new Speciality({ name: req.body.name});
    speciality = await speciality.save();
    res.send(speciality);
});

router.put('/:id', async(req,res) => {
    const { error } = validateSpeciality(req.body);
    function validateSpeciality(speciality)  {
        const schema = Joi.object({
            name: Joi.string().min(5).required()
        });
        const validation = schema.validate(req.body);
        res.send(validation);
    }
    if (error) return res.status(400).send(error.details[0].message);

    const speciality = await Speciality.findByIdAndUpdate(req.params.id, {name: req.body.name},{
        new:true
    });

    if(!speciality) return res.status(404).send('The speciality with the given ID  is not correct');

    res.send(speciality);
});

router.delete('/:id', async(req,res) => {
    const speciality = await Speciality.findByIdAndRemove(req.params.id);
    if(!speciality) return res.status(404).send('The speciality with the given ID is not correct');
    res.send(speciality);
});

router.get('/:id',async (req,res) => {
    const speciality = await Speciality.findById(req.params.id);
    if(!speciality) return res.status(404).send('The speciality given by Id is not correct');
    res.send(speciality);
});



module.exports = router;
