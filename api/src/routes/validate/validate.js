const express = require('express');
const { destroyToken } = require('../tokenController');

const router = express()

router.get('/', (req, res, next) => {
  try {
    const token = req.cookies.acces_token || '';
    if (token) {
      res.json('todo bien aca')
    }else {
      res.json('todo mal aca')
    }
  } catch (error) {
    res.json('sigue todo mal')
  }
})

router.get('/logout', (req, res, next) => {
  try {
    res.cookie('acces_token', '', {
      maxAge: 1,
      httpOnly: true,
    });
    res.send('Listo')
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router;