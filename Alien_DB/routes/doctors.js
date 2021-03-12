const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');

router.get('/', async(req,res) => {
    try{
        const doctors = await Doctor.find().sort('name');
        res.json(doctors);
    }catch(err){
        res.send('Error' +err);
    }
    
});
router.post('/', async(req,res) => {
    let doctor = new Doctor({
        name: req.body.name,
        speciality: {
            _id: speciality._id,
            name:speciality.name
        },
        experience: req.body.experience
    });
    try{
        const d1 = await doctor.save();
        res.json(d1);
    }catch(err){
        res.send('Error');
    }
});

router.patch('/:id', async(req,res) => {
    try{
        const doctor = await Doctor.findById(req.params.id);
        doctor.experience = req.body.experience;
        const d1 = await doctor.save();
        res.json(d1);
    }catch(err){
        res.send('Error');
    }
});

router.patch('/:id', async(req,res) => {
    try{
        const doctor = await Doctor.findById(req.params.id);
        doctor.experience = req.body.experience;
        const d1 = await doctor.remove();
        res.json(d1);
    }catch(err){
        res.send('Error');
    }
});

module.exports = router;