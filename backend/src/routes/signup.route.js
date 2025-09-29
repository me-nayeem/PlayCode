const express = require('express');

const route = express.Router();
const {getSignUpPage,PostSignUpPage} = require('../controllers/signup.controller');

route.get('/signup', getSignUpPage);
route.post('/signup', PostSignUpPage);

module.exports = route;