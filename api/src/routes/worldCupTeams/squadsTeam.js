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

const getSquadDataApi = async function (id) {

    
    let AllSquadDataApiAux2

    let AllSquadDataApiAux1 = await axios.get(`https://v3.football.api-sports.io/players/squads?team=${id}`, {
      headers: {          
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": `${API_KEY} `  
    }
    })

    AllSquadDataApiAux1 = AllSquadDataApiAux1.data.response

    /* console.log(AllTeamsDataApiAux1) */

    AllSquadDataApiAux2 = await AllSquadDataApiAux1.players.map(el => {
        
        return {
            id: el.id,
            name: el.name,
            age: el.age,
            /* number: el.number, */   // el campo suele estar en null por eso no lo envio
            position: el.position,
            photo: el.photo,
            // el campo estado no va en la base de datos, se va a sacar
            id_team: AllSquadDataApiAux1[0].teams.id
        };
    });

    /* for (let i = 0; i < AllTeamsDataApiAux2.length; i++) {
        AllTeamsDataApiAux2[i].coach = await getCoachDataApi(AllTeamsDataApiAux2[i].id)
    } */

    return AllSquadDataApiAux2
    }

    router.get('/:id', async (req, res, next) => {


        const id = req.params.id;
        //idGroup is missing, it must be created in data base. Later search for it in DB
        try {
          let A =  await getSquadDataApi(id);
          console.log(A)  
          
          res.status(200).send(A)
        }
         catch (error) {
          next(error)
        } 
      });