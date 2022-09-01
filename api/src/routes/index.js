const { Router } = require('express');
const express = require('express');
const PostBet = require('./bet/bet.js');
const getDates = require('./wcFixtures/wcFixtures')
const getTeams= require('./worldCupTeams/worldCupTeams')
const groups = require('./groups/groups.js')

const router = Router();
router.use(express.json());

router.use('/bet', PostBet);
router.use('/fixture', getDates)
router.use('/teams', getTeams)
router.use('/groups', groups)

module.exports = router;
