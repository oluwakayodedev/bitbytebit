const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // generate JWT
        const payload = { admin: { id: admin.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
        res.json({
            status: 'success',
            token,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const createAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // admin exist?
        let admin = await Admin.findOne({ username });
        if (admin) {
            return res.status(400).json({ msg: 'Admin already exists' });
        }

        // new admin
        admin = new Admin({ username, password });

        // store admin to db
        await admin.save();

        res.status(201).json({ 
            msg: 'Admin created successfully' 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { 
    adminLogin,
    createAdmin
};
