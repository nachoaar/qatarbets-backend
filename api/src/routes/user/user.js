const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const router = Router();
const { User } = require("../../db");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const { createTokens, validateToken } = require("../tokenController.js");
const { response, path } = require("../validate/validate");
const { resolveContent } = require("nodemailer/lib/shared");
const { TOKEN_SECRET } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: "QatarBets2022@gmail.com", 
    pass: "pcuclpxdckaayvbw", 
  },
});

transporter.verify().then(() => {
  console.log("Listo para enviar emails");
});

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
});

router.get("/", async (req, res) => {
  res.json(await User.findAll());
});

router.get("/profile", validateToken, (req, res) => {
  res.json("profile");
});

router.post("/login", async (req, res, next) => {
  const { pass, email } = req.body;

  try {
    if (!pass || !email)
      return res.json({ error: "Complete todos los parametros" });
    const UserInfo = await User.findOne({ where: { email: email } });
    if (!UserInfo)
      return res.json({
        error: "Combinacion de email y contraseña incorrecta",
      });
    const UserPass = UserInfo.pass;
    if (UserInfo.emailvalidate === false) {
      return res.json({ error: "El usuario no esta validado!" });
    }
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
          message: "Usuario logueado con exito!",
          avatar: UserInfo.avatar,
          name: UserInfo.name,
          rol: UserInfo.rol,
        });
      }
    });
    await transporter.sendMail({
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
              <p style="font-size: 20px; font-weight: bold;">Te has logueado correctamente!!</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">Hemos registrado que te has logueado recientemente en tu cuenta de QATARBETS.</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que no hayas sido tú, puedes ponerte en contacto con nosotros.</p>
              <p style="line-height: 23px; font-size: 15px; padding: 5px 0 15px;">En caso de que sí hayas sido tú, puedes ignorar este correo.</p>
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

router.post("/login/mobile", async (req, res) => {
  var { pass, email } = req.body;
  email = email.toLowerCase();
  try {
    if (!pass || !email)
      return res.json({ error: "Complete todos los parametros" });
    const UserInfo = await User.findOne({ where: { email: email } });
    if (!UserInfo)
      return res.json({
        error: "Combinacion de email y contraseña incorrecta",
      });
    const UserPass = UserInfo.pass;
    bcryptjs.compare(pass, UserPass).then((match) => {
      if (match === false) {
        return res.json({
          error: "Combinacion de email y contraseña incorrecta",
        });
      } else {
        const accessToken = createTokens(UserInfo);
        if (UserInfo.rol === "admin") {
          res.json({
            avatar: UserInfo.avatar,
            name: UserInfo.name,
            token: accessToken,
            rol: UserInfo.rol,
          });
        } else {
          res.json({
            error: "Usuario no admitido",
          });
        }
      }
    });
  } catch (error) {
    res.json("a" + error);
  }
});

router.post("/register", async (req, res, next) => {
  const { name, age, pass, email, avatar, rol, emailvalidate } = req.body;
  try {
    if (!name) return res.json("Se requiere un nombre!");
    if (!pass) return res.json("Se requiere una contraseña!");
    if (!email) return res.json("Se requiere un mail!");
    if (!age) return res.json("Se requiere una edad!");
    if (isNaN(Number(age))) return res.json("La edad debe ser un número!");
    if (age < 18) return res.json("Se debe ser mayor de edad!");
    if (pass.length < 8)
      return res.json(
        "La contraseña tiene que tener un minimo de 8 caracteres!"
      );
    const EmailVal = await User.findOne({ where: { email: email } });
    if (EmailVal) return res.json("El mail ya existe!");


    let passwordHash = await bcryptjs.hash(pass, 8);

    if (name && pass && email) {
      let usuario = await User.create({
        name: name,
        age: age,
        pass: passwordHash,
        email: email,
        avatar: avatar,
        rol: rol,
        emailvalidate: emailvalidate,
      });

      if (!emailvalidate) {
        const EmailVerify = jwt.sign(
          { email: email, name: name },
          `${TOKEN_SECRET}`,
          {
            expiresIn: "1h",
          }
        );
        await transporter.sendMail({
          from: '"QatarBets" <QatarBets2022@gmail.com>', 
          to: email, 
          subject: "Mail Verification", 
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
              <a href="https://qatarbets-frontend-git-develop-nachoaar.vercel.app/userVerify/${EmailVerify}" class="boton">Verifique su cuenta aquí</a>
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

        return res.json(
          "Usuario registrado, confirme su cuenta en el email enviado"
        );
      }
      res.json("Usuario registrado")
    }
  } catch (error) {
    next(error);
  }
});

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
  const { userId } = req.params;

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

router.post("/userForgottenPass", async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) res.json("the email is required");
    const EmailVal = await User.findOne({ where: { email: email } });
    if (!EmailVal) res.json("nonexistent email");

    const token = jwt.sign({ email: EmailVal.email }, `${TOKEN_SECRET}`, {
      expiresIn: "15m",
    });

    await transporter.sendMail({
        from: '"QatarBets" <QatarBets2022@gmail.com>',
        to: email, 
        subject: "Contraseña olvidada",
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
                <a href="http://localhost:3000/passChange/${token}" class="boton">Cambia tu contraseña</a>
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
    res.json(`Mail de recuperacion enviado a ${email}`);
  } catch (error) {
    next(error);
  }
});

router.put('/changeAvatar', async (req, res, next) => {

  let newLink = req.query.avatarLink;
  let id = req.query.userId;
  
  try {
    

     await User.update({
      avatar: newLink,
    },
      {
        where: {
          id: id,
        }
      });

      setTimeout(async function () {
      let newAvatar = await User.findByPk(id) 
    res.status(200).send(newAvatar)
  }, 500);
  }
  catch (error) {
    next(error)
  }
});

router.put('/changeUserName', async (req, res, next) => {

  let newNameDb = req.query.newName;
  let id = req.query.userId;
  
  try {
    

     await User.update({
      name: newNameDb,
    },
      {
        where: {
          id: id,
        }
      });

      setTimeout(async function () {
      let newName = await User.findByPk(id) 
    res.status(200).send(newName)
  }, 500);
  }
  catch (error) {
    next(error)
  }
});

 

module.exports = router;
