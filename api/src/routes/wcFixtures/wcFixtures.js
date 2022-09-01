require('dotenv').config();
const { Router } = require('express');
const { Op } = require('sequelize');
const axios = require('axios');
const { Match, Team } = require('../../db.js');
const sequelize = require('sequelize');

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

    result.forEach( async (el) => {
      await Match.findOrCreate({
        where: {
          id: el.id,
          date: el.date,
          status: el.status,
          home_team_id: el.home_team_id,
          away_team_id: el.away_team_id,
          stadium_name: el.stadium_name,
          city: el.city
        }
      })
    });

    res.status(200).send("Datos subidos a la base de datos con exito!!")
  } catch (error) {
    next(error);
  }
});

router.get('/get', async (req, res, next) => {
  try {
    let matches = await Match.findAll({
      /* include: {
        model: Team,
        on: {
          'id': { [Op.eq]: { [Op.col]: 'matches.home_team_id' } }
        },
        
      }, */
      raw: true,
    });
    
    let mapped =  matches.map( async (el) => {
      let home = await Team.findByPk(el.home_team_id, { raw: true });
      let away = await Team.findByPk(el.away_team_id, { raw: true });
      let obj = {
        id: el.id,
        date: el.date,
        status: el.status,
        home_team_id: el.home_team_id,
        home_team: home,
        away_team_id: el.away_team_id,
        away_team: away,
        result_match: el.result_match,
        stadium_name: el.stadium_name,
        city: el.city,
        groupId: el.groupId
      }
      return obj;
    });
    let result = await Promise.all(mapped).then((response) => {
      return response
    });
    res.status(200).send(result);
  } catch (error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    let match = await Match.findAll({
      where: {
        id: id,
      }
    })
    res.status(200).send(match)
  } catch (error) {
    next(error);
  }
});


module.exports = router;