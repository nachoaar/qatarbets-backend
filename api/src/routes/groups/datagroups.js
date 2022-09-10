const { Group, Team } = require('../../db')


async function dataGroups() {

  const getGroupsDB = await Group.findAll({
    attributes: ['name', 'id']
  })

  if(getGroupsDB.length === 0){
    //const data = ['grupo_A', 'grupo_B', 'grupo_C', 'grupo_D', 'grupo_E', 'grupo_F', 'grupo_G', 'grupo_H']
    const data = [
      { id: 1, name: 'grupo_A' },
      { id: 2, name: 'grupo_B' },
      { id: 3, name: 'grupo_C' },
      { id: 4, name: 'grupo_D' },
      { id: 5, name: 'grupo_E' },
      { id: 6, name: 'grupo_F' },
      { id: 7, name: 'grupo_G' },
      { id: 8, name: 'grupo_H' },
    ]

  const createDbGroup =  data.forEach( async (group) => {
    await Group.findOrCreate({
    where: {
      id: group.id,
      name: group.name
    }
  })
});
  }

  const getGroupsTeamDB = await Group.findAll({
    order : [
      ['id', 'ASC']
    ],
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
