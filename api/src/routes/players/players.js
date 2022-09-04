require('dotenv').config();
const { Router } = require('express');
const axios = require('axios');
const { API_KEY } = require('../../DB_variables.js');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    let players = ( await axios.get('https://v3.football.api-sports.io/players/squads?team=26', {
      headers: {
        'x-rapidapi-key': `${process.env.API_KEY || API_KEY}`,
        "x-rapidapi-host": "v3.football.api-sports.io",
      }
    })).data

    res.send(players);
  } catch (error) {
    next(error)
  }
})

module.exports = router;