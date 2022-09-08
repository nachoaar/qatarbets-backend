require('dotenv').config();
const { Router } = require('express');
const axios = require('axios');
const { Match, Team, Headtohead } = require('../../db.js');
const { API_KEY } = require('../../DB_variables.js');


const router = Router();

router.get('/', async (req, res, next) => {
  try {
    let fixture = (await axios.get('https://v3.football.api-sports.io/fixtures?league=1&season=2022&timezone=America/Argentina/Buenos_Aires', {
      headers: {
        'x-rapidapi-key': `${process.env.API_KEY || API_KEY}`,
        "x-rapidapi-host": "v3.football.api-sports.io",
      }
    })).data.response

    let result = fixture.map(el => {
      return {
        id: el.fixture.id,
        date: new Date(el.fixture.date),
        status: el.fixture.status.long,
        home_team_id: el.teams.home.id,
        away_team_id: el.teams.away.id,
        stadium_name: el.fixture.venue.name,
        city: el.fixture.venue.city,
      }
    })

    result.forEach(async (el) => {
      await Match.findOrCreate({
        where: {
          id: el.id,
          date: el.date,
          status: el.status,
          home_team_id: el.home_team_id,
          away_team_id: el.away_team_id,
          stadium_name: el.stadium_name,
          city: el.city,
          profit_coef_home: 0,
          profit_coef_draw: 0,
          profit_coef_away: 0,
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

    let mapped = matches.map(async (el) => {
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
        profit_coef_home: el.profit_coef_home,
        profit_coef_draw: el.profit_coef_draw,
        profit_coef_away: el.profit_coef_away,
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
    let mapped = match.map(async (el) => {
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
        profit_coef_home: el.profit_coef_home,
        profit_coef_draw: el.profit_coef_draw,
        profit_coef_away: el.profit_coef_away,
        city: el.city,
        groupId: el.groupId
      }
      return obj;
    });
    let result = await Promise.all(mapped).then((response) => {
      return response
    });
    res.status(200).send(result)
  } catch (error) {
    next(error);
  }
});


const headtoheadDataApi = async function (id1, id2) {

  let headtoheadDataApiAux2
  let headtoheadDataApiAux3

  let headtoheadDataApiAux1 = await axios.get(`https://v3.football.api-sports.io/fixtures/headtohead?h2h=${id1}-${id2}`, {
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": `${API_KEY} `
    }
  })

  headtoheadDataApiAux1 = headtoheadDataApiAux1.data.response

  let draw = function (goals1, goals2) {
    if (goals1 === goals2) {
      return true
    } else { return false }
  }

  headtoheadDataApiAux2 = headtoheadDataApiAux1.map((el) => {

    return {
      id_home: el.teams.home.id,
      id_away: el.teams.away.id,
      id: el.fixture.id,
      goalsHome: el.goals.home,
      goalsAway: el.goals.away,
      winnerHome: el.teams.home.winner,
      winnerAway: el.teams.away.winner,
      draw: draw(el.goals.home, el.goals.away),
    };
  });

  headtoheadDataApiAux3 = headtoheadDataApiAux2.map((el) => {
     
    let actualResult="";
    if (el.draw === true){
      actualResult="tie";
    } else if (el.draw === false && el.winnerHome === true){
      actualResult="winner_home";
    } else {actualResult="winner_away"}

    let actualScore = `${el.goalsHome} - ${el.goalsAway}`

    return {
      id: el.id,
      id_home: el.id_home,
      id_away: el.id_away,
      result: actualResult,
      score: actualScore
    };
  });

    headtoheadDataApiAux3.map(async (el) => {
   await Headtohead.findOrCreate({
     where: {
      id: el.id,
      id_home: el.id_home,
      id_away: el.id_away,
      result: el.result,
      score: el.score
     }
    })
  });  

  return headtoheadDataApiAux3
}

router.get('/headToHeadApi/:id_home/:id_away', async (req, res, next) => {

  let idApi1 = req.params.id_home;
  let idApi2 = req.params.id_away;

  console.log('hola')
  
  try {
    let x = await headtoheadDataApi(idApi1, idApi2)
    res.status(200).send(x)
  }
  catch (error) {
    next(error)
  }
});

router.get('/headToHeadDb/:id_home/:id_away', async (req, res, next) => {

  let idDb1 = req.params.id_home;
  let idDb2 = req.params.id_away;

  try {
    let J = await Headtohead.findAll({   
      where: {
        id_home: idDb1,
        id_away: idDb2
      }
    })
    res.status(200).send(J)
  }
  catch (error) {
    next(error)
  }
});


module.exports = router;