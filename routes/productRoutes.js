const express = require('express');
const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utilis/validator/productValidator');

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImages,
} = require('../services/productServices');
const authService = require('../services/authServices');
const reviewsRoute = require('./reviewRoutes');

const router = express.Router();

// POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use('/:productId/reviews', reviewsRoute);

router
    .route('/')
    .get(getProducts)
    .post(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct
    );
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadProductImages,
        resizeProductImages,
        updateProductValidator,
        updateProduct
    )
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteProductValidator,
        deleteProduct
    );

module.exports = router;