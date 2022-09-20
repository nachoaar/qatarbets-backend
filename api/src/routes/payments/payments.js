require("dotenv").config();
const {Router} = require('express');
const Stripe = require('stripe');
const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);
const nodemailer = require('nodemailer');
const { validateToken } = require("../tokenController");
const { Match, Team } = require("../../db.js");

const router = Router();

const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'QatarBets2022@gmail.com', // generated ethereal user
        pass: 'pcuclpxdckaayvbw', // generated ethereal password
      },
    });

router.post('/', async (req, res, next) => {

  const { id, amount, matchId } = req.body;
  const token = validateToken(req.cookies.acces_token || '');
  if (token === '') {
    res.json('Usuario invalido');
  }
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "BET",
      payment_method: id,
      confirm: true,
    });

    /* await transporter.sendMail({
      from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
      to: token.email, //Receptor
      subject: "Mail Verification", //Asunto
      html: `<b>Has realizado una apuesta de ${amount/100}</b>`, //Texto del mail
    }); */
    
    let partidoId = matchId;

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
              <p style="font-size: 20px; font-weight: bold;">Has realizado correctamente la apuesta al partido de ${localName} VS ${visitanteName}</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Felicidades, has realizado con éxito la apuesta en el partido de ${localName} VS ${visitanteName} que se realizará el día ${partido.date}</p>
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
    });
    
    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
})

module.exports = router;