const { Router } = require('express');
const router = Router();


const AllTeams = require('./worldCupTeams/worldCupTeams.js');
const fixtureRoute = require('./wcFixtures/wcFixtures.js');
const hisBetsRoute = require('./hisBets/hisBets.js');

router.use('/Teams&Squads', AllTeams);
router.use('/fixture', fixtureRoute);
router.use('/hisBets', hisBetsRoute);


module.exports = router;