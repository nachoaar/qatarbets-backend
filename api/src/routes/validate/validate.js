const express = require('express');

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

module.exports = router;