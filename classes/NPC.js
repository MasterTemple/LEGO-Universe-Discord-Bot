/*
NPC {
  id;
  localeName;
  sqlName;
  sqlDisplayName;
  location; // use zaops thing
  missions [
    {
      id;
      name;
      description;
      repeatable;
      rewards [
        {
          id;
          name;
          count;
        }
      ]
    }
  ]
  sells [
    {
      id;
      localeName;
      cost;
    }
  ]

  // ai {
  //   health;
  //   attacks;
  // }
}

render component?
ai stuff?
location?
*/

class NPC {
  constructor(){

  }
  async create(cdclient, id){
    return new Promise(async(resolve, reject) => {
      this.cdclient = cdclient;
      this.id = id;
      this.components = await this.cdclient.getComponents(this.id);
      this.names = await this.cdclient.getObjectNames(this.id)

      await this.createMissions()
      this.sells = await this.getItemsSold()

      resolve()
    })

  }
  async createMissions(){
    return new Promise(async(resolve, reject) => {
      let mission_component = this.components.find(comp => comp.type === 73).id
      this.missions = await this.cdclient.getMissionNPCComponents(mission_component)
      for(let mission of this.missions){
        let data = await this.cdclient.getMissionData(mission.id)
        mission.type = data.defined_type
        mission.subtype = data.defined_subtype || data.defined_type
        mission.xp = data.LegoScore || 0
      }

      resolve()
    })
  }

  async getItemsSold(){
    let vendor_component = this.components.find(comp => comp.type === 16).id
    return new Promise(async(resolve, reject) => {
      let loot_matrix_index = await this.cdclient.getVendorLootMatrixIndex(vendor_component)
      let loot_tables = await this.cdclient.getLootTablesInLootMatrix(loot_matrix_index)
      loot_tables = loot_tables.map((entry) => entry.lti)
      let sold_ids = []
      for(let lti of loot_tables){
        sold_ids.push(...(await this.cdclient.getItemsInLootTable(lti)))
      }
      let sold = []
      for(let id of sold_ids){
        sold.push({
          id: id,
          name: await this.cdclient.getObjectName(id)
        })
      }

      resolve(sold)
    })
  }

}

module.exports = NPC;