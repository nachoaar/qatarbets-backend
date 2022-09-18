const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const router = Router();
const { User } = require('../../db');
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const { createTokens, validateToken } = require("../tokenController.js");
const { response, path } = require("../validate/validate");
const { resolveContent } = require("nodemailer/lib/shared");
const { TOKEN_SECRET } = process.env;

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


transporter.verify().then(() => {
  console.log("Listo para enviar emails");
});

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader
//   if(token === null) return res.json("No tiene autorización")
//   jwt.verify(token, TOKEN_KEY, (err, email) => {
//     if(err) return res.json('token invalido');
//     console.log(email)
//     req.email = email
//     next();
//   })
// }

// router.get('/userSessionInfo', verifyToken ,async (req, res, next) => {
//   console.log( 'este es el token ' +)
//   if(verifyToken) {
//     const userinfo = await User.findOne({where : { onlineToken : }});
//     return res.json(userinfo)
//   }
//   else return res.json('no se encontro al usuario');
// })

router.get(function (req, res) {
  res.render("home");
})

router.put('/logout', async (req, res, next) => {
  const onlineToke = req.headers['online']
  try{
      const user = await User.findOne({where : { onlineToken : onlineToke }});
      const userOldToken = user.onlineToken;
      await user.update({onlineToken: "offline"}, {where: { onlineToken : userOldToken }})
      res.json('Deslogueado correctamente')
  }catch(error){
    next(error)
  }
})

router.get("/", async (req, res) => {
  res.json(await User.findAll());
});

router.get("/profile", validateToken, (req, res) => {
  res.json("profile");
});

