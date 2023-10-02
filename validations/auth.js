const { body } = require('express-validator');

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('firstName').isLength({ min: 3 }),
    body('lastName').isLength({ min: 3 }),
]