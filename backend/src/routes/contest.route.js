const express = require('express');

const route = express.Router();
const {getContestPage} = require('../controllers/contest.controller');

route.get('/contest', getContestPage);

module.exports = route;