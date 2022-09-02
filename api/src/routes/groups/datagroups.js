const { Group, Team } = require('../../db')


async function dataGroups() {

  const getGroupsDB = await Group.findAll({
    attributes: ['name', 'id']
  })

  if(getGroupsDB.length === 0){
    const data = ['grupo_A', 'grupo_B', 'grupo_C', 'grupo_D', 'grupo_E', 'grupo_F', 'grupo_G', 'grupo_H']

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
