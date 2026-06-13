const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.cookies.token;

    // Fallback to Bearer token in Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Please login first' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.owner = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Please login first' });
    }
    next();
}