const express = require('express');

const {
    addAddressValidator,
} = require('../utilis/validator/addresevalidator.js');
const {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
} = require('../services/addreseServices');

const authService = require('../services/authServices');
const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/')
    .post(addAddressValidator, addAddress)
    .get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;
