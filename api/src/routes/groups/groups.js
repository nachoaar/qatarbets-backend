const { Router }=require('express');
const { dataGroups, groupID } = require('./datagroups')
const { Group, Team, Match } = require('../../db.js');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const groups = await dataGroups();
    res.status(200).send(groups);
  } catch (error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const group = await groupID(id);
    res.status(200).send(group);
  } catch (error) {
    next(error)
  }
})

router.put('/team/:groupId', async (req, res, next) => {
  const { groupId } = req.params;
  const { teamId } = req.query;
  try {
    let team = await Team.findByPk(teamId); 
    let group = await Group.findByPk(groupId);
    group.addTeam(team);
    res.send("Listorchi")
  } catch (error) {
    next(error);
  }
})

router.put('/match/:groupId', async (req, res, next) => {
  const { groupId } = req.params;
  const { matchId } = req.query;
  try {
    let match = await Match.findByPk(matchId); 
    let group = await Group.findByPk(groupId);
    group.addMatch(match);
    res.send("Listorchi")
  } catch (error) {
    next(error);
  }
})

module.exports = router;
