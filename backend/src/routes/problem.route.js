const express = require('express');

const route = express.Router();
const {getProblemPage} = require('../controllers/problem.controller');

route.get('/problems', getProblemPage);

module.exports = route;