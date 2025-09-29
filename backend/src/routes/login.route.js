const express = require('express');

const route = express.Router();
const {getLoginPage, postLoginPage, postLogout} = require('../controllers/login.controller');
route.get('/login', getLoginPage);
route.post('/login', postLoginPage);
route.get('/logout', postLogout);

module.exports = route;