require("dotenv").config();
const { Router } = require("express");
const { Bet, Match, User } = require("../../db.js");
const { validateToken } = require('../tokenController.js');

const router = Router();

router.post("/newBet", async (req, res, next) => {
  // el next esta para que luego se vaya al siguiente middleware, que es el control de errores que esta en app
  const token = validateToken(req.cookies.acces_token || '');
  if (token === '') {
    res.json('Usuario invalido');
  }
  try {
    var {
      fecha_hora,
      money_bet,
      result,
      condition,
      expected_profit,
      final_profit,
      matchId
    } = req.body;

    let newBet = await Bet.findOrCreate({
      where: {
        fecha_hora, // ver validacion del date en el front (evaluar usar new Date en el handleSubmit)
        money_bet,
        result,
        condition,
        expected_profit,
        final_profit,
        matchId,
        userId: token.id
      },
    });

    res.status(201).send('La apuesta se creo correctamente');
  } catch (error) {
    next(error);
  }
});

router.get('/userBets/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    let bets = await Bet.findAll({
      where: {
        userId: id
      }
    })

    res.send(bets)
  } catch (error) {
    next(error)
  }
})

router.get('/allBets', async (req, res, next) => {
  
  try {
    let allbets = await Bet.findAll()
    res.send(allbets)
  } catch (error) {
    next(error)
  }
})

router.get("/betId/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    let A = await Bet.findAll({
      where: {
        id: id,
      },
    });

    res.status(200).send(A);
  } catch (error) {
    next(error);
  }
});


// in these arrays there are the id of the teams in order to identify which are que best ones, regular and worst ones

var bestTeams = [1,2,6,9,10,25,1118,26];
var regularTeams=[14,15,16,3,21,24,27,2382,2384,7];
var worstTeams=[12,13,17,20,23,22,28,29,31,767,1504,1530,1569,5529];

 var identifyBet = function(id1,id2){

 var profitCoefHome 
 var profitCoefTie 
 var profitCoefAway

 id1 = Number(id1)
 id2 = Number(id2)

 //home bestTeams

 if (bestTeams.includes(id1)) console.log("si")

if ( bestTeams.includes(id1) && bestTeams.includes(id2)){
  profitCoefHome = 1.4
  profitCoefTie = 1.2
  profitCoefAway = 1.4
}
if (bestTeams.includes(id1) && regularTeams.includes(id2)){
  profitCoefHome = 1.2
  profitCoefTie = 1.3
  profitCoefAway = 1.5
} 
if (bestTeams.includes(id1) && worstTeams.includes(id2)){
  profitCoefHome = 1.15
  profitCoefTie = 1.35
  profitCoefAway = 1.6
}

//home RegularTeams 

if (regularTeams.includes(id1) && bestTeams.includes(id2)){
  profitCoefHome = 1.5
  profitCoefTie = 1.3
  profitCoefAway = 1.2
}
if (regularTeams.includes(id1) && regularTeams.includes(id2)){
  profitCoefHome = 1.4
  profitCoefTie = 1.2
  profitCoefAway = 1.4
}
if (regularTeams.includes(id1) && worstTeams.includes(id2)){
  profitCoefHome = 1.2
  profitCoefTie = 1.3
  profitCoefAway = 1.5
}

//home worstTeams 

if (worstTeams.includes(id1) && bestTeams.includes(id2)){
  profitCoefHome = 1.6
  profitCoefTie = 1.35
  profitCoefAway = 1.15
}
if (worstTeams.includes(id1) && regularTeams.includes(id2)){
  profitCoefHome = 1.5
  profitCoefTie = 1.3
  profitCoefAway = 1.2
}
if (worstTeams.includes(id1) && worstTeams.includes(id2)){
  profitCoefHome = 1.4
  profitCoefTie = 1.2
  profitCoefAway = 1.4
} 

 let betCoefobj={
  profitCoefHome : profitCoefHome,
  profitCoefTie : profitCoefTie,
  profitCoefAway : profitCoefAway
}

return betCoefobj
} 

router.get('/betProfit/:id_home/:id_away', async (req, res, next) => {

  let idHome = req.params.id_home;
  let idAway = req.params.id_away;

  try {
    let Bp = identifyBet(idHome,idAway)
    res.status(200).send(Bp)
  }
  catch (error) {
    next(error)
  }
});

module.exports = router;
