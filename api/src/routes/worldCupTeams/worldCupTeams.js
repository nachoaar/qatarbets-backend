 require('dotenv').config(); 
/* require('dotenv').config(); */
const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios');
/* const { Recipe, Diet } = require('../db');
const { Op, addDiet } = require('sequelize');
const { getKey } = require('../keys'); */
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

    coachDataApiAux2 = await coachDataApiAux1.data.response[0].name // the endpoint gets many coachs, so the main coach is the one into the array in position 0

    if (coachDataApiAux2 === undefined) return 'There is no coach'
   
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

    /* console.log(AllTeamsDataApiAux1) */

    AllTeamsDataApiAux2 = await AllTeamsDataApiAux1.map(el => {
        let auxcoach = getCoachDataApi(el.team.id)

        return {
            id: el.team.id,
            name: el.team.name,
            logo: el.team.logo,
            coach: auxcoach,
            code: el.team.code,
            founded: el.team.founded
        };
    });

    /* for (let i = 0; i < AllTeamsDataApiAux2.length; i++) {
        AllTeamsDataApiAux2[i].coach = await getCoachDataApi(AllTeamsDataApiAux2[i].id)
    } */

    return AllTeamsDataApiAux2
    }

    router.get('/', async (req, res, next) => {

        //idGroup is missing, it must be created in data base. Later search for it in DB

        try {
          let A =  await getTeamsDataApi();
          console.log(A)  
          
          res.status(200).send(A)
        }
         catch (error) {
          next(error)
        } 
      });






   /* router.get('/', async (req, res, next) => { */

    /* console.log('hola') */
     /* var API_KEYB = "993943c6a7d4a29527f6e9c92b7d0541"; */
    /* try {
      let A
      A = await axios.get('https://v3.football.api-sports.io/teams?league=1&season=2022', {
        headers: {          
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": `${API_KEY} `  
        }
      })
      res.status(200).send(A.data)
    } catch (error) {
      next(error)
    }  */
/*   }); */

module.exports = router;