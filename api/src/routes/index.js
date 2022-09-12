const { Router } = require('express');
const express = require('express');
const PostBet = require('./bet/bet.js');
const getDates = require('./wcFixtures/wcFixtures')
const getTeams= require('./worldCupTeams/worldCupTeams')
const groups = require('./groups/groups.js')
const hisBetsRoute = require('./hisBets/hisBets.js');
const UserConfig= require('./user/user');
const paymentRoute = require('./payments/payments');
const validateRoute = require('./validate/validate.js')

const router = Router();
router.use(express.json());

router.use('/bet', PostBet);
router.use('/hisBets', hisBetsRoute);
router.use('/fixture', getDates);
router.use('/teams', getTeams);
router.use('/groups', groups);
router.use('/user', UserConfig);
router.use('/pay', paymentRoute)
router.use('/validate', validateRoute);
module.exports = router;
