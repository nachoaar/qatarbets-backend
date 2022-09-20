require("dotenv").config();
const { Router } = require("express");
const { Bet, Match, User, Team, Stage_fixture } = require("../../db.js");
const { validateToken } = require('../tokenController.js');
const nodemailer = require("nodemailer");

const router = Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: "QatarBets2022@gmail.com", // generated ethereal user
    pass: "pcuclpxdckaayvbw", // generated ethereal password
  },  
});

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
    /* let partidoId = newBet.matchId;

    let partido = Match.findOne({ where: { matchId: partidoId } })
    let partidoLocal = partido.home_team_id;
    let partidoVisitante =  partido.away_team_id;
    
    let Local = Team.findOne({ where: { id : partidoLocal } });
    let Visitante = Team.findOne({ where: { id : partidoVisitante } });

    let localName = Local.name;
    let visitanteName = Visitante.name;
    let email = token.email;
    
    await transporter.sendMail({
      from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
      to: email, //Receptor
      subject: "Apuesta realizada con éxito", //Asunto
      html: `<!DOCTYPE html>
      <html lang="eng">
      <head>
      <meta charset="utf-8"/>

      <!-- ESTILOS -->
      <style type="text/css">
        body {
          margin: 0;
          background-color: #ececec;
        }
        table {
          border-spacing: 0;
        }
        td {
          padding: 0;
        }
        img {
          border: 0;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #ececec;
          padding-bottom: 5px;
        }
        .main {
          background-color: #000000;
          margin: 0 auto;
          width: 100%;
          max-width: 600px;
          border-spacing: 0; 
          font-family: sans-serif;
          color: #171a1b;
        }
        .dos-columnas{
          text-align: center;
          font-size: 0;
        }
        .dos-columnas .columna{
          width: 100%;
          max-width: 300px;
          display: inline-block;
          vertical-align: top;  
          text-align: center;
        }
        .boton{
          background-color: red;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 5px;
          font-weight: bold;
        }
      </style>   
      </head>
      <body>
      <center class="wrapper">
      <table class="main" width="100%">

      <!-- BORDE SUPERIOR -->
      <tr>
         <td height="8" style="background-color: red;"></td>
      </tr>

      <!-- SECCION DE LOGOS -->
      <tr>
         <td style="padding: 14px 0 4px; background-color: rgb(96, 2, 96);">   
             <table width="100%">

                <tr>
                   <td class="dos-columnas">
                   
                       <table class="columna">
                          <tr>
                             <td style="padding: 0 62px 10px;">
                               <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app"><img src="https://i.imgur.com/cf7jqcN.png" width="250" alt="Encabezado" title="Encabezado logo"/></a>
                             </td>
                          </tr>   
                       </table>

                       <table class="columna">
                        <tr>
                           <td style="padding: 40px 86px;">
                             <a style="margin-left: 5px;" href="https://www.facebook.com/QatarBetsLATAM"><img src="https://i.imgur.com/G3cmjre.png" width="27" alt="facebook" /></a>
                             <a style="margin-left: 5px;" href="https://twitter.com/QatarBets"><img src="https://i.imgur.com/x8Fq8j4.png" width="27" alt="twitter"/></a>
                             <a style="margin-left: 5px;" href="https://www.instagram.com/qatar_bets/"><img src="https://i.imgur.com/31bbcEa.png" width="27" alt="instagram"/></a>
                             <a style="margin-left: 5px;" href="https://www.linkedin.com/company/qatar-bets/"><img src="https://i.imgur.com/st6Gh4d.png" width="27" alt="linkedin"/></a>
                           </td>
                        </tr>   
                     </table>

                   </td>
                </tr>

             </table>
         </td>
      </tr>
      <!-- MENSAJE -->
      <tr>
        <td style="padding: 15px 0 50px; background-color: #ffffff;"> 
          <table style="background-color:#ffffff; width: 100%;">
            <tr>
              <td style="text-align: center; padding: 15px;">
              <p style="font-size: 20px; font-weight: bold;">Has realizado correctamente la apuesta al partido de</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Felicidades, has realizado con éxito la apuesta en el partido de que se realizará el día AAAA</p>
              <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app" class="boton">Mira aquí tus apuestas</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- FOOTER -->
      <tr>
        <td style="background-color: rgb(96, 2, 96);">
          <table>

            <tr>
              <td style="text-align: center; padding: 45px 20px; color: #ffffff;">
                <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app">
                  <img src="https://i.imgur.com/oudfmJO.png" alt="logo" width="50"/> <a style="margin-left: 60px; color: #ffffff;">Todos los derechos reservados © 2022 QATARBETS</a>
                </a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
      <tr>
        <td style="background-color: #ececec">
          <table>
            <tr>
              <td style="text-align: left; margin-top: 10px;">
                <p style="margin-top: 10px; color: #8d8d8d; font-size: 13px;">QATARBETS, Inc.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      </table>
      </center>
      </body>
      </html>`,
    }); */
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

    let matchId = Number(req.query.matchId)
    let matchWinner = req.query.matchWinner  // this can be only home, draw, away

    if (matchWinner === "draw") {

      await Match.update({
        result_match: "tie"
      },
        {
          where: {
            id: matchId,
          }
        });

    }

    if (matchWinner !== "draw") {

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

      let actualCoef = -1

      if (matchWinner === "home") actualCoef = currentProfit.profitCoefHome
      if (matchWinner === "draw") actualCoef = currentProfit.profitCoefDraw
      if (matchWinner === "away") actualCoef = currentProfit.profitCoefAway

      if (el.result === matchDB.result_match) {

        await Bet.update({
          expected_profit: el.money_bet * actualCoef,
          final_profit: el.money_bet * actualCoef,
        },
          {
            where: {
              id: el.id,
            }
          });
      }
      else if (el.result === "draw" && matchDB.result_match === "tie") {

        await Bet.update({
          expected_profit: el.money_bet * actualCoef,
          final_profit: el.money_bet * actualCoef,
        },
          {
            where: {
              id: el.id,
            }
          });
      }
      else {

        await Bet.update({
          expected_profit: el.money_bet * actualCoef,
          final_profit: 0,
        },
          {
            where: {
              id: el.id,
            }
          });
      }
    })
    setTimeout(async function () {
    let allBetsSend = await Bet.findAll()
    res.status(200).send(allBetsSend)
    }, 1000);
  }

  catch (error) {
    next(error)
  }
});

