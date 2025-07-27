const { body, check } = require('express-validator');
const mongoose = require('mongoose');
const Category = require('../../models/categoryModel');
const SubCategory = require('../../models/subCategoryModel');
const validatorMiddleware = require('../../middlewares/valliditionMiddleware');

exports.createProductValidator = [
    body('title')
        .notEmpty().withMessage('Product title is required')
        .isLength({ max: 100 }).withMessage('Too long product title'),

    body('description')
        .notEmpty().withMessage('Product description is required')
        .isLength({ max: 2000 }).withMessage('Too long product description'),

    body('price')
        .notEmpty().withMessage('Product price is required')
        .isNumeric().withMessage('Price must be a number'),

    body('priceAfterDiscount')
        .optional()
        .isNumeric().withMessage('Price after discount must be a number')
        .custom((value, { req }) => {
            if (value >= req.body.price) {
                throw new Error('Price after discount must be lower than original price');
            }
            return true;
        }),

    body('quantity')
        .notEmpty().withMessage('Product quantity is required')
        .isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),

    body('colors')
        .optional()
        .isArray().withMessage('Colors must be an array of strings'),

    body('sizes')
        .optional()
        .isArray().withMessage('Sizes must be an array of strings'),

    body('imageCover')
        .notEmpty().withMessage('Product image cover is required'),

    body('images')
        .optional()
        .isArray().withMessage('Images must be an array'),

    body('category')
        .notEmpty().withMessage('Product must belong to a category')
        .isMongoId().withMessage('Invalid category ID')
        .custom(async (value) => {
            const category = await Category.findById(value);
            if (!category) {
                throw new Error('Category not found');
            }
            return true;
        }),

    body('subcategory')
        .optional()
        .custom(async (subCats, { req }) => {
            if (!Array.isArray(subCats)) {
                throw new Error('Subcategory must be an array');
            }

            if (!req.body.category) {
                throw new Error('Category is required when sending subcategories');
            }

            for (let id of subCats) {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error('One or more subcategory IDs are invalid');
                }
            }

            const subCategoriesInDB = await SubCategory.find({ category: req.body.category });
            const validSubCatIds = subCategoriesInDB.map(sub => sub._id.toString());

            const allBelong = subCats.every(id => validSubCatIds.includes(id));
            if (!allBelong) {
                throw new Error('One or more subcategories do not belong to the specified category');
            }

            return true;
        }),

    body('brand')
        .optional()
        .isMongoId().withMessage('Invalid brand ID'),

    body('ratingsAverage')
        .optional()
        .isFloat({ min: 1, max: 5 }).withMessage('Ratings average must be between 1 and 5'),

    body('ratingsQuantity')
        .optional()
        .isInt({ min: 0 }).withMessage('Ratings quantity must be a non-negative integer'),

    validatorMiddleware,
];


exports.createSubCategoryValidator = [
    body('name')
        .notEmpty().withMessage('Subcategory name is required')
        .isLength({ min: 2 }).withMessage('Too short subcategory name')
        .isLength({ max: 32 }).withMessage('Too long subcategory name'),

    body('category')
        .notEmpty().withMessage('Subcategory must belong to a category')
        .isMongoId().withMessage('Invalid category ID format')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error('Category not found');
            }
            return true;
        }),

    validatorMiddleware
];

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subcategory ID'),
    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subcategory ID'),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid subcategory ID'),
    validatorMiddleware,
];