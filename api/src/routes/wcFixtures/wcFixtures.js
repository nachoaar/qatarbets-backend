require('dotenv').config();
const { Router } = require('express');
const axios = require('axios');
const { Match, Team, Headtohead, Stage_fixture } = require('../../db.js');
const { API_KEY } = require('../../DB_variables.js');
const { identifyBet } = require('../profitCoefCalculation.js');


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

    let actualResult = "";
    if (el.draw === true) {
      actualResult = "tie";
    } else if (el.draw === false && el.winnerHome === true) {
      actualResult = "winner_home";
    } else { actualResult = "winner_away" }

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
    let j = await Headtohead.findAll({
      where: {
        id_home: idDb1,
        id_away: idDb2
      }
    })
    let h = await Headtohead.findAll({
      where: {
        id_home: idDb2,
        id_away: idDb1
      }
    })
    let t = j.concat(h)
    res.status(200).send(t)
  }
  catch (error) {
    next(error)
  }
});

router.put('/matchSimulation', async (req, res, next) => {

  try {

    let id = Number(req.query.id)
    let simulate = req.query.sim

    let matchFound = await Match.findByPk(id)
    let home = await Team.findByPk(matchFound.home_team_id)
    let away = await Team.findByPk(matchFound.away_team_id)

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away", "tie"]
      let b = a[getRandomInt(3)]
      return b
    }
    let auxResult
    if (simulate === "simulate") {

      auxResult = getMatchResult()

      await Match.update({
        result_match: auxResult,
        status: "Finished"
      },
        {
          where: {
            id: id,
          }
        });

      let matchFoundAux = await Match.findAll({ where: { id: id } })
      res.status(200).send(matchFoundAux)
    }

    if (simulate === "reset") {

      await Match.update({
        result_match: null,
        status: "Not Started"
      },
        {
          where: {
            id: id,
          }
        });
      
      res.status(200).send('match reseted')
    }
  }
  catch (error) {
    next(error)
  }
});

router.put('/groupsSimulation', async (req, res, next) => {

  try {

    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away", "tie"]
      let b = a[getRandomInt(3)]
      return b
    }

    let matchesNotUp = await Match.findAll()

    if (simulate === "simulate") {

      matchesNotUp.map(async (el) => {

        if (!el.result_match) {

          let auxResult = getMatchResult()

          await Match.update({
            result_match: auxResult,
            status: "Finished"
          },
            {
              where: {
                id: el.id,
              }
            });
        }
      })
      let teams = await Team.findAll()
      teams.map(async (el1) => {

        let homeMatches = await Match.findAll({ where: { home_team_id: el1.id } })
        let awayMatches = await Match.findAll({ where: { away_team_id: el1.id } })

        let currentPoints = 0

        for (let n = 0; n < homeMatches.length; n++) {

          if (homeMatches[n].result_match === "home") {
            currentPoints = currentPoints + 3
          }
          if (homeMatches[n].result_match === "tie") {
            currentPoints = currentPoints + 1
          }
          if (homeMatches[n].result_match === "away") {
            currentPoints = currentPoints + 0
          }
        }

        for (let m = 0; m < awayMatches.length; m++) {

          if (awayMatches[m].result_match === "home") {
            currentPoints = currentPoints + 0
          }
          if (awayMatches[m].result_match === "tie") {
            currentPoints = currentPoints + 1
          }
          if (awayMatches[m].result_match === "away") {
            currentPoints = currentPoints + 3
          }
        }
        await Team.update({
          group_points: currentPoints
        },
          {
            where: {
              id: el1.id,
            }
          });
      })

      res.status(200).send('all matches updated')
    }
    if (simulate === "reset") {

      matchesNotUp.map(async (el) => {
        await Match.update({
          result_match: null,
          status: "Not Started"
        },
          {
            where: {
              id: el.id,
            }
          });
        await Team.update({
          group_points: 0
        },
          {
            where: {
              id: el.home_team_id,
            }
          });
        await Team.update({
          group_points: 0
        },
          {
            where: {
              id: el.away_team_id,
            }
          });
      })
      setTimeout(async function () {

        let allStages = await Stage_fixture.findAll()
  
        if (allStages.length > 0) {
         await allStages.map(async (el) => {
            await Stage_fixture.findByPk(el.id)
              .then(function (stageid) {
                stageid.destroy();
              })
          })
        }
      }, 1000);
      res.status(200).send('all matches reseted')
    }
  }
  catch (error) {
    next(error)
  }
});



