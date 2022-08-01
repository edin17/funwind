const Joi = require("joi")

const registerSchema = Joi.object({
    username:Joi.string().required().max(50),
    email:Joi.string().email().required().max(60),
    age:Joi.number().required(),
    password:Joi.string().min(8).max(255).required(),
    repeated_password:Joi.any().valid(Joi.ref("password"))
})


function validateRegister(user){
    return registerSchema.validate(user)
}

module.exports = {
    validateRegister:validateRegister
}