//La ruta login con todas sus validaciones
router.post("/login", async (req, res, next) => {
  const { pass, email } = req.body;
  
  try {
    if (!pass || !email) return res.json({ error: "Complete todos los parametros"});
    const UserInfo = await User.findOne({ where: { email: email } })
    if (!UserInfo) return res.json({ error: "Combinacion de email y contraseña incorrecta" });
    const UserPass = UserInfo.pass;
    // const UserEmail = UserInfo.email;
    // const UserName = UserInfo.name;
    /* if(!await bcryptjs.compare(pass, UserPass)) return res.json('Contraseña incorrecta')
      else{
        req.session.name = UserName;
        res.send('Logueado correctamente como ' + UserName)
      } */
    bcryptjs.compare(pass, UserPass).then((match) => {
      if (match === false) {
        res.json({ error: "Combinacion de email y contraseña incorrecta" });
      } else {
        const accessToken = createTokens(UserInfo);
        res.cookie("acces_token", accessToken, {
          maxAge: 60 * 60 * 24 * 1000,
          sameSite: "none",
          secure: true,
          httpOnly: true,
        });

        res.json({
          message: 'Usuario logueado con exito!',
          avatar: UserInfo.avatar,
          name: UserInfo.name,
          rol: UserInfo.rol
        });
      }
    });
    await transporter.sendMail({
      from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
      to: email, //Receptor
      subject: "Mail Verification", //Asunto
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
              <p style="font-size: 20px; font-weight: bold;">Te has logueado correctamente!!</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Hemos registrado que te has logueado recientemente en tu cuenta de QATARBETS.</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que no hayas sido tú, puedes cambia tu contraseña tocando el siguiente botón.</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que sí hayas sido tú, puedes ignorar este correo.</p>
              <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app/userForgottenPass" class="boton">Cambia tu contraseña</a>
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
  } catch (error) {
    res.json("a" + error);
  }
});

// router.post("/login/mobile", async (req, res) => {
//   var { pass, email } = req.body;
//   email= email.toLowerCase()
//   try {
//     if (!pass || !email) return res.json({ error: "Complete todos los parametros"});
//     const UserInfo = await User.findOne({ where: { email: email } })
//     if (!UserInfo) return res.json({ error: "Combinacion de email y contraseña incorrecta" });
//     const UserPass = UserInfo.pass;
//     // const UserEmail = UserInfo.email;
//     // const UserName = UserInfo.name;
//     /* if(!await bcryptjs.compare(pass, UserPass)) return res.json('Contraseña incorrecta')
//       else{
//         req.session.name = UserName;
//         res.send('Logueado correctamente como ' + UserName)
//       } */
//     bcryptjs.compare(pass, UserPass).then((match) => {
//       if (match === false) {
//        return res.json({ error: "Combinacion de email y contraseña incorrecta" });
//       } else {
//         const accessToken = createTokens(UserInfo);
//         res.cookie("acces_token", accessToken, {
//           maxAge: 60 * 60 * 24 * 1000,
//           sameSite: "none",
//           secure: true,
//           httpOnly: true,
//         });

//         res.json({
//           message: 'Usuario logueado con exito!',
//           avatar: UserInfo.avatar,
//           name: UserInfo.name,
//           rol: UserInfo.rol
          
//         });        
//       }   
//     });

//     await transporter.sendMail({
//       from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
//       to: email, //Receptor
//       subject: "Mail Verification", //Asunto
//       html: `<!DOCTYPE html>
//       <html lang="eng">
//       <head>
//       <meta charset="utf-8"/>

//       <!-- ESTILOS -->
//       <style type="text/css">
//         body {
//           margin: 0;
//           background-color: #ececec;
//         }
//         table {
//           border-spacing: 0;
//         }
//         td {
//           padding: 0;
//         }
//         img {
//           border: 0;
//         }
//         .wrapper {
//           width: 100%;
//           table-layout: fixed;
//           background-color: #ececec;
//           padding-bottom: 5px;
//         }
//         .main {
//           background-color: #000000;
//           margin: 0 auto;
//           width: 100%;
//           max-width: 600px;
//           border-spacing: 0; 
//           font-family: sans-serif;
//           color: #171a1b;
//         }
//         .dos-columnas{
//           text-align: center;
//           font-size: 0;
//         }
//         .dos-columnas .columna{
//           width: 100%;
//           max-width: 300px;
//           display: inline-block;
//           vertical-align: top;  
//           text-align: center;
//         }
//         .boton{
//           background-color: red;
//           color: #ffffff;
//           text-decoration: none;
//           padding: 12px 20px;
//           border-radius: 5px;
//           font-weight: bold;
//         }
//       </style>   
//       </head>
//       <body>
//       <center class="wrapper">
//       <table class="main" width="100%">

//       <!-- BORDE SUPERIOR -->
//       <tr>
//          <td height="8" style="background-color: red;"></td>
//       </tr>

//       <!-- SECCION DE LOGOS -->
//       <tr>
//          <td style="padding: 14px 0 4px; background-color: rgb(96, 2, 96);">   
//              <table width="100%">

//                 <tr>
//                    <td class="dos-columnas">
                   
//                        <table class="columna">
//                           <tr>
//                              <td style="padding: 0 62px 10px;">
//                                <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app"><img src="https://i.imgur.com/cf7jqcN.png" width="250" alt="Encabezado" title="Encabezado logo"/></a>
//                              </td>
//                           </tr>   
//                        </table>

//                        <table class="columna">
//                         <tr>
//                            <td style="padding: 40px 86px;">
//                              <a style="margin-left: 5px;" href="https://www.facebook.com/QatarBetsLATAM"><img src="https://i.imgur.com/G3cmjre.png" width="27" alt="facebook" /></a>
//                              <a style="margin-left: 5px;" href="https://twitter.com/QatarBets"><img src="https://i.imgur.com/x8Fq8j4.png" width="27" alt="twitter"/></a>
//                              <a style="margin-left: 5px;" href="https://www.instagram.com/qatar_bets/"><img src="https://i.imgur.com/31bbcEa.png" width="27" alt="instagram"/></a>
//                              <a style="margin-left: 5px;" href="https://www.linkedin.com/company/qatar-bets/"><img src="https://i.imgur.com/st6Gh4d.png" width="27" alt="linkedin"/></a>
//                            </td>
//                         </tr>   
//                      </table>

//                    </td>
//                 </tr>

//              </table>
//          </td>
//       </tr>
//       <!-- MENSAJE -->
//       <tr>
//         <td style="padding: 15px 0 50px; background-color: #ffffff;"> 
//           <table style="background-color:#ffffff; width: 100%;">
//             <tr>
//               <td style="text-align: center; padding: 15px;">
//               <p style="font-size: 20px; font-weight: bold;">Te has logueado correctamente!!</p>
//               <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Hemos registrado que te has logueado recientemente en tu cuenta de QATARBETS.</p>
//               <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que no hayas sido tú, puedes cambia tu contraseña tocando el siguiente botón.</p>
//               <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que sí hayas sido tú, puedes ignorar este correo.</p>
//               <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app/userForgottenPass" class="boton">Cambia tu contraseña</a>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//       <!-- FOOTER -->
//       <tr>
//         <td style="background-color: rgb(96, 2, 96);">
//           <table>

//             <tr>
//               <td style="text-align: center; padding: 45px 20px; color: #ffffff;">
//                 <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app">
//                   <img src="https://i.imgur.com/oudfmJO.png" alt="logo" width="50"/> <a style="margin-left: 60px; color: #ffffff;">Todos los derechos reservados © 2022 QATARBETS</a>
//                 </a>
//               </td>
//             </tr>

//           </table>
//         </td>
//       </tr>
//       <tr>
//         <td style="background-color: #ececec">
//           <table>
//             <tr>
//               <td style="text-align: left; margin-top: 10px;">
//                 <p style="margin-top: 10px; color: #8d8d8d; font-size: 13px;">QATARBETS, Inc.</p>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       </table>
//       </center>
//       </body>
//       </html>`,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/login/mobile", async (req, res) => {
  var { pass, email } = req.body;
  email= email.toLowerCase()
  try {
    if (!pass || !email) return res.json({ error: "Complete todos los parametros"});
    const UserInfo = await User.findOne({ where: { email: email } })
    if (!UserInfo) return res.json({ error: "Combinacion de email y contraseña incorrecta" });
    const UserPass = UserInfo.pass;
    // const UserEmail = UserInfo.email;
    // const UserName = UserInfo.name;
    /* if(!await bcryptjs.compare(pass, UserPass)) return res.json('Contraseña incorrecta')
      else{
        req.session.name = UserName;
        res.send('Logueado correctamente como ' + UserName)
      } */
    bcryptjs.compare(pass, UserPass).then((match) => {
      if (match === false) {
        return res.json({ error: "Combinacion de email y contraseña incorrecta" });
      } else {
        const accessToken = createTokens(UserInfo);

        // res.cookie("acces_token", accessToken, {
        //   maxAge: 60 * 60 * 24 * 1000,
        //   sameSite: "none",
        //   secure: true,
        //   httpOnly: true,
        // });
        if (UserInfo.rol === "admin"){
        res.json({
          avatar: UserInfo.avatar,
          name: UserInfo.name,
          token: accessToken,
          rol: UserInfo.rol
          
        });

      } else {
        res.json({
          error: "Usuario no admitido",
        });
      }
      }
      

    });
    await transporter.sendMail({
      from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
      to: email, //Receptor
      subject: "Mail Verification", //Asunto
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
              <p style="font-size: 20px; font-weight: bold;">Te has logueado correctamente!!</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Hemos registrado que te has logueado recientemente en tu cuenta de QATARBETS.</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que no hayas sido tú, puedes cambia tu contraseña tocando el siguiente botón.</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que sí hayas sido tú, puedes ignorar este correo.</p>
              <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app/userForgottenPass" class="boton">Cambia tu contraseña</a>
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
  } catch (error) {
    res.json("a" + error);
  }
});

//ruta register con las validaciones y relaciones
router.post("/register", async (req, res, next) => {
  const { name, age, pass, email, avatar, rol } = req.body;
  try {
    //valiaciones del register para que hayan datos
    if (!name) return res.json("Se requiere un nombre!");
    if (!pass) return res.json("Se requiere una contraseña!");
    if (!email) return res.json("Se requiere un mail!");
    if (!age) return res.json("Se requiere una edad!");
    if (isNaN(Number(age))) return res.json("La edad debe ser un número!");
    if (age < 18) return res.json("Se debe ser mayor de edad!");
    if (pass.length < 8)
      return res.json("La contraseña tiene que tener un minimo de 8 caracteres!");

    //validacion para que no se repitan datos en db
    const EmailVal = await User.findOne({ where: { email: email } });
    if (EmailVal) return res.json("El mail ya existe!");

    //hago una variable llamada passwordHash la cual me encripta la pass
    let passwordHash = await bcryptjs.hash(pass, 8);

   //validacion de si existen los datos, que cree al usuario
  if(name && pass && email){
    //defino la variable que me va a crear al usuario
    let usuario = await User.create({
      name: name,
      age: age,
      pass: passwordHash,
      email: email,
      avatar: avatar,
      rol: rol,
    })

    const EmailVerify = jwt.sign({email: email, name: name }, `${TOKEN_SECRET}`, {
      expiresIn: '1h',
    })

    //Hago en envío del mail de verificación
    await transporter.sendMail({
      from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
      to: email, //Receptor
      subject: "Mail Verification", //Asunto
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
              <p style="font-size: 20px; font-weight: bold;">Bienvenido ${name} a QATARBETS!!</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Ya se ha registrado correctamente en QATARBETS, solo le queda cumplir un último paso para completar su registro.</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Para que pueda acceder a todos nuestros servicios es necesario que verifique su cuenta:</p>
              <a href="https://qatarbets-backend-production-ab54.up.railway.app/verify/${EmailVerify}" class="boton">Verifique su cuenta aquí</a>
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

    res.json('Usuario registrado, confirme su cuenta en el email enviado');
  }} catch(error){next(error)}
})


router.get("/userId", async (req, res, next) => {
  const token = validateToken(req.cookies.acces_token || "");
  if (token === "") {
    res.json("Usuario invalido");
  }

  try {
    let U = await User.findAll({
      where: {
        id: token.id,
      },
    });

    res.status(200).send(U);
  } catch (error) {
    next(error);
  }
}); 

router.get("/userId/:userId", async (req, res, next) => {
  const { userId } = req.params

  try {
    let U = await User.findAll({
      where: {
        id: userId,
      },
    });

    res.status(200).send(U);
  } catch (error) {
    next(error);
  }
});

router.post('/userForgottenPass', async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) res.json("the email is required");
    const EmailVal = await User.findOne({ where: { email: email } });
    if (!EmailVal) res.json("nonexistent email");

    const token = jwt.sign({email: EmailVal.email}, `${TOKEN_SECRET}`, {
      expiresIn: '15m',
    })

    //Envio del mail para recuperacion de contraseña
    await transporter.sendMail({
      from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
      to: email, //Receptor
      subject: "Forgotten Password", //Asunto
      html: await transporter.sendMail({
        from: '"QatarBets" <QatarBets2022@gmail.com>', //Emisor
        to: email, //Receptor
        subject: "Mail Verification", //Asunto
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
                <p style="font-size: 20px; font-weight: bold;">¿Has olvidado tu contraseña?</p>
                <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Nos ha llegado una solicitud de cambio de contraseña. De ser así por favor haga click en el siguiente boton</p>
                <a href="" class="boton">Cambia tu contraseña</a>
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
      }), 
    });
    res.json(`Mail de recuperacion enviado a ${email}`);
  } catch (error) {
    next(error);
  }
});

// router.get('/aCasaUser', async (req, res, next) => {
//   const { email } = req.body;

//   if(!email) res.json('A quién queres matar genocida');

//     const user = User.findOne({where: { email: email }});

//     if(!user) res.json('No se encontró a la victima')

//     await user.update({userbanned: true}, { where: { userbanned : false } });

//     res.json('LE DIERON AL MONOOO')
// });

// router.post('/newPass', async (req, res, next) => {
//   const { newPass } = req.body;
//   const resetToken = req.headers['reset']
//   try{
//   if(!resetToken || !newPass){
//     res.json('Completa todos los campos')
//   }
//   if (newPass.length < 8) return res.json("the password must have a minimun of 8 characters");
//   const jwtPayload = jwt.verify(resetToken, 'Toketoke');
//   const user = await User.findOne({where: { resetToken: resetToken }})
//   const UserOldPass = user.pass
//   let passwordHash = await bcryptjs.hash(newPass, 8);
//   await user.update({pass: passwordHash }, {where: { pass : UserOldPass }});
//   await user.update({resetToken: null}, {where: { resetToken : resetToken }});
//   res.json('contraseña cambiada corrrectamente')

// } catch (error) {
//   res.json(error)
// }
// });

module.exports = router;
