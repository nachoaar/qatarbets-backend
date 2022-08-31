const { Router } = require('express');
const router = Router();

const fixtureRoute = require('./wcFixtures/wcFixtures.js');

router.use('/fixture', fixtureRoute);

module.exports = router;