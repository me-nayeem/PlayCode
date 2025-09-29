const express = require('express');
const { getForgotPasswordPage, postForgotPasswordPage, getResetPasswordPage, postResetPasswordPage } = require('../controllers/forgotpassword.controller');

const router = express.Router();


router.get('/forgot-password', getForgotPasswordPage);
router.post('/forgot-password', postForgotPasswordPage);
router.get('/reset-password/:token', getResetPasswordPage);
router.post('/reset-password/:token', postResetPasswordPage);

module.exports = router;