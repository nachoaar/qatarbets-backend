const { Router } = require('express');

const router = Router();

const PostBet = require('./bet/bet.js');
const getDates = require('./wcFixtures/wcFixtures')
const getTeams= require('./worldCupTeams/worldCupTeams')
const getHistory = require('./hisBets/hisBets')

router.use('/bet', PostBet);
router.use('/fixture', getDates) 
router.use('/teams', getTeams)
router.use('/history', getHistory)


module.exports = router;