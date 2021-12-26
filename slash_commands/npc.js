module.exports = async(interaction, options, cdclient) => {
  return new Promise(async(resolve, reject) => {

    const NPC = require('./../classes/NPC')
    let npc = new NPC()
    let id = 13569
    await npc.create(cdclient, id)


    resolve()
  })
}