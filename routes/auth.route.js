const express = require('express');
const { adminLogin, createAdmin } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/admin', adminLogin);
router.post('/admin/register', createAdmin);

module.exports = router;
