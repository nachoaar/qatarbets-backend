const { Router } = require('express');

const router = Router();

const AllTeams = require('./worldCupTeams/worldCupTeams.js');


router.use('/Teams&Squads', AllTeams);



module.exports = router;