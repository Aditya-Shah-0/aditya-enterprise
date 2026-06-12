const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({ message: 'Please login first' });
    }
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.owner = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Please login first' });
    }
    next();
}