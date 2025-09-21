const express = require('express');

const route = express.Router();
const {getSignUpPage} = require('../controllers/signup.controller');

route.get('/signup', getSignUpPage);

module.exports = route;