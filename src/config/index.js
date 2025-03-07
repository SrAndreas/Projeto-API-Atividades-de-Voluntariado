require('dotenv').config();

const config = {
    secretKey: process.env.JWT_SECRET,
    port: process.env.PORT
};

module.exports = config;