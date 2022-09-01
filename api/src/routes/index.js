const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const router = Router();
const { User } = require('../db');
const { restart } = require('nodemon');

router.get('/', async (req, res) => {
    res.json(await User.findAll())
 })

// router.post('/login', async (req, res) => {
//     try{
//     const {name, pass, email} = req.body;
//     let passwordHash = await bcryptjs.hash(pass, 8);

//     const NameVal = await User.findOne({ where: { name: name } });
//     if(!NameVal) return res.json('No existe una cuenta con ese nombre de usuario')
//     const EmailVal = await User.findOne({ where: { email: email} });
//     if(!EmailVal) return res.json('No existe una cuenta con ese mail')
//     const PassVal = await User.findOne({ where: {pass: pass} })
//     if(!await bcryptjs.compare(pass, PassVal)) res.json('La contraseña es incorrecta')
//     if(NameVal && EmailVal && PassVal) {
//         res.json('Usuario conectado correctamente');
//     }

//    } catch(error){res.json(error)}
//  })

router.post('/register', async (req, res) => {
   const { name, pass, email, avatar, rol} = req.body;
   try{
   //hago una variable llamada passwordHash la cual me encripta la pass
   let passwordHash = await bcryptjs.hash(pass, 8);
   
   //valiaciones del register para que hayan datos 
   if (!name) return res.json("El nombre es obligatorio" );
   if(!pass) return res.json("La contraseña es obligatoria" );
   if(!email) return res.json("El email es obligatorio");
   if (pass.length < 8) return res.json("La contraseña debe tener 8 caracteres como minimo");
   //validacion para que no se repitan datos en db 
   const NameVal = await User.findOne({ where: { name: name } });
   if(NameVal) return res.json('Ya existe ese nombre de usuario')
   const EmailVal = await User.findOne({ where: { email: email} });
   if(EmailVal) return res.json('Ya existe una cuenta con ese mail')
   //validacion de si existen los datos, que cree al usuario
   if(name && pass && email){
    //defino la variable que me va a crear al usuario
    let usuario = await User.create({
        name: name,
        pass: passwordHash,
        email: email,
        avatar: avatar,
        rol: rol,
    })
    //creo al usuario :D
    await usuario;
    res.json('Usuario creado correctamente')
    console.log(usuario)
   }} catch(error){res.send(error)}
})


module.exports = router;