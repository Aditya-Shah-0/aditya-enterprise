const Owner = require('../models/owners');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    registerOwner: async (req, res) => {
        try {
            const { name, email, phone, password, panNumber } = req.body;

            const existingOwner = await Owner.findOne({ email });
            if (existingOwner) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(password, salt);

            const owner = await Owner.create({
                name,
                email,
                phone,
                password: hash,
                panNumber
            })

            const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.status(200).json({ message: 'Owner registered successfully. Redirecting to home page', token });

            //redirect to home page 

        } catch (error) {
            console.error('Error registering owner:', error);
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ message: messages.join(', '), error: error });
            }
            res.status(500).json({ message: 'Failed to register owner', error: error });
        }
    },

    loginOwner: async (req, res) => {
        try {
            const { email, password } = req.body;

            const owner = await Owner.findOne({ email });
            if (!owner) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const match = await bcrypt.compare(password, owner.password);
            if (!match) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            res.status(200).json({ message: 'Owner logged in successfully. Redirecting to home page', token });
            //redirect to home page 
        } catch (error) {
            console.error('Error logging in owner:', error);
            res.status(500).json({ message: 'Failed to log in owner' });
        }
    },

    checkUser: async (req, res) => {
        try {
            const owner = await Owner.findById(req.owner.ownerId);
            if (!owner) {
                return res.status(404).json({ message: 'Owner not found', owner: null });
            }
            const businessSettings = await owner.populate('businessSettings');
            const invoicePreference = await owner.populate('invoicePreference');
            let transactions = [];
            if (owner.transactions) {
                transactions = await owner.populate('transactions');
            }
            res.status(200).json({ owner: owner.toObject(), businessSettings, invoicePreference, transactions, message: 'Owner found' });
        } catch (error) {
            console.error('Error checking owner:', error);
            res.status(500).json({ message: 'Failed to check owner', owner: null });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Owner logged out successfully' });
        } catch (error) {
            console.error('Error logging out owner:', error);
            res.status(500).json({ message: 'Failed to log out owner' });
        }
    }
};