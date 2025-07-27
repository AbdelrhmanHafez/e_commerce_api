// كلاس ApiFeatures بيستخدم لتطبيق الفلاتر والبحث والفرز وتحديد الحقول والصفحات على استعلامات Mongoose
class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery; // استعلام Mongoose الأساسي (مثلاً: Product.find())
        this.queryString = queryString;     // الكويري الجاي من URL (req.query)
    }
    // فلترة البيانات بناءً على كويري مثل price[gte]=100
    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword']; // بنستبعد دول من الفلترة
        excludesFields.forEach((field) => delete queryStringObj[field]);

        // بنحوّل gte/lt وغيره لـ $gte/$lt عشان Mongoose يفهمهم
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

        return this;
    }

    // فرز البيانات حسب حقل معين (مثلاً ?sort=price,-name)
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt'); // الترتيب الافتراضي حسب تاريخ الإنشاء تنازلي
        }
        return this;
    }

    // تحديد الحقول اللي هترجع في النتيجة (مثلاً ?fields=name,price)
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v'); // بشكل افتراضي بنخفي __v
        }
        return this;
    }

    // البحث بكلمة مفتاحية (keyword) في بعض الحقول
    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === 'Products') {
                // بحث في عنوان المنتج أو الوصف
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                // بحث في الاسم لأي موديل تاني
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    // تقسيم النتائج لصفحات بناءً على page و limit من الكويري
    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;   // رقم الصفحة الحالية
        const limit = this.queryString.limit * 1 || 50; // عدد العناصر في كل صفحة
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit); // عدد الصفحات الكلي

        if (endIndex < countDocuments) {
            pagination.next = page + 1; // في صفحة بعد الحالية
        }
        if (skip > 0) {
            pagination.prev = page - 1; // في صفحة قبل الحالية
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination; // بنحفظ نتيجة الباجينج علشان نستخدمها في الريسبونس
        return this;
    }
}

module.exports = ApiFeatures;
