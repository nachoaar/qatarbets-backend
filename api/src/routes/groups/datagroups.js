const { Group, Team } = require('../../db')


async function dataGroups() {

  const getGroupsDB = await Group.findAll({
    attributes: ['name', 'id']
  })

  if(getGroupsDB.length === 0){
    const data = ['groupo_A', 'groupo_B', 'groupo_C', 'groupo_D', 'groupo_E', 'groupo_F', 'groupo_G', 'groupo_H']

  const createDbGroup =  data.forEach( async (group) => {
    await Group.findOrCreate({
    where: {
      name: group
    }
  })
});
  }

  const getGroupsTeamDB = await Group.findAll({
    include: {
      model: Team,
      attributes: ['name', 'logo']
    }
  })
return getGroupsTeamDB
}

async function groupID(id){
  if(id){
    await dataGroups();
    const group = await Group.findByPk(id, {
      include: {
        model: Team,
        attributes: ['name', 'logo']
      }
    })
    return group.dataValues
  }
  return dataGroups();
}

module.exports = {
  dataGroups,
  groupID
}
