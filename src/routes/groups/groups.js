const { Router }=require('express');
const { dataGroups, groupID } = require('./datagroups')


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

module.exports = router;
