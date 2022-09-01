const { Router } = require('express');
const express = require('express');
const router = Router();
const fixtureRoute = require('./wcFixtures/wcFixtures.js');
const groups = require('./groups/groups.js')

router.use(express.json());


router.use('/fixture', fixtureRoute);
router.use('/groups', groups)

module.exports = router;
