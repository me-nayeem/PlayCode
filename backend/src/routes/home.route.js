const express = require('express');

const route = express.Router();
const {getHomePage} = require('../controllers/home.controller');

route.get("/", getHomePage);

module.exports = route;