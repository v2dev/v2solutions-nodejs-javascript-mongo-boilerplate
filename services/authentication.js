require('dotenv').config();
const jwt = require('jsonwebtoken');
const statusCode = require('../utils/constant');

module.exports = authenticateToken = (req, res, next) => {

    const rawJwtToken = req.header('Authorization');

    if (!rawJwtToken || !rawJwtToken.startsWith('Bearer ')) {
        return res
            .status(statusCode.unauzorized)
            .json({ error: 'Unauthorized' });
    }

    const jwtToken = rawJwtToken.split(' ')[1];
    if (!jwtToken) {
        return res
            .status(statusCode.unauzorized)
            .json({ error: 'Unauthorized' });
    }

    jwt.verify(jwtToken, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res
                .status(statusCode.forbidden)
                .json({ error: 'Token expired' });
        }
        req.user = user;
        next();
    });
};
