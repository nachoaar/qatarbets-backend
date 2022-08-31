const { Router } = require('express');

const router = Router();

const PostBet = require('./bet/bet.js');

router.use('/bet', PostBet);



module.exports = router;