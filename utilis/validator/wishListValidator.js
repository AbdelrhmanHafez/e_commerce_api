const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valliditionMiddleware');

exports.getWishlistValidator = [
    check('id').isMongoId().withMessage('Invalid wishlist ID format'),
    validatorMiddleware,
];

exports.addToWishlistValidator = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format'),
    validatorMiddleware,
];

exports.deleteFromWishlistValidator = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format'),
    validatorMiddleware,
];
