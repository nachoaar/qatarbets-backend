

require('dotenv').config();
const { Router } = require('express');

const { HisBets} = require('../../db.js');

const router = Router();

/* router.post('/allHisBets', async (req, res, next) => {    // el next esta para que luego se vaya al siguiente middleware, que es el control de errores que esta en app
    try {
        var { id_user, id_bet } = req.body;

        let newHisBet = await HisBets.findOrCreate({
            where: {
                id_user,   // ver validacion del date en el front (evaluar usar new Date en el handleSubmit)
                id_bet,
            }
        })

        res.status(201).send(newHisBet)

    } catch (error) {
        next(error)
    }
}) */

router.get('/allHisBets', async (req, res, next) => {

    try {
      let A = await HisBets.findAll()
  
      res.status(200).send(A)
    }
    catch (error) {
      next(error)
    }
  });

  router.get('/allHisBets/:id', async (req, res, next) => {

    const id = req.params.id;
  
    try {
      let B = await HisBets.findAll({
        where: {
          id: id
        }
      });
  
      res.status(200).send(B)
    }
    catch (error) {
      next(error)
    }
  });

module.exports = router;

