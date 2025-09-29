const express = require('express');

const route = express.Router();
const {getHomePage, getDashBoardPage} = require('../controllers/home.controller');

route.get("/", getHomePage);
route.get("/dashboard", getDashBoardPage);

module.exports = route;