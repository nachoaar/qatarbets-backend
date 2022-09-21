const express = require('express');
const { validateToken } = require('../tokenController');
const { User } = require('../../db');
const bcryptjs = require('bcryptjs');

const router = express();

router.get("/", (req, res, next) => {
  try {
    const token = req.cookies.acces_token || "";
    if (token) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/rol", (req, res, next) => {
  const token = validateToken(req.cookies.acces_token || "");
  if (token === "") {
    res.json("Usuario invalido");
  }
  try {
    if (token.rol === "admin") {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/logout", (req, res, next) => {
  try {
    res.cookie("acces_token", "", {
      maxAge: 1,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    res.send("Listo");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/verify/:token', async (req, res, next) => {
  const { token } = req.params;
  try{
    const datos = validateToken(token)
    if(datos === null){
      return res.json('Token invalido o inexistente')
    }
    const { email } = datos;

    const user = await User.findOne({
      where: {
        email: email
      }
    }) || null;

    if(user === null){
      return res.json('Usuario inexistente')
    }
    
    await user.update({emailvalidate: true}, { where: { emailvalidate : false} });

    res.json('Estas validado pa')
    

  } catch(error) {
    next(error)
  }
})

router.post('/changePass/:token', async (req, res, next) => {
  const { token } = req.params;
  const { newPass } = req.body;
  try{
    if(!newPass){
      res.json('Ingrese su nueva contraseña')
      console.log(newPass)
    }


    const datos = await validateToken(token)
    if(datos === null){
      return res.json('Token invalido o inexistente')
    }
    const { email } = datos;
    
    const user = await User.findOne({where: { email: email }})
    const UserOldPass = user.pass
    let passwordHash = await bcryptjs.hash(newPass, 8);
    await user.update({pass: passwordHash }, {where: { pass : UserOldPass }});

    res.json('contraseña cambiada corrrectamente')  

  } catch(error) {
    next(error)
  }
})


module.exports = router;
