const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const router = Router();
const jwt = require("jsonwebtoken");
const { User, HisBets, Bet } = require('../../db');
const config = require('./authConfig')
const controller = require("./userControler")
const authJwt = require("./middleware")

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/all", controller.allAccess);

router.get("/gambler",
  [authJwt.verifyToken],
  controller.userBoard
);

router.get("/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);


router.get('/', async (req, res) => {
  res.json(await User.findAll())
})

 //La ruta login con todas sus validaciones
router.post('/login', async (req, res) => {
  const {pass, email} = req.body;
  try{
      if(!pass || !email) return res.json({message:'Complete todos los parametros'})
      const UserInfo = await User.findOne({ where: { email: email} });
      const UserEmail = UserInfo.email;
      const UserPass = UserInfo.pass;
      const UserName = UserInfo.name;
      if(!UserEmail) return res.json({message:'Cuenta con email inexistente'});
      if(!await bcryptjs.compare(pass, UserPass)) return res.json({accessToken: null, message:'Contraseña incorrecta'})
      else{
        var token = jwt.sign({ id: UserInfo.id }, config.secret, {
          expiresIn: 86400
        })
        res.status(200).send({
          id: UserInfo.id,
          username: UserInfo.email,
          rol: UserInfo.rol,
          accessToken: token
        })
      }
  }catch(error){res.json('a' + error)}
})



//ruta register con las validaciones y relaciones
router.post('/register', async (req, res, next) => {
  const { name, age, pass, email, avatar, rol} = req.body;
  try{
   //valiaciones del register para que hayan datos
  if (!name) return res.json({message:"el nombre es requerido"});
  if(!pass) return res.json({message:"la contraseña es requerida"});
  if(!email) return res.json({message: "el correo es rquerido"});
  if(!age) return res.json({message: "la edad es requerida"});
  if(age < 18) return res.json({message:"No se permiten menores de edad"});
  if (pass.length < 8) return res.json({message:"la contraseña debe tener un mínimo de 8 caracteres"});
   //validacion para que no se repitan datos en db
  const NameVal = await User.findOne({ where: { name: name } });
  if(NameVal) return res.json({message:'correo y nombre invalidos'})
  const EmailVal = await User.findOne({ where: { email: email} });
  if(EmailVal) return res.json({message:'correo y nombre invalidos'})
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
      message: `usuario creado con exito`
    })
  }} catch(error){next(error)}
})

router.get('/userId/:id', async (req, res, next) => {

  let idUser = req.params.id;

  try {
    let U = await User.findAll({
      where: {
        id: idUser
      }
    });

    res.status(200).send(U)
  }
  catch (error) {
    next(error)
  }
});

module.exports = router;
