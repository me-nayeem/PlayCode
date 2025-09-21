const express = require('express');

const route = express.Router();
const {getLoginPage} = require('../controllers/login.controller');

route.get('/login', getLoginPage);

module.exports = route;