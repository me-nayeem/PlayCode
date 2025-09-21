const express = require('express');

const route = express.Router();
const {getStorePage} = require('../controllers/store.controller');

route.get('/store', getStorePage);

module.exports = route;