const Joi = require('joi');
const mongoose = require('mongoose');



const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 220
    },
    
    experience: Number
    
});

function validateDoctor(doctor){
    const schema = {
        title:Joi.String().min(5).max(50).required(),
        specialityId: Joi.String().required(),
        specialityName: Joi.String().required()
    };
    return Joi.validate(doctor,schema);
}



module.exports = mongoose.model('Doctor',doctorSchema);