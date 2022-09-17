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



const allCoachs= [
  {
      "coach": "Roberto Martínez",
      "teamId": 1
  },
  {
      "coach": "D. Deschamps",
      "teamId": 2
  },
  {
      "coach": "Z. Dalić",
      "teamId": 3
  },
  {
      "coach": "Tite",
      "teamId": 6
  },
  {
      "coach": "Luis Enrique",
      "teamId": 9
  },
  {
      "coach": "G. Southgate",
      "teamId": 10
  },
  {
      "coach": "H. Moriyasu",
      "teamId": 12
  },
  {
      "coach": "A. Cissé",
      "teamId": 13
  },
  {
      "coach": "D. Stojković",
      "teamId": 14
  },
  {
      "coach": "M. Yakin",
      "teamId": 15
  },
  {
      "coach": "G. Martino",
      "teamId": 16
  },
  {
      "coach": "Paulo Bento",
      "teamId": 17
  },
  {
      "coach": "G. Arnold",
      "teamId": 20
  },
  {
      "coach": "K. Hjulmand",
      "teamId": 21
  },
  {
      "coach": "Carlos Queiroz",
      "teamId": 22
  },
  {
      "coach": "H. Renard",
      "teamId": 23
  },
  {
      "coach": "C. Michniewicz",
      "teamId": 24
  },
  {
      "coach": "J. Löw",
      "teamId": 25
  },
  {
      "coach": "Fernando Santos",
      "teamId": 27
  },
  {
      "coach": "M. Kbaïer",
      "teamId": 28
  },
  {
      "coach": "G. Matosas",
      "teamId": 29
  },
  {
      "coach": "V. Halilhodžić",
      "teamId": 31
  },
  {
      "coach": "R. Giggs",
      "teamId": 767
  },
  {
      "coach": "D. Lodeweges",
      "teamId": 1118
  },
  {
      "coach": "K. Appiah",
      "teamId": 1504
  },
  {
      "coach": "C. Seedorf",
      "teamId": 1530
  },
  {
      "coach": "Felix Sanchez",
      "teamId": 1569
  },
  {
      "coach": "G. Alfaro",
      "teamId": 2382
  },
  {
      "coach": "G. Berhalter",
      "teamId": 2384
  },
  {
      "coach": "J. Herdman",
      "teamId": 5529
  },
  {
      "coach": "L. Scaloni",
      "teamId": 26
  },
  {
      "coach": "Ó. Tabárez",
      "teamId": 7
  }
]

router.get('/coachDB', async (req, res, next) => {

  console.log(coachArray)

  try {

    allCoachs.map(async (el) => {

      let teamDB = await Team.findByPk(el.teamId)

      if (el.teamId === teamDB.id) {

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
      number: el.number,    // el campo suele estar en null por eso no lo envio
      position: el.position,
      photo: el.photo,
      teamId: AllSquadDataApiAux3
    };
   });

  AllSquadDataApiAux2.map(async (el) => {
    await Player.findOrCreate({
      where: {
       id: el.id,
       name: el.name,
       age: el.age,
       number: 0,   // el campo suele estar en null por eso no lo envio
       position: el.position,
       photo: el.photo,
       teamId: AllSquadDataApiAux3
      }
     })
   });
   return AllSquadDataApiAux2
 }

 router.get('/playersSquadApi/:id', async (req, res, next) => {

  const idApi = req.params.id;
  
   try {
    let V = await getSquadDataApi(idApi) 
    res.status(200).send(V) 
   }
  catch (error) {
    next(error)
  } 
});

router.get('/playersSquadDb/:id', async (req, res, next) => {

  const idDbS = req.params.id;

  try {
    let S = await Player.findAll({
      where: {
        teamId: idDbS
      }
    })
    res.status(200).send(S)
  }
  catch (error) {
    next(error)
  }
});


router.get('/playersSquadDb11/:id', async (req, res, next) => {

  const idDbS11 = req.params.id;

  try {
    let S11 = await Player.findAll({
      where: {
        teamId: idDbS11
      }
    })

    var lineupObject={
      goalkeeper:[],
      defenders:[],
      midfielder:[],
      attackers:[]
    }

    var goalkeeperCount=0;
    var defendersCount=0;
    var midfielderCount=0;
    var attackersCount=0;

    S11.map( async (el)=>{

      if(el.position === "Goalkeeper" && goalkeeperCount < 1){
        goalkeeperCount++;
        lineupObject.goalkeeper.push(el)
      }

      if(el.position === "Defender" && defendersCount < 4){
        defendersCount++;
        lineupObject.defenders.push(el)
      }

      if(el.position === "Midfielder" && midfielderCount < 4){
        midfielderCount++;
        lineupObject.midfielder.push(el)
      }

      if(el.position === "Attacker" && attackersCount < 2){
        attackersCount++;
        lineupObject.attackers.push(el)
      }

    })

    res.status(200).send(lineupObject)
  }
  catch (error) {
    next(error)
  }
});

router.get('/allPlayersSquadDb', async (req, res, next) => {

  try {

    var squadArray=[];
    let allTeams = await Team.findAll()

    for (let i = 0; i < allTeams.length ; i++){
       var currentSquad = await Player.findAll({
        where:{
          teamId: allTeams[i].id
        }
      }) 
      var currentCoach = [{teamId: allTeams[i].id, coach : allTeams[i].coach}]

      squadArray.push(currentCoach.concat(currentSquad))
      
    }
    res.status(200).send(auxArray)
  }
  catch (error) {
    next(error)
  }
});







module.exports = router;