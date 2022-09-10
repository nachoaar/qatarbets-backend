require("dotenv").config();
const { Router } = require("express");
const { Bet, Match, User } = require("../../db.js");

const router = Router();

router.post("/newBet", async (req, res, next) => {
  // el next esta para que luego se vaya al siguiente middleware, que es el control de errores que esta en app
  try {
    var {
      fecha_hora,
      money_bet,
      result,
      condition,
      expected_profit,
      final_profit,
      matchId,
      userId
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
        userId
      },
    });


    res.status(201).send(newBet);
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

var bestTeams = [1, 2, 6, 9, 10, 25, 1118, 26];
var regularTeams = [14, 15, 16, 3, 21, 24, 27, 2382, 2384, 7];
var worstTeams = [12, 13, 17, 20, 23, 22, 28, 29, 31, 767, 1504, 1530, 1569, 5529];

var identifyBet = function (id1, id2) {

  var profitCoefHome
  var profitCoefDraw
  var profitCoefAway

  id1 = Number(id1)
  id2 = Number(id2)

  //home bestTeams

  /* if (bestTeams.includes(id1)) console.log("si") */

  if (bestTeams.includes(id1) && bestTeams.includes(id2)) {
    profitCoefHome = 1.4
    profitCoefDraw = 1.2
    profitCoefAway = 1.4
  }
  if (bestTeams.includes(id1) && regularTeams.includes(id2)) {
    profitCoefHome = 1.2
    profitCoefDraw = 1.3
    profitCoefAway = 1.5
  }
  if (bestTeams.includes(id1) && worstTeams.includes(id2)) {
    profitCoefHome = 1.15
    profitCoefDraw = 1.35
    profitCoefAway = 1.6
  }

  //home RegularTeams 

  if (regularTeams.includes(id1) && bestTeams.includes(id2)) {
    profitCoefHome = 1.5
    profitCoefDraw = 1.3
    profitCoefAway = 1.2
  }
  if (regularTeams.includes(id1) && regularTeams.includes(id2)) {
    profitCoefHome = 1.4
    profitCoefDraw = 1.2
    profitCoefAway = 1.4
  }
  if (regularTeams.includes(id1) && worstTeams.includes(id2)) {
    profitCoefHome = 1.2
    profitCoefDraw = 1.3
    profitCoefAway = 1.5
  }

  //home worstTeams 

  if (worstTeams.includes(id1) && bestTeams.includes(id2)) {
    profitCoefHome = 1.6
    profitCoefDraw = 1.35
    profitCoefAway = 1.15
  }
  if (worstTeams.includes(id1) && regularTeams.includes(id2)) {
    profitCoefHome = 1.5
    profitCoefDraw = 1.3
    profitCoefAway = 1.2
  }
  if (worstTeams.includes(id1) && worstTeams.includes(id2)) {
    profitCoefHome = 1.4
    profitCoefDraw = 1.2
    profitCoefAway = 1.4
  }

  let betCoefobj = {
    profitCoefHome: profitCoefHome,
    profitCoefDraw: profitCoefDraw,
    profitCoefAway: profitCoefAway
  }

  return betCoefobj
}

router.get('/betProfit/:id_home/:id_away', async (req, res, next) => {

  let idHome = req.params.id_home;
  let idAway = req.params.id_away;

  try {
    let Bp = identifyBet(idHome, idAway)
    res.status(200).send(Bp)
  }
  catch (error) {
    next(error)
  }
});

router.get('/pushProfitsDb', async (req, res, next) => {

  try {

    let allMatches = await Match.findAll()

    allMatches.map(async (el) => {

      let matchDB = await Match.findByPk(el.id)

      let currentProfit = identifyBet(el.home_team_id, el.away_team_id)

      if (el.id === matchDB.id) {

        await Match.update({
          profit_coef_home: currentProfit.profitCoefHome,
          profit_coef_draw: currentProfit.profitCoefDraw,
          profit_coef_away: currentProfit.profitCoefAway,
        },
          {
            where: {
              id: el.id,
            }
          });
      }
    })
    res.status(200).send('all profits added')
  }

  catch (error) {
    next(error)
  }
});

router.get('/calculateProfits', async (req, res, next) => {

  try {

    /* setTimeout(function(){
      console.log("Hola Mundo");
   },30000); */

    let matchId = Number (req.query.matchId)
    let matchWinner = req.query.matchWinner

    if(matchWinner === "draw"){

    await Match.update({
      result_match: "tie"
    },
      {
        where: {
          id: matchId,
        }
      });

    }

    if(matchWinner !== "draw"){

    await Match.update({
      result_match: matchWinner
    },
      {
        where: {
          id: matchId,
        }
      });

    }  

    let allBets = await Bet.findAll({
      where: {
        matchId: matchId,
      },
    });

    allBets.map(async (el) => {

      let matchDB = await Match.findByPk(matchId)

      let currentProfit = identifyBet(matchDB.home_team_id, matchDB.away_team_id)

      let actualCoef=-1

      if(matchWinner==="home") actualCoef = currentProfit.profitCoefHome
      if(matchWinner==="draw") actualCoef = currentProfit.profitCoefDraw
      if(matchWinner==="away") actualCoef = currentProfit.profitCoefAway

       if (el.result === matchDB.result_match) { 

        await Bet.update({
          expected_profit: el.money_bet*actualCoef,
          final_profit: el.money_bet*actualCoef,
        },
           {
            where: {
              id: el.id,
            }
          });
       }
       else if (el.result === "draw" && matchDB.result_match === "tie") { 

        await Bet.update({
          expected_profit: el.money_bet*actualCoef,
          final_profit: el.money_bet*actualCoef,
        },
           {
            where: {
              id: el.id,
            }
          });
       }
       else /* (el.result !== matchDB.result_match) */ { 

        await Bet.update({
          expected_profit: el.money_bet*actualCoef,
          final_profit: 0,
        },
           {
            where: {
              id: el.id,
            }
          });
       }
    })
    res.status(200).send('all final profits added')
  }

  catch (error) {
    next(error)
  }
});

module.exports = router;
