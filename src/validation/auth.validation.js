const Joi = require("joi");

const registerValidation = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

const loginValidation = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})


module.exports = {
    registerValidation,
    loginValidation
}