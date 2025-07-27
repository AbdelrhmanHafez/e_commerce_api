const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        maxlength: [30, 'Too long category name'],
        minlength: [3, 'Too short category name'],
        unique: [true, 'Category must be unique'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
}, { timestamps: true });

CategorySchema.pre('save', function (next) {
    if (this.name) {
        this.slug = slugify(this.name);
    }
    next();
});

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
