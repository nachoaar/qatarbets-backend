const nodemailer = require("nodemailer");

var identifyMail= async function (finalProfit, betResult, matchHome, matchAway) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: "QatarBets2022@gmail.com",
          pass: "pcuclpxdckaayvbw", 
        },  
      });

    let response = await transporter.sendMail({
        from: '"QatarBets" <QatarBets2022@gmail.com>',
        to: email, 
        subject: "QATARBETS login",
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
                <p style="font-size: 20px; font-weight: bold;">Este es el resultado de tu apuesta!!</p>
                <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">El resultado de tu apuesta del partido de ${matchHome} VS ${matchAway} es ${betResult} y el monto resultante es: ${finalProfit}</p>
                <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app" class="boton">Siga apostando en nuestro sitio web</a>
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

    return response
}


module.exports = {
    identifyMail
};