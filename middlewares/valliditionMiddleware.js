const { validationResult } = require('express-validator');

// @desc  Finds the validation errors in this request and wraps them in an object with handy functions

const validatorMiddleware = (req, res, next) => { // catch error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // if not contain error => continue code
};

module.exports = validatorMiddleware;