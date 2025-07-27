const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const Product = require('../../models/productModel');
const dbConnection = require('../../config/dbconnect');

// Load env variables
dotenv.config({ path: '../../config.env' });

// Connect to DB
dbConnection();

// Read data from JSON file
const products = JSON.parse(fs.readFileSync('./product.json'));

// Insert data into DB
const insertData = async () => {
    try {
        await Product.create(products);
        console.log('Data Inserted Successfully!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`Insert Error: ${error}`.red.inverse);
        process.exit(1);
    }
};

// Delete all data from DB
const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log(' All Data Deleted Successfully!'.yellow.inverse);
        process.exit();
    } catch (error) {
        console.error(`Delete Error: ${error}`.red.inverse);
        process.exit(1);
    }
};

// Run with flags
if (process.argv[2] === '-i') {
    insertData();
} else if (process.argv[2] === '-d') {
    destroyData();
}
