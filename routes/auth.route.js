const express = require('express');
const { adminLogin, createAdmin, verifyToken } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/admin', adminLogin);
router.post('/admin/register', createAdmin);
router.post('/verifyToken', verifyToken);

module.exports = router;
