const { body } = require('express-validator');

const updateProductValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a number'),
];

module.exports = updateProductValidator;