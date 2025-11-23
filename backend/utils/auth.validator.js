const { body } = require('express-validator');

const authValidator = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid Email'),
    body('password').isLength({min: 8}).withMessage('Password should be atleast 8 characters'),
]

module.exports = authValidator;