const express = require('express');

const route = express.Router();
const {getleaderboardPage} = require('../controllers/leaderboard.controller');

route.get('/leaderboard', getleaderboardPage);

module.exports = route;