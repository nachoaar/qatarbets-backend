const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const router = Router();
const { User, HisBets } = require('../../db');

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
    //defino Bet
    const UserBets = await HisBets.findOrCreate({ where : {id_user: name}})
    //creo al usuario :D
    await usuario.addHisBets(UserBets);
    res.json('Usuario creado correctamente')
    console.log(usuario)
   }} catch(error){res.send(error)}
})

module.exports = router;