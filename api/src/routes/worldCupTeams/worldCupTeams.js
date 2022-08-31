require('dotenv').config();

const { Router } = require('express');

const axios = require('axios');
const { Team, Player } = require('../../db.js');
const {
  API_KEY
} = process.env;

const router = Router();

const getCoachDataApi = async function (teamId) {

  let coachDataApiAux2

  let coachDataApiAux1 = await axios.get(`https://v3.football.api-sports.io/coachs?team=${teamId}`, {
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": `${API_KEY} `
    }
  })

  if (!coachDataApiAux1.data.response[0].name) {
    coachDataApiAux2 = 'There is no coach'
  } else {
    coachDataApiAux2 = await coachDataApiAux1.data.response[0].name // the endpoint gets many coachs, so the main coach is the one into the array in position 0

  }

  return coachDataApiAux2
}

const getTeamsDataApi = async function () {

  let AllTeamsDataApiAux1
  let AllTeamsDataApiAux2

  let AllTeamsDataApi = await axios.get('https://v3.football.api-sports.io/teams?league=1&season=2022', {
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": `${API_KEY} `
    }
  })

  AllTeamsDataApiAux1 = AllTeamsDataApi.data.response

  let auxArray = [];

  AllTeamsDataApiAux2 = await AllTeamsDataApiAux1.map(el => {
    /*  let auxcoach = await getCoachDataApi(el.team.id) */  //falta agregar coach por que son muchas llamadas para hacer (32 por solicitud)
    auxArray.push(el.team.id)
    return {
      id: el.team.id,
      name: el.team.name,
      logo: el.team.logo,
      /* coach: auxcoach, */
      code: el.team.code,
      founded: el.team.founded
    };
  });

  AllTeamsDataApiAux2.forEach(async (el) => {
    await Team.findOrCreate({
      id: el.team.id,
      name: el.team.name,
      logo: el.team.logo,
      /* coach: auxcoach, */
      code: el.team.code,
      founded: el.team.founded
    })
  });

  return AllTeamsDataApiAux2
}

router.get('/allTeams', async (req, res, next) => {

  //idGroup is missing, it must be created in data base. Later search for it in DB

  try {
    let A = await getTeamsDataApi();
    /* console.log(A)   */

    res.status(200).send(A)
  }
  catch (error) {
    next(error)
  }
});


const getSquadDataApi = async function (id) {

  let AllSquadDataApiAux2
  let AllSquadDataApiAux3

  let AllSquadDataApiAux1 = await axios.get(`https://v3.football.api-sports.io/players/squads?team=${id}`, {
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": `${API_KEY} `
    }
  })

  AllSquadDataApiAux1 = AllSquadDataApiAux1.data.response[0]
  AllSquadDataApiAux3 = AllSquadDataApiAux1.team.id

  AllSquadDataApiAux2 = await AllSquadDataApiAux1.players.map(el => {

    return {
      id: el.id,
      name: el.name,
      age: el.age,
      /* number: el.number, */   // el campo suele estar en null por eso no lo envio
      position: el.position,
      photo: el.photo,
      // el campo estado no va en la base de datos, se va a sacar
      id_team: AllSquadDataApiAux3
    };
  });

  AllSquadDataApiAux2.forEach(async (el) => {
    await Player.findOrCreate({
      id: el.id,
      name: el.name,
      age: el.age,
      /* number: el.number, */   // el campo suele estar en null por eso no lo envio
      position: el.position,
      photo: el.photo,
      // el campo estado no va en la base de datos, se va a sacar
      id_team: AllSquadDataApiAux3
    })

  });

  return AllSquadDataApiAux2
}

router.get('/squad/:id', async (req, res, next) => {

  /* console.log('hola') */

  const id = req.params.id;

  /* console.log(id) */
  //idGroup is missing, it must be created in data base. Later search for it in DB
  try {
    let A = await getSquadDataApi(id);
    console.log(A)

    res.status(200).send(A)
  }
  catch (error) {
    next(error)
  }
});






module.exports = router;