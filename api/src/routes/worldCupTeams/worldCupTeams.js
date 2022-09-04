require('dotenv').config();

const { Router } = require('express');

const axios = require('axios');
const { Team, Player } = require('../../db.js');
/* const {
  API_KEY
} = process.env; */
const { API_KEY } = require('../../DB_variables.js');

const router = Router();



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

  AllTeamsDataApiAux2 = AllTeamsDataApiAux1.map(el => {
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
      where: {
        id: el.id,
        name: el.name,
        logo: el.logo,
        /* coach: auxcoach, */
        code: el.code,
        founded: el.founded
      }
    })
  });
}

router.get('/allTeams', async (req, res, next) => {

  //idGroup is missing, it must be created in data base. Later search for it in DB

  try {
    await getTeamsDataApi();
    /* console.log(A)   */
    res.status(200).send("Datos subidos a la base de datos con exito!!")
  }
  catch (error) {
    next(error)
  }
});

router.get('/get', async (req, res, next) => {
  try {
    let teams = await Team.findAll();
    res.status(200).send(teams);
  } catch (error) {
    next(error)
  }
});

// const getSquadDataApi = async function (id) {

//   let AllSquadDataApiAux2
//   let AllSquadDataApiAux3

//   let AllSquadDataApiAux1 = await axios.get(`https://v3.football.api-sports.io/players/squads?team=${id}`, {
//     headers: {
//       "x-rapidapi-host": "v3.football.api-sports.io",
//       "x-rapidapi-key": `${API_KEY} `
//     }
//   })

//   AllSquadDataApiAux1 = AllSquadDataApiAux1.data.response[0]
//   AllSquadDataApiAux3 = AllSquadDataApiAux1.team.id

//   AllSquadDataApiAux2 = await AllSquadDataApiAux1.players.map(el => {

//     return {
//       id: el.id,
//       name: el.name,
//       age: el.age,
//       /* number: el.number, */   // el campo suele estar en null por eso no lo envio
//       position: el.position,
//       photo: el.photo,
//       // el campo estado no va en la base de datos, se va a sacar
//       id_team: AllSquadDataApiAux3
//     };
//   });

//   AllSquadDataApiAux2.forEach(async (el) => {
//     await Player.findOrCreate({
//       id: el.id,
//       name: el.name,
//       age: el.age,
//       /* number: el.number, */   // el campo suele estar en null por eso no lo envio
//       position: el.position,
//       photo: el.photo,
//       // el campo estado no va en la base de datos, se va a sacar
//       id_team: AllSquadDataApiAux3
//     })

//   });

//   return AllSquadDataApiAux2
// }

router.get('/squad/:id', async (req, res, next) => {

  const id = req.params.id;

  try {
    let A = await Team.findAll({
      where: {
        id: id
      }
    });

    res.status(200).send(A)
  }
  catch (error) {
    next(error)
  }
});

const coachArray = []

const getCoachDataApi = async function (teamId) {

  let coachDataApiAux2

  let coachDataApiAux1 = await axios.get(`https://v3.football.api-sports.io/coachs?team=${teamId}`, {
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": `${API_KEY} `
    }
  })

  coachDataApiAux2 = await coachDataApiAux1.data.response[0].name // the endpoint gets many coachs, so the main coach is the one into the array in position 0

  let coachObject = {
    coach: coachDataApiAux2,
    teamId: teamId
  }

  return coachObject
}

/* router.get('/coachApi/:id', async (req, res, next) => {

  const idCoach = req.params.id;

  try {
    let coachFound = await getCoachDataApi(idCoach);
    coachArray.push(coachFound)

    let teamDB = await Team.findByPk(idCoach)

    if (Number(coachFound.teamId) === teamDB.id) {

      await Team.update({
        coach: coachFound.coach,
      }, {
        where: {
          id: coachFound.teamId,
        }
      });
      res.status(200).send(coachFound)

    } else {
      res.status(200).send('coach not founded in DB')
    }
  }
  catch (error) {
    next(error)
  }
}); */

router.get('/coachApi/:id', async (req, res, next) => {

  const idCoach = req.params.id;

  try {
    let coachFound = await getCoachDataApi(idCoach);
    coachArray.push(coachFound)
    res.status(200).send(coachArray)
  }
  catch (error) {
    next(error)
  }
});

router.get('/coachDB', async (req, res, next) => {

  console.log(coachArray)

  try {

     coachArray.map(async (el) => {

      let teamDB = await Team.findByPk(el.teamId)

      /* console.log('dbId')
      console.log(dbId)
      console.log(dbId.team.dataValues.id) */

      if ((Number(el.teamId)) === teamDB.id) {

        await Team.update({
          coach: el.coach,
        }, {
          where: {
            id: el.teamId,
          }
        });
      }
    })
    res.status(200).send('all coachs added')
    }
  
  catch (error) {
    next(error)
  }
});





module.exports = router;