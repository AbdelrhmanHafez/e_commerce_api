const mongoose = require("mongoose");

const dbconnect = () => {

    mongoose.connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database Connected: ${conn.connection.host}`);
        })
}

module.exports = dbconnect 