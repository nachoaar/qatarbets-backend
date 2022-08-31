require('dotenv').config();
const { Router } = require('express');
const axios = require('axios');
// const { Match } = require('../../db.js');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    let fixture = ( await axios.get('https://v3.football.api-sports.io/fixtures?league=1&season=2022&timezone=America/Argentina/Buenos_Aires', {
      headers: {
        'x-rapidapi-key': `${process.env.API_KEY}`,
        "x-rapidapi-host": "v3.football.api-sports.io",
      }
    })).data.response
    
    let result = fixture.map(el => {
      return {
        id: el.fixture.id,
        date: new Date (el.fixture.date),
        status: el.fixture.status.long,
        home_team_id: el.teams.home.id,
        away_team_id: el.teams.away.id,
        stadium_name: el.fixture.venue.name,
        city: el.fixture.venue.city,
      }
    })
/* 
    result.forEach( async (el) => {
      await Match.create({
        id: el.id,
        date: el.date,
        status: el.status,
        home_team_id: el.home_team_id,
        away_team_id: el.away_team_id,
        stadium_name: el.stadium_name,
        city: el.city
      })
    });
 */
    res.send(result)
  } catch (error) {
    next(error);
  }
})

module.exports = router;