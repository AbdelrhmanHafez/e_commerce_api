const express = require('express');
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require('../utils/validator/brandValidator');

const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
} = require('../services/brandServices');

const router = express.Router();
const authService = require('../services/authServices');

router.route('/').get(getBrands).post(createBrandValidator, createBrand);
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        updateBrandValidator,
        updateBrand)
    .delete(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        deleteBrandValidator,
        deleteBrand);

module.exports = router;