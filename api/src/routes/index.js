const { Router } = require('express');
const router = Router();


const AllTeams = require('./worldCupTeams/worldCupTeams.js');
const fixtureRoute = require('./wcFixtures/wcFixtures.js');

router.use('/Teams&Squads', AllTeams);
router.use('/fixture', fixtureRoute);


module.exports = router;