router.get('/calculateProfitsStage', async (req, res, next) => {

  try {

    let matchIdN = Number(req.query.matchId)
    let matchId = req.query.matchId
    
     let matchWinner = req.query.matchWinner  // this can be only home, draw, away

     if(matchIdN < 1 || matchIdN > 16){
      return res.status(400).send('match id must be a number between 1 and 16')
     } 

     if (!(matchWinner === "home" || matchWinner === "away")) {
      return res.status(400).send('You must enter the result of the match as home or away only, nor tie or draw are allowed')
     }

    let allBets = await Bet.findAll({
      where: {
        condition: matchId,
      },
    });

    allBets.map(async (el) => {

      let matchDB = await Stage_fixture.findByPk(matchId)
      let actualCoef = -1

      if (matchWinner === "home") actualCoef = matchDB.profit_coef_home
      if (matchWinner === "draw") actualCoef = matchDB.profit_coef_draw
      if (matchWinner === "away") actualCoef = matchDB.profit_coef_away

      if (el.result === matchDB.result_match) {

        await Bet.update({
          expected_profit: el.money_bet * actualCoef,
          final_profit: el.money_bet * actualCoef,
        },
          {
            where: {
              id: el.id,
            }
          });
      }
      else if (el.result === "draw" && matchDB.result_match === "tie") {

        await Bet.update({
          expected_profit: el.money_bet * actualCoef,
          final_profit: el.money_bet * actualCoef,
        },
          {
            where: {
              id: el.id,
            }
          });
      }
      else {

        await Bet.update({
          expected_profit: el.money_bet * actualCoef,
          final_profit: 0,
        },
          {
            where: {
              id: el.id,
            }
          });
      }
    })
    setTimeout(async function () {
    let allBetsSend = await Bet.findAll()
    res.status(200).send(allBetsSend)
    }, 1000);
  }

  catch (error) {
    next(error)
  }
});

router.get('/bets5', async (req, res, next) => {

  function bubbleSort(array) {
    
    for (let i = 0; i < array.length - 1; i++) {                                                                                                         
      for(let j = 0; j < array.length - 1 - i; j++){
  
        if(array[j].count > array[j+1].count){
  
        let tmp = array[j];
        array[j]=array[j+1];
        array[j+1] = tmp; 
      }
    }
  }
   return array;
  }

  try {

    let betArray = [];

    let allBets = await Bet.findAll({
      order : [
        ['matchId', 'ASC']
      ],
    });

    var count = 0

    function increaseCount (){
      count++
      return count
    }
    let a = allBets[0].matchId
    let superArray=[]

    await allBets.map(async (el) => {
      
      if (a !== el.matchId){
        superArray.push({
          matchId: a,
          count: count,
        })
        count = 0;
        a = el.matchId
      }
      betArray.push({
        matchId: el.matchId,
        count: increaseCount(),
      })
    })

    let newArray = await bubbleSort(superArray)
    let sliceArray = await newArray.slice(newArray.length-5,newArray.length)    
    let allMatches = await Match.findAll()
    let auxMatches=[]

    await allMatches.map(async(el1)=>{
      await sliceArray.map((el2)=>{
      if (el2.matchId === el1.id) auxMatches.push(el1)
    })})

    for (let g = 0; g < auxMatches.length; g++){
     let homeName = await Team.findByPk(auxMatches[g].home_team_id,{
      attributes: ['name']
     }) 
     let awayName = await Team.findByPk(auxMatches[g].away_team_id,{
      attributes: ['name']
     })
     auxMatches[g] = {
      matchData: auxMatches[g],
      homeName: homeName,
      awayName: awayName 
    }   
    }

    res.status(200).send(auxMatches)
  }
  catch (error) {
    next(error)
  }  
}); 


module.exports = router;
