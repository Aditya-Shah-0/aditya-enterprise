const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const connectDB = require('./config/db');
connectDB();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'https://aditya-enterprise-theta.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isVercel = origin.endsWith('.vercel.app');
        const isAllowed = allowedOrigins.includes(origin) || isVercel || origin.startsWith('http://localhost');
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const itemRoutes = require('./routes/itemRoutes');
const todoRoutes = require('./routes/todoRoutes');
const quotationRoutes = require('./routes/quotationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/todo', todoRoutes);
app.use('/api/quotation', quotationRoutes);

// Centralized Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error Caught:", err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || "Internal Server Error",
    });
});

app.get('/', (req, res) => {
    res.send({ message: 'backend is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
