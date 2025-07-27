const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

// Delete any document by ID
exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndDelete(id);

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }

        // No need to call document.remove(), it's already deleted
        res.status(204).json({ status: 'success', data: null });
    });

// Update any document by ID
exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Ensure validation runs during update
        });

        if (!document) {
            return next(new ApiError(`No document for this id ${req.params.id}`, 404));
        }

        // No need to call document.save() after findByIdAndUpdate
        res.status(200).json({ status: 'success', data: document });
    });

// Create a new document
exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const newDoc = await Model.create(req.body);
        res.status(201).json({ status: 'success', data: newDoc });
    });

// Get one document by ID (optionally populate related data)
exports.getOne = (Model, populationOpt) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        // Build query
        let query = Model.findById(id);
        if (populationOpt) {
            query = query.populate(populationOpt); // Optional populate
        }

        const document = await query;

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }

        res.status(200).json({ status: 'success', data: document });
    });

// Get all documents with filtering, pagination, search, etc.
exports.getAll = (Model, modelName = '') =>
    asyncHandler(async (req, res) => {
        let filter = req.filterObj || {};

        // Count total documents after applying filter
        const documentsCounts = await Model.countDocuments(filter);

        // Build advanced query with features
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .paginate(documentsCounts)
            .filter()
            .search(modelName)
            .limitFields()
            .sort();

        const { mongooseQuery, paginationResult } = apiFeatures;
        const documents = await mongooseQuery;

        res.status(200).json({
            status: 'success',
            results: documents.length,
            paginationResult,
            data: documents,
        });
    });
