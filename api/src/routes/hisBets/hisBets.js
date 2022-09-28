
require('dotenv').config();
const { Router } = require('express');

const { HisBets} = require('../../db.js');

const router = Router();

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
