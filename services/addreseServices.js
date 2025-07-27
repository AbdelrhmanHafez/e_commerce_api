const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Add address to logged-in user
// @route   POST /api/v1/addresses
// @access  Private/User
exports.addAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {
                addresses: req.body,
            },
        },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Address added successfully',
        data: user.addresses,
    });
});

// @desc    Remove address from logged-in user
// @route   DELETE /api/v1/addresses/:addressId
// @access  Private/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                addresses: { _id: req.params.addressId },
            },
        },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Address removed successfully',
        data: user.addresses,
    });
});

// @desc    Get all addresses of logged-in user
// @route   GET /api/v1/addresses
// @access  Private/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('addresses');

    res.status(200).json({
        status: 'success',
        results: user.addresses.length,
        data: user.addresses,
    });
});
