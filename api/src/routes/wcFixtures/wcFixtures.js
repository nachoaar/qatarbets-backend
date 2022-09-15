require('dotenv').config();
const { Router } = require('express');
const axios = require('axios');
const { Match, Team, Headtohead, Stage_fixture } = require('../../db.js');
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

     /*  if (auxResult === "home") {
        await Team.update({

          group_points: home.group_points + 3
        },
          {
            where: {
              id: matchFound.home_team_id,
            }
          });
        await Team.update({
          group_points: away.group_points + 0
        },
          {
            where: {
              id: matchFound.away_team_id,
            }
          });
      }
      if (auxResult === "tie") {
        await Team.update({
          group_points: home.group_points + 1
        },
          {
            where: {
              id: matchFound.home_team_id,
            }
          });
        await Team.update({
          group_points: away.group_points + 1
        },
          {
            where: {
              id: matchFound.away_team_id,
            }
          });
      }
      if (auxResult === "away") {
        await Team.update({
          group_points: home.group_points + 0
        },
          {
            where: {
              id: matchFound.home_team_id,
            }
          });
        await Team.update({

          group_points: away.group_points + 3
        },
          {
            where: {
              id: matchFound.away_team_id,
            }
          });
      } */


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
     /*  await Team.update({
        group_points: null
      },
        {
          where: {
            id: matchFound.home_team_id,
          }
        });
      await Team.update({
        group_points: null
      },
        {
          where: {
            id: matchFound.away_team_id,
          }
        }); */
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

    console.log(simulate)

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

        console.log(currentPoints)

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
        for(let j = 0; j < array.length - 1 - i; j++){
    
          if(array[j].group_points < array[j+1].group_points){
    
          let tmp = array[j];
          array[j]=array[j+1];
          array[j+1] = tmp; 
        }
      }
    }
     return array;
    }

    //groups

    let teamsA = await Team.findAll({where:{groupId:1}});
    let teamsB = await Team.findAll({where:{groupId:2}});
    let teamsC = await Team.findAll({where:{groupId:3}});
    let teamsD = await Team.findAll({where:{groupId:4}});
    let teamsE = await Team.findAll({where:{groupId:5}});
    let teamsF = await Team.findAll({where:{groupId:6}});
    let teamsG = await Team.findAll({where:{groupId:7}});
    let teamsH = await Team.findAll({where:{groupId:8}});
    let orderedTeamsA = bubbleSort(teamsA);
    let orderedTeamsB = bubbleSort(teamsB);
    let orderedTeamsC = bubbleSort(teamsC);
    let orderedTeamsD = bubbleSort(teamsD);
    let orderedTeamsE = bubbleSort(teamsE);
    let orderedTeamsF = bubbleSort(teamsF);
    let orderedTeamsG = bubbleSort(teamsG);
    let orderedTeamsH = bubbleSort(teamsH);

    let responseArray=[
      {
        a1:orderedTeamsA[0],
        a2:orderedTeamsA[1]
      },
      {
        b1:orderedTeamsB[0],
        b2:orderedTeamsB[1]
      },
      {
        c1:orderedTeamsC[0],
        c2:orderedTeamsC[1]
      },
      {
        d1:orderedTeamsD[0],
        d2:orderedTeamsD[1]
      },
      {
        e1:orderedTeamsE[0],
        e2:orderedTeamsE[1]
      },
      {
        f1:orderedTeamsF[0],
        f2:orderedTeamsF[1]
      },
      {
        g1:orderedTeamsG[0],
        g2:orderedTeamsG[1]
      },
      {
        h1:orderedTeamsH[0],
        h2:orderedTeamsH[1]
      },
    ]

    // a1 y b2
    let allStages =  await Stage_fixture.findAll()
    
    if (allStages.length>0){
    allStages.map(async(el)=>{
      Stage_fixture.findByPk(el.id)
      .then(function (stageid) {
        stageid.destroy();
      })   
    })
    }

    

    await Stage_fixture.findOrCreate({
        where: {
             id: 1,  
           home_team_id: orderedTeamsA[0].id,
          away_team_id: orderedTeamsB[1].id,
          home_name: orderedTeamsA[0].name,
          away_name: orderedTeamsB[1].name,
           home_stage_position: "a1",
          away_stage_position: "b2",
          stage: "8"  
        }
      });

       // a2 y b1

      await Stage_fixture.findOrCreate({
        where: {
             id: 2,  
          home_team_id: orderedTeamsB[0].id,
          away_team_id: orderedTeamsA[1].id,
          home_name: orderedTeamsB[0].name,
          away_name: orderedTeamsA[1].name,
           home_stage_position: "b1",
          away_stage_position: "a2",
          stage: "8"  
        }
      });

       // c1 y d2

      await Stage_fixture.findOrCreate({
        where: {
             id: 3, 
           home_team_id: orderedTeamsC[0].id,
          away_team_id: orderedTeamsD[1].id,
          home_name: orderedTeamsC[0].name,
          away_name: orderedTeamsD[1].name,
           home_stage_position: "c1",
          away_stage_position: "d2",
          stage: "8"  
        }
      });

       // c2 y d1

      await Stage_fixture.findOrCreate({
        where: {
             id: 4, 
          home_team_id: orderedTeamsD[0].id,
          away_team_id: orderedTeamsC[1].id,
          home_name: orderedTeamsD[0].name,
          away_name: orderedTeamsC[1].name,
           home_stage_position: "d1",
          away_stage_position: "c2",
          stage: "8"  
        }
      });

       // e1 y f2

    await Stage_fixture.findOrCreate({
      where: {
           id: 5,  
         home_team_id: orderedTeamsE[0].id,
        away_team_id: orderedTeamsF[1].id,
        home_name: orderedTeamsE[0].name,
        away_name: orderedTeamsF[1].name,
         home_stage_position: "e1",
        away_stage_position: "f2",
        stage: "8"  
      }
    });

     // e2 y f1

     await Stage_fixture.findOrCreate({
      where: {
           id: 6,  
        home_team_id: orderedTeamsF[0].id,
        away_team_id: orderedTeamsE[1].id,
        home_name: orderedTeamsF[0].name,
        away_name: orderedTeamsE[1].name,
         home_stage_position: "f1",
        away_stage_position: "e2",
        stage: "8"  
      }
    });

     // g1 y h2

     await Stage_fixture.findOrCreate({
      where: {
           id: 7,  
         home_team_id: orderedTeamsG[0].id,
        away_team_id: orderedTeamsH[1].id,
        home_name: orderedTeamsG[0].name,
        away_name: orderedTeamsH[1].name,
         home_stage_position: "g1",
        away_stage_position: "h2",
        stage: "8"  
      }
    });

    // g2 y h1

    await Stage_fixture.findOrCreate({
      where: {
           id: 8,  
        home_team_id: orderedTeamsH[0].id,
        away_team_id: orderedTeamsG[1].id,
        home_name: orderedTeamsH[0].name,
        away_name: orderedTeamsG[1].name,
         home_stage_position: "h1",
        away_stage_position: "g2",
        stage: "8"  
      }
    });
    
    res.status(200).send(responseArray)
  }
  catch (error) {
    next(error)
  }
});


module.exports = router;