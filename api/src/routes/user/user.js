const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const router = Router();
const { User, HisBets, Bet } = require('../../db');

router.get('/', async (req, res) => {
  res.json(await User.findAll())
})

 //La ruta login con todas sus validaciones
router.post('/login', async (req, res) => {
  const {pass, email} = req.body;
  try{
      if(!pass || !email) return res.json('Complete todos los parametros')
      const UserInfo = await User.findOne({ where: { email: email} });
      const UserEmail = UserInfo.email;
      const UserPass = UserInfo.pass;
      const UserName = UserInfo.name;
      if(!UserEmail) return res.json('Cuenta con email inexistente');
      if(!await bcryptjs.compare(pass, UserPass)) return res.json('Contraseña incorrecta')
      else{
        req.session.name = UserName;
        res.send('Logueado correctamente como ' + UserName)
      }
  }catch(error){res.json('a' + error)}
})

//ruta register con las validaciones y relaciones
router.post('/register', async (req, res, next) => {
  const { name, age, pass, email, avatar, rol} = req.body;
  try{
   //valiaciones del register para que hayan datos
  if (!name) return res.json("the name is required" );
  if(!pass) return res.json("the password is required" );
  if(!email) return res.json("the email is required");
  if(!age) return res.json("the age is required");
  if(age < 18) return res.json("Minors not allowed");
  if (pass.length < 8) return res.json("the password must have a minimun of 8 characters");
   //validacion para que no se repitan datos en db
  const NameVal = await User.findOne({ where: { name: name } });
  if(NameVal) return res.json('existing username and email')
  const EmailVal = await User.findOne({ where: { email: email} });
  if(EmailVal) return res.json('existing username and email')
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
    //defino Bet
    // const UserBets = await HisBets.findOrCreate({ where : {id_user: name}})
    //creo al usuario :D
    // await usuario.addHisBets(UserBets);
    await usuario
    res.json({
      key: passwordHash,
      message: `user created successfully, go to email ${email} for verification`
    })
  }} catch(error){next(error)}
})

module.exports = router;
