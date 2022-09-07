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

module.exports = router;