router.post('/8stageSimulation/postStage', async (req, res, next) => {

  try {

    function bubbleSort(array) {

      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {

          if (array[j].group_points < array[j + 1].group_points) {

            let tmp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = tmp;
          }
        }
      }
      return array;
    }

    //groups

    let teamsA = await Team.findAll({ where: { groupId: 1 } });
    let teamsB = await Team.findAll({ where: { groupId: 2 } });
    let teamsC = await Team.findAll({ where: { groupId: 3 } });
    let teamsD = await Team.findAll({ where: { groupId: 4 } });
    let teamsE = await Team.findAll({ where: { groupId: 5 } });
    let teamsF = await Team.findAll({ where: { groupId: 6 } });
    let teamsG = await Team.findAll({ where: { groupId: 7 } });
    let teamsH = await Team.findAll({ where: { groupId: 8 } });
    let orderedTeamsA = bubbleSort(teamsA);
    let orderedTeamsB = bubbleSort(teamsB);
    let orderedTeamsC = bubbleSort(teamsC);
    let orderedTeamsD = bubbleSort(teamsD);
    let orderedTeamsE = bubbleSort(teamsE);
    let orderedTeamsF = bubbleSort(teamsF);
    let orderedTeamsG = bubbleSort(teamsG);
    let orderedTeamsH = bubbleSort(teamsH);

    /* let allStages = await Stage_fixture.findAll() */

    setTimeout(async function () {

      let allStages = await Stage_fixture.findAll()

      if (allStages.length > 0) {
       await allStages.map(async (el) => {
          await Stage_fixture.findByPk(el.id)
            .then(function (stageid) {
              stageid.destroy();
            })
        })
      }
    }, 1000);

    setTimeout(async function () {

      // a1 y b2

      await Stage_fixture.findOrCreate({
        where: {
          id: 1,
          date: new Date("2022-12-03T15:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsA[0].id,
          away_team_id: orderedTeamsB[1].id,
          home_name: orderedTeamsA[0].name,
          away_name: orderedTeamsB[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsA[0].id, orderedTeamsB[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsA[0].id, orderedTeamsB[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsA[0].id, orderedTeamsB[1].id)).profitCoefAway,
          stadium_name: "Khalifa International Stadium",
          city: "Doha",
          home_stage_position: "a1",
          away_stage_position: "b2",
          stage: "8"
        }
      });

      // a2 y b1

      await Stage_fixture.findOrCreate({
        where: {
          id: 2,
          date: new Date("2022-12-04T19:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsB[0].id,
          away_team_id: orderedTeamsA[1].id,
          home_name: orderedTeamsB[0].name,
          away_name: orderedTeamsA[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsB[0].id, orderedTeamsA[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsB[0].id, orderedTeamsA[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsB[0].id, orderedTeamsA[1].id)).profitCoefAway,
          stadium_name: "Al Bayt Stadium",
          city: "Al-Khor",
          home_stage_position: "b1",
          away_stage_position: "a2",
          stage: "8"
        }
      });

      // c1 y d2

      await Stage_fixture.findOrCreate({
        where: {
          id: 3,
          date: new Date("2022-12-03T19:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsC[0].id,
          away_team_id: orderedTeamsD[1].id,
          home_name: orderedTeamsC[0].name,
          away_name: orderedTeamsD[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsC[0].id, orderedTeamsD[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsC[0].id, orderedTeamsD[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsC[0].id, orderedTeamsD[1].id)).profitCoefAway,
          stadium_name: "Ahmed bin Ali Stadium",
          city: "Ar-Rayyan",
          home_stage_position: "c1",
          away_stage_position: "d2",
          stage: "8"
        }
      });

      // c2 y d1

      await Stage_fixture.findOrCreate({
        where: {
          id: 4,
          date: new Date("2022-12-04T15:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsD[0].id,
          away_team_id: orderedTeamsC[1].id,
          home_name: orderedTeamsD[0].name,
          away_name: orderedTeamsC[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsD[0].id, orderedTeamsC[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsD[0].id, orderedTeamsC[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsD[0].id, orderedTeamsC[1].id)).profitCoefAway,
          stadium_name: "Al Thumama Stadium",
          city: "Doha",
          home_stage_position: "d1",
          away_stage_position: "c2",
          stage: "8"
        }
      });

      // e1 y f2

      await Stage_fixture.findOrCreate({
        where: {
          id: 5,
          date: new Date("2022-12-05T15:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsE[0].id,
          away_team_id: orderedTeamsF[1].id,
          home_name: orderedTeamsE[0].name,
          away_name: orderedTeamsF[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsE[0].id, orderedTeamsF[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsE[0].id, orderedTeamsF[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsE[0].id, orderedTeamsF[1].id)).profitCoefAway,
          stadium_name: "Al Janoub Stadium",
          city: "Al Wakrah",
          home_stage_position: "e1",
          away_stage_position: "f2",
          stage: "8"
        }
      });

      // e2 y f1

      await Stage_fixture.findOrCreate({
        where: {
          id: 6,
          date: new Date("2022-12-06T15:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsF[0].id,
          away_team_id: orderedTeamsE[1].id,
          home_name: orderedTeamsF[0].name,
          away_name: orderedTeamsE[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsF[0].id, orderedTeamsE[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsF[0].id, orderedTeamsE[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsF[0].id, orderedTeamsE[1].id)).profitCoefAway,
          stadium_name: "Education City Stadium",
          city: "Ar-Rayyan",
          home_stage_position: "f1",
          away_stage_position: "e2",
          stage: "8"
        }
      });

      // g1 y h2

      await Stage_fixture.findOrCreate({
        where: {
          id: 7,
          date: new Date("2022-12-05T19:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsG[0].id,
          away_team_id: orderedTeamsH[1].id,
          home_name: orderedTeamsG[0].name,
          away_name: orderedTeamsH[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsG[0].id, orderedTeamsH[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsG[0].id, orderedTeamsH[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsG[0].id, orderedTeamsH[1].id)).profitCoefAway,
          stadium_name: "Stadium 974",
          city: "Doha",
          home_stage_position: "g1",
          away_stage_position: "h2",
          stage: "8"
        }
      });

      // g2 y h1

      await Stage_fixture.findOrCreate({
        where: {
          id: 8,
          date: new Date("2022-12-06T19:00:00.000Z"),
          status: "Not Started",
          home_team_id: orderedTeamsH[0].id,
          away_team_id: orderedTeamsG[1].id,
          home_name: orderedTeamsH[0].name,
          away_name: orderedTeamsG[1].name,
          result_match: null,
          profit_coef_home: (identifyBet(orderedTeamsH[0].id, orderedTeamsG[1].id)).profitCoefHome,
          profit_coef_draw: (identifyBet(orderedTeamsH[0].id, orderedTeamsG[1].id)).profitCoefDraw,
          profit_coef_away: (identifyBet(orderedTeamsH[0].id, orderedTeamsG[1].id)).profitCoefAway,
          stadium_name: "Lusail Iconic Stadium",
          city: "Lusail",
          home_stage_position: "h1",
          away_stage_position: "g2",
          stage: "8"
        }
      });

      let responseArray = [
        {
          a1: orderedTeamsA[0],
          a2: orderedTeamsA[1]
        },
        {
          b1: orderedTeamsB[0],
          b2: orderedTeamsB[1]
        },
        {
          c1: orderedTeamsC[0],
          c2: orderedTeamsC[1]
        },
        {
          d1: orderedTeamsD[0],
          d2: orderedTeamsD[1]
        },
        {
          e1: orderedTeamsE[0],
          e2: orderedTeamsE[1]
        },
        {
          f1: orderedTeamsF[0],
          f2: orderedTeamsF[1]
        },
        {
          g1: orderedTeamsG[0],
          g2: orderedTeamsG[1]
        },
        {
          h1: orderedTeamsH[0],
          h2: orderedTeamsH[1]
        },
        all8matches = await Stage_fixture.findAll()
      ]

      res.status(200).send(responseArray)
    }, 2000);
  }
  catch (error) {
    next(error)
  }
});

router.post('/8stageMatchSimulation', async (req, res, next) => {

  try {

    let id = Number(req.query.id)
    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }
    let auxResult
    if (simulate === "simulate") {

      auxResult = getMatchResult()

      await Stage_fixture.update({
        result_match: auxResult,
        status: "Finished"
      },
        {
          where: {
            id: id,
          }
        });


      if (id > 0 && id < 9) {
        let matchFoundAux = await Stage_fixture.findAll({ where: { id: id } });
        res.status(200).send(matchFoundAux)
      } else res.status(400).send("you must enter an id between 1 and 8")
    }

    if (simulate === "reset") {

      await Stage_fixture.update({
        result_match: null,
        status: "Not Started"
      },
        {
          where: {
            id: id,
          }
        });
      res.status(200).send('match reseted')
    }
  }
  catch (error) {
    next(error)
  }
});


router.post('/8stageAllSimulation', async (req, res, next) => {

  try {

    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }

    let matchesNotUp = await Stage_fixture.findAll()

    if (simulate === "simulate") {

      await matchesNotUp.map(async (el) => {

        if (!el.result_match) {

          let auxResult = getMatchResult()
          if (el.id !== 9 && el.id !== 10 && el.id !== 11 && el.id !== 12) {
            await Stage_fixture.update({
              result_match: auxResult,
              status: "Finished"
            },
              {
                where: {
                  id: el.id,
                }
              });
          }
        }
      })
      setTimeout(async function () {
        
        //winner of match 1

        let matchFound1 = await Stage_fixture.findAll({ where: { id: 1 } })
        if (matchFound1[0].result_match === "home") {
          var match1winner = {
            home_team_id: matchFound1[0].home_team_id,
            home_name: matchFound1[0].home_name,
          }
        }
        if (matchFound1[0].result_match === "away") {
          var match1winner = {
            home_team_id: matchFound1[0].away_team_id,
            home_name: matchFound1[0].away_name,
          }
        }

        //winner of match 2

        let matchFound2 = await Stage_fixture.findAll({ where: { id: 2 } })
        if (matchFound2[0].result_match === "home") {
          var match2winner = {
            home_team_id: matchFound2[0].home_team_id,
            home_name: matchFound2[0].home_name,
          }
        }
        if (matchFound2[0].result_match === "away") {
          var match2winner = {
            home_team_id: matchFound2[0].away_team_id,
            home_name: matchFound2[0].away_name,
          }
        }

        //winner of match 3

        let matchFound3 = await Stage_fixture.findAll({ where: { id: 3 } })
        if (matchFound3[0].result_match === "home") {
          var match3winner = {
            home_team_id: matchFound3[0].home_team_id,
            home_name: matchFound3[0].home_name,
          }
        }
        if (matchFound3[0].result_match === "away") {
          var match3winner = {
            home_team_id: matchFound3[0].away_team_id,
            home_name: matchFound3[0].away_name,
          }
        }

        //winner of match 4

        let matchFound4 = await Stage_fixture.findAll({ where: { id: 4 } })
        if (matchFound4[0].result_match === "home") {
          var match4winner = {
            home_team_id: matchFound4[0].home_team_id,
            home_name: matchFound4[0].home_name,
          }
        }
        if (matchFound4[0].result_match === "away") {
          var match4winner = {
            home_team_id: matchFound4[0].away_team_id,
            home_name: matchFound4[0].away_name,
          }
        }

        //winner of match 5

        let matchFound5 = await Stage_fixture.findAll({ where: { id: 5 } })
        if (matchFound5[0].result_match === "home") {
          var match5winner = {
            home_team_id: matchFound5[0].home_team_id,
            home_name: matchFound5[0].home_name,
          }
        }
        if (matchFound5[0].result_match === "away") {
          var match5winner = {
            home_team_id: matchFound5[0].away_team_id,
            home_name: matchFound5[0].away_name,
          }
        }

        //winner of match 6

        let matchFound6 = await Stage_fixture.findAll({ where: { id: 6 } })
        if (matchFound6[0].result_match === "home") {
          var match6winner = {
            home_team_id: matchFound6[0].home_team_id,
            home_name: matchFound6[0].home_name,
          }
        }
        if (matchFound6[0].result_match === "away") {
          var match6winner = {
            home_team_id: matchFound6[0].away_team_id,
            home_name: matchFound6[0].away_name,
          }
        }

        //winner of match 7

        let matchFound7 = await Stage_fixture.findAll({ where: { id: 7 } })
        if (matchFound7[0].result_match === "home") {
          var match7winner = {
            home_team_id: matchFound7[0].home_team_id,
            home_name: matchFound7[0].home_name,
          }
        }
        if (matchFound7[0].result_match === "away") {
          var match7winner = {
            home_team_id: matchFound7[0].away_team_id,
            home_name: matchFound7[0].away_name,
          }
        }
        //winner of match 8

        let matchFound8 = await Stage_fixture.findAll({ where: { id: 8 } })
        if (matchFound8[0].result_match === "home") {
          var match8winner = {
            home_team_id: matchFound8[0].home_team_id,
            home_name: matchFound8[0].home_name,
          }
        }
        if (matchFound8[0].result_match === "away") {
          var match8winner = {
            home_team_id: matchFound8[0].away_team_id,
            home_name: matchFound8[0].away_name,
          }
        }



        //winner of match 1 & winner of match 3

        await Stage_fixture.findOrCreate({
          where: {
            id: 9,
            date: new Date("2022-12-09T19:00:00.000Z"),
            status: "Not Started",
            home_team_id: match1winner.home_team_id,
            away_team_id: match3winner.home_team_id,
            home_name: match1winner.home_name,
            away_name: match3winner.home_name,
            result_match: null,
            profit_coef_home: (identifyBet(match1winner.home_team_id, match3winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match1winner.home_team_id, match3winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match1winner.home_team_id, match3winner.home_team_id)).profitCoefAway,
            stadium_name: "Lusail Iconic Stadium",
            city: "Lusail",
            home_stage_position: "a1 - b2 winner",
            away_stage_position: "c1 - d2 winner",
            stage: "4"
          }
        });

        //winner of match 2 & winner of match 4

        await Stage_fixture.findOrCreate({
          where: {
            id: 10,
            date: new Date("2022-12-10T19:00:00.000Z"),
            status: "Not Started",
            home_team_id: match2winner.home_team_id,
            away_team_id: match4winner.home_team_id,
            home_name: match2winner.home_name,
            away_name: match4winner.home_name,
            result_match: null,
            profit_coef_home: (identifyBet(match2winner.home_team_id, match4winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match2winner.home_team_id, match4winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match2winner.home_team_id, match4winner.home_team_id)).profitCoefAway,
            stadium_name: "Al Bayt Stadium",
            city: "Al-Khor",
            home_stage_position: "a2 - b1 winner",
            away_stage_position: "c2 - d1 winner",
            stage: "4"
          }
        });

        //winner of match 5 & winner of match 7

        await Stage_fixture.findOrCreate({
          where: {
            id: 11,
            date: new Date("2022-12-09T15:00:00.000Z"),
            status: "Not Started",
            home_team_id: match5winner.home_team_id,
            away_team_id: match7winner.home_team_id,
            home_name: match5winner.home_name,
            away_name: match7winner.home_name,
            result_match: null,
            profit_coef_home: (identifyBet(match5winner.home_team_id, match7winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match5winner.home_team_id, match7winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match5winner.home_team_id, match7winner.home_team_id)).profitCoefAway,
            stadium_name: "Education City Stadium",
            city: "Ar-Rayyan",
            home_stage_position: "e1 - f2 winner",
            away_stage_position: "g1 - h2 winner",
            stage: "4"
          }
        });

        //winner of match 6 & winner of match 8

        await Stage_fixture.findOrCreate({
          where: {
            id: 12,
            date: new Date("2022-12-10T15:00:00.000Z"),
            status: "Not Started",
            home_team_id: match6winner.home_team_id,
            away_team_id: match8winner.home_team_id,
            home_name: match6winner.home_name,
            away_name: match8winner.home_name,
            result_match: null,
            profit_coef_home: (identifyBet(match6winner.home_team_id, match8winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match6winner.home_team_id, match8winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match6winner.home_team_id, match8winner.home_team_id)).profitCoefAway,
            stadium_name: "Al Thumama Stadium",
            city: "Doha",
            home_stage_position: "e2 - f1 winner",
            away_stage_position: "g2 - h1 winner",
            stage: "4"
          }
        });

        let stage4matches = [];
        for (let d = 1; d < 13; d++) {
          stage4matches.push(await Stage_fixture.findByPk(d))
        }
        res.status(200).send(stage4matches)
      }, 1000);
    }

    if (simulate === "reset") {

      let stage8mateches = await Stage_fixture.findAll()

      stage8mateches.map(async (el) => {

        await Stage_fixture.update({
          result_match: null,
          status: "Not Started"
        },
          {
            where: {
              id: el.id,
            }
          });
        if (el.id === 9 || el.id === 10 || el.id === 11 || el.id === 12) {
          await Stage_fixture.findByPk(el.id)
            .then(function (stageid) {
              stageid.destroy();
            })
        }
      })
      res.status(200).send('all matches reseted')
    }
  }
  catch (error) {
    next(error)
  }
});


router.post('/4stageAllSimulation', async (req, res, next) => {

  try {

    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }

    let matchesNotUp = await Stage_fixture.findAll()

    if (simulate === "simulate") {

      await matchesNotUp.map(async (el) => {

        if (!el.result_match) {

          let auxResult = getMatchResult()
          if (el.id !== 13 && el.id !== 14) {
            await Stage_fixture.update({
              result_match: auxResult,
              status: "Finished"
            },
              {
                where: {
                  id: el.id,
                }
              });
          }
        }
      })
      setTimeout(async function () {

        //winner of match 9

        let matchFound9 = await Stage_fixture.findAll({ where: { id: 9 } })
        if (matchFound9[0].result_match === "home") {
          var match9winner = {
            home_team_id: matchFound9[0].home_team_id,
            home_name: matchFound9[0].home_name,
          }
        }
        if (matchFound9[0].result_match === "away") {
          var match9winner = {
            home_team_id: matchFound9[0].away_team_id,
            home_name: matchFound9[0].away_name,
          }
        }

        //winner of match 10

        let matchFound10 = await Stage_fixture.findAll({ where: { id: 10 } })
        if (matchFound10[0].result_match === "home") {
          var match10winner = {
            home_team_id: matchFound10[0].home_team_id,
            home_name: matchFound10[0].home_name,
          }
        }
        if (matchFound10[0].result_match === "away") {
          var match10winner = {
            home_team_id: matchFound10[0].away_team_id,
            home_name: matchFound10[0].away_name,
          }
        }

        //winner of match 11

        let matchFound11 = await Stage_fixture.findAll({ where: { id: 11 } })
        if (matchFound11[0].result_match === "home") {
          var match11winner = {
            home_team_id: matchFound11[0].home_team_id,
            home_name: matchFound11[0].home_name,
          }
        }
        if (matchFound11[0].result_match === "away") {
          var match11winner = {
            home_team_id: matchFound11[0].away_team_id,
            home_name: matchFound11[0].away_name,
          }
        }

        //winner of match 12

        let matchFound12 = await Stage_fixture.findAll({ where: { id: 12 } })
        if (matchFound12[0].result_match === "home") {
          var match12winner = {
            home_team_id: matchFound12[0].home_team_id,
            home_name: matchFound12[0].home_name,
          }
        }
        if (matchFound12[0].result_match === "away") {
          var match12winner = {
            home_team_id: matchFound12[0].away_team_id,
            home_name: matchFound12[0].away_name,
          }
        }

        //winner of match 9 & winner of match 11

        await Stage_fixture.findOrCreate({
          where: {
            id: 13,
            date: new Date("2022-12-13T19:00:00.000Z"),
            status: "Not Started",
            home_team_id: match9winner.home_team_id,
            away_team_id: match11winner.home_team_id,
            home_name: match9winner.home_name,
            away_name: match11winner.home_name,
            result_match: null,
            profit_coef_home: (identifyBet(match9winner.home_team_id, match11winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match9winner.home_team_id, match11winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match9winner.home_team_id, match11winner.home_team_id)).profitCoefAway,
            stadium_name: "Education City Stadium",
            city: "Ar-Rayyan",
            home_stage_position: "match 9 winner",
            away_stage_position: "match 11 winner",
            stage: "2"
          }
        });

        //winner of match 10 & winner of match 12

        await Stage_fixture.findOrCreate({
          where: {
            id: 14,
            date: new Date("2022-12-14T19:00:00.000Z"),
            status: "Not Started",
            home_team_id: match10winner.home_team_id,
            away_team_id: match12winner.home_team_id,
            home_name: match10winner.home_name,
            away_name: match12winner.home_name,
            result_match: null,
            profit_coef_home: (identifyBet(match10winner.home_team_id, match12winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match10winner.home_team_id, match12winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match10winner.home_team_id, match12winner.home_team_id)).profitCoefAway,
            stadium_name: "Al Bayt Stadium",
            city: "Al-Khor",
            home_stage_position: "match 10 winner",
            away_stage_position: "match 12 winner",
            stage: "2"
          }
        });

        let stage4matches = [];
        for (let d = 1; d < 15; d++) {
          stage4matches.push(await Stage_fixture.findByPk(d))
        }
        res.status(200).send(stage4matches)
      }, 1000);
    }

    if (simulate === "reset") {

      let stage4mateches = await Stage_fixture.findAll()

      stage4mateches.map(async (el) => {

        if (el.id === 9 || el.id === 10 || el.id === 11 || el.id === 12) {
          await Stage_fixture.update({
            result_match: null,
            status: "Not Started"
          },
            {
              where: {
                id: el.id,
              }
            });
        }
        if (el.id === 13 || el.id === 14) {
          await Stage_fixture.findByPk(el.id)
            .then(function (stageid) {
              stageid.destroy();
            })
        }
      })
      res.status(200).send('all matches reseted')
    }
  }
  catch (error) {
    next(error)
  }
});

router.post('/4stageMatchSimulation', async (req, res, next) => {

  try {

    let id = Number(req.query.id)
    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }
    let auxResult
    if (simulate === "simulate") {

      auxResult = getMatchResult()

      await Stage_fixture.update({
        result_match: auxResult,
        status: "Finished"
      },
        {
          where: {
            id: id,
          }
        });

      if (id > 8 && id < 13) {
        let matchFoundAux = await Stage_fixture.findAll({ where: { id: id } });
        res.status(200).send(matchFoundAux)
      } else res.status(400).send("you must enter an id between 9 and 12")
    }

    if (simulate === "reset") {

      await Stage_fixture.update({
        result_match: null,
        status: "Not Started"
      },
        {
          where: {
            id: id,
          }
        });
      res.status(200).send('match reseted')
    }
  }
  catch (error) {
    next(error)
  }
});

router.post('/semiStageMatchSimulation', async (req, res, next) => {

  try {

    let id = Number(req.query.id)
    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }
    let auxResult
    if (simulate === "simulate") {

      auxResult = getMatchResult()

      await Stage_fixture.update({
        result_match: auxResult,
        status: "Finished"
      },
        {
          where: {
            id: id,
          }
        });

      if (id > 12 && id < 15) {
        let matchFoundAux = await Stage_fixture.findAll({ where: { id: id } });
        res.status(200).send(matchFoundAux)
      } else res.status(400).send("you must enter an id between 13 or 14")
    }

    if (simulate === "reset") {

      await Stage_fixture.update({
        result_match: null,
        status: "Not Started"
      },
        {
          where: {
            id: id,
          }
        });
      res.status(200).send('match reseted')
    }
  }
  catch (error) {
    next(error)
  }
});

router.post('/semiStageAllSimulation', async (req, res, next) => {

  try {

    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }

    let matchesNotUp = await Stage_fixture.findAll()

    if (simulate === "simulate") {

      await matchesNotUp.map(async (el) => {

        if (!el.result_match) {

          let auxResult = getMatchResult()
          if (el.id !== 15 && el.id !== 16) {
            await Stage_fixture.update({
              result_match: auxResult,
              status: "Finished"
            },
              {
                where: {
                  id: el.id,
                }
              });
          }
        }
      })
      setTimeout(async function () {

        //winner of match 13

        let matchFound13 = await Stage_fixture.findAll({ where: { id: 13 } })
        if (matchFound13[0].result_match === "home") {
          var match13winner = {
            home_team_id: matchFound13[0].home_team_id,
            home_name: matchFound13[0].home_name,
            lose_away_team_id: matchFound13[0].away_team_id,
            lose_away_name: matchFound13[0].away_name,
          }
        }
        if (matchFound13[0].result_match === "away") {
          var match13winner = {
            home_team_id: matchFound13[0].away_team_id,
            home_name: matchFound13[0].away_name,
            lose_away_team_id: matchFound13[0].home_team_id,
            lose_away_name: matchFound13[0].home_name,
          }
        }

        //winner of match 14

        let matchFound14 = await Stage_fixture.findAll({ where: { id: 14 } })
        if (matchFound14[0].result_match === "home") {
          var match14winner = {
            home_team_id: matchFound14[0].home_team_id,
            home_name: matchFound14[0].home_name,
            lose_away_team_id: matchFound14[0].away_team_id,
            lose_away_name: matchFound14[0].away_name,
          }
        }
        if (matchFound14[0].result_match === "away") {
          var match14winner = {
            home_team_id: matchFound14[0].away_team_id,
            home_name: matchFound14[0].away_name,
            lose_away_team_id: matchFound14[0].home_team_id,
            lose_away_name: matchFound14[0].home_name,
          }
        }

        //loser of match 13 & loser of match 14

        await Stage_fixture.findOrCreate({
          where: {
            id: 15,
            date: new Date("2022-12-17T15:00:00.000Z"),
            status: "Not Started",
            home_team_id: match13winner.lose_away_team_id,
            away_team_id: match14winner.lose_away_team_id,
            home_name: match13winner.lose_away_name,
            away_name: match14winner.lose_away_name,
            result_match: null,
            profit_coef_home: (identifyBet(match13winner.lose_away_team_id, match14winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match13winner.lose_away_team_id, match14winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match13winner.lose_away_team_id, match14winner.home_team_id)).profitCoefAway,
            stadium_name: "Khalifa International Stadium",
            city: "Doha",
            home_stage_position: "match 13 loser",
            away_stage_position: "match 14 loser",
            stage: "1.5"
          }
        });

        //winner of match 10 & winner of match 12

        await Stage_fixture.findOrCreate({
          where: {
            id: 16,
            date: new Date("2022-12-18T15:00:00.000Z"),
            status: "Not Started",
            home_team_id: match13winner.home_team_id,
            away_team_id: match14winner.home_team_id,
            home_name: match13winner.home_name,
            away_name: match14winner.home_name,
            result_match: null,
            profit_coef_home: (identifyBet(match13winner.home_team_id, match14winner.home_team_id)).profitCoefHome,
            profit_coef_draw: (identifyBet(match13winner.home_team_id, match14winner.home_team_id)).profitCoefDraw,
            profit_coef_away: (identifyBet(match13winner.home_team_id, match14winner.home_team_id)).profitCoefAway,
            stadium_name: "Lusail Iconic Stadium",
            city: "Lusail",
            home_stage_position: "match 13 winner",
            away_stage_position: "match 14 winner",
            stage: "1"
          }
        });

        let stage4matches = [];
        for (let d = 1; d < 17; d++) {
          stage4matches.push(await Stage_fixture.findByPk(d))
        }
        res.status(200).send(stage4matches)
      }, 1000);
    }

    if (simulate === "reset") {

      let stage4mateches = await Stage_fixture.findAll()

      stage4mateches.map(async (el) => {

        if (el.id === 13 || el.id === 14) {
          await Stage_fixture.update({
            result_match: null,
            status: "Not Started"
          },
            {
              where: {
                id: el.id,
              }
            });
        }
        if (el.id === 15 || el.id === 16) {
          await Stage_fixture.findByPk(el.id)
            .then(function (stageid) {
              stageid.destroy();
            })
        }
      })
      res.status(200).send('all matches reseted')
    }
  }
  catch (error) {
    next(error)
  }
});

router.post('/finalStageMatchSimulation', async (req, res, next) => {

  try {

    let id = Number(req.query.id)
    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }
    let auxResult
    if (simulate === "simulate") {

      auxResult = getMatchResult()

      await Stage_fixture.update({
        result_match: auxResult,
        status: "Finished"
      },
        {
          where: {
            id: id,
          }
        });

      if (id > 14 && id < 17) {
        let matchFoundAux = await Stage_fixture.findAll({ where: { id: id } });
        res.status(200).send(matchFoundAux)
      } else res.status(400).send("you must enter an id between 15 or 16")
    }

    if (simulate === "reset") {

      await Stage_fixture.update({
        result_match: null,
        status: "Not Started"
      },
        {
          where: {
            id: id,
          }
        });
      res.status(200).send('match reseted')
    }
  }
  catch (error) {
    next(error)
  }
});

router.post('/finalStageAllSimulation', async (req, res, next) => {

  try {

    let simulate = req.query.sim

    function getMatchResult() {
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      let a = ["home", "away"]
      let b = a[getRandomInt(2)]
      return b
    }

    let matchesNotUp = await Stage_fixture.findAll()

    if (simulate === "simulate") {

      await matchesNotUp.map(async (el) => {

        if (!el.result_match) {

          let auxResult = getMatchResult()
          
            await Stage_fixture.update({
              result_match: auxResult,
              status: "Finished"
            },
              {
                where: {
                  id: el.id,
                }
              });
          
        }
      })
      setTimeout(async function () {
        
        let stage4matches = [];
        for (let d = 1; d < 17; d++) {
          stage4matches.push(await Stage_fixture.findByPk(d))
        }
        res.status(200).send(stage4matches)
      }, 1000);
    }

    if (simulate === "reset") {

      let stage4mateches = await Stage_fixture.findAll()

      stage4mateches.map(async (el) => {

        if (el.id === 15 || el.id === 16) {
          await Stage_fixture.update({
            result_match: null,
            status: "Not Started"
          },
            {
              where: {
                id: el.id,
              }
            });
        }
      })
      res.status(200).send('all matches reseted')
    }
  }
  catch (error) {
    next(error)
  }
});

router.get('/StageFixture/allMatches', async (req, res, next) => {

  let allMatches = await Stage_fixture.findAll()
  
  try {

    function bubbleSort(array) {

      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {

          if (array[j].id > array[j + 1].id) {

            let tmp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = tmp;
          }
        }
      }
      return array;
    }

    let allMatches = bubbleSort(await Stage_fixture.findAll())
    res.status(200).send(allMatches)
  }
  catch (error) {
    next(error)
  } 
}); 
   

module.exports = router; 