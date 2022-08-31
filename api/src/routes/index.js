const { Router } = require('express');

const router = Router();

const AllTeams = require('./worldCupTeams/worldCupTeams.js');
const SquadTeams = require('./worldCupTeams/worldCupTeams.js');

router.use('/api/allTeams/Wc', AllTeams);
router.use('/api/squadTeams/Wc', SquadTeams);

module.exports = router;