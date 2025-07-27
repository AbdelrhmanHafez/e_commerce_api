const express = require('express');

// const authService = require('../services/authServices');

const {
    getWishlistValidator,
    addToWishlistValidator,
    deleteFromWishlistValidator
} = require('../utilis/validator/wishListValidator')

const {
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWishlist,
} = require('../services/wishListServices');

const router = express.Router();

// router.use(authService.protect, authService.allowedTo('user')); // لكل ال route

router.route('/').post(addToWishlistValidator, addProductToWishlist).get(getWishlistValidator, getLoggedUserWishlist);

router.delete('/:productId', deleteFromWishlistValidator, removeProductFromWishlist);

module.exports = router; 