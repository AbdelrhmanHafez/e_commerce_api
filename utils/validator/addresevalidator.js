const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valliditionMiddleware');

exports.addAddressValidator = [
    check('alias')
        .notEmpty()
        .withMessage('Address alias is required'),

    check('details')
        .notEmpty()
        .withMessage('Address details are required'),

    check('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('ar-EG')
        .withMessage('Invalid Egyptian phone number'),

    check('city')
        .notEmpty()
        .withMessage('City is required'),

    check('postalCode')
        .optional()
        .isPostalCode('any')
        .withMessage('Invalid postal code'),

    validatorMiddleware,
];
