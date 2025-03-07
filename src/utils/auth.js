const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (payload) => {
    return jwt.sign(payload, config.secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, config.secretKey);
};

module.exports = { generateToken, verifyToken };