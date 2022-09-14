const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const router = Router();
const { User } = require('../../db');
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const { createTokens, validateToken } = require("../tokenController.js");
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
  // habilitar la siguiente linea de codigo para que funcione el back en local host

  /*   tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
 },  */
});


transporter.verify().then(() => {
  console.log("Listo para enviar emails");
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader
  if(token === null) return res.json("No tiene autorización")
  jwt.verify(token, TOKEN_KEY, (err, email) => {
    if(err) return res.json('token invalido');
    console.log(email)
    req.email = email
    next();
  })
}

// router.get('/userSessionInfo', verifyToken ,async (req, res, next) => {
//   console.log( 'este es el token ' +)
//   if(verifyToken) {
//     const userinfo = await User.findOne({where : { onlineToken : }});
//     return res.json(userinfo)
//   }
//   else return res.json('no se encontro al usuario');
// })

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
router.post("/login", async (req, res) => {
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
          avatar: UserInfo.avatar,
          name: UserInfo.name,
        });
      }
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
      html: `<b>Verify your email in this </b>
      <a href=' https://qatarbets-backend-production-ab54.up.railway.app/validate/verify/${EmailVerify}'>link</a>`, //Texto del mail
    });
    const token = jwt.sign({id: usuario.id}, TOKEN_KEY, {
      expiresIn: '24h',
    })
    res.json({
      key: passwordHash,
      message: `user created successfully, go to email ${email} for verification`
    })
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
      html: `<b>Go to this link to get a new password</b>
      <a href=" https://qatarbets-backend-production-ab54.up.railway.app/validate/changePass/${token}">Change your password</a>` //Texto del mail
    });
    res.json(`Mail de recuperacion enviado a ${email}`);
  } catch (error) {
    next(error);
  }
});

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
