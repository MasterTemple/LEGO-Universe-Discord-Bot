const sqlite3 = require('sqlite3').verbose();
const {sqlite_path} = require('./../config.json')
/*
db.each does something for each one
db.all gets all
db.get gets one
*/
class CDClient {
  constructor(){
    this.db;
  }
  removeNull(obj){
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null))
  }

  async load(){
    return new Promise((resolve, reject) => {

      this.db = new sqlite3.Database(sqlite_path, (err) => {
        if (err) {
          console.error('Please provide a path to the cdclient.sqlite in ./config.json.')
        }else{
          console.log("Connected To cdclient.sqlite")
          resolve()
        }
      })
    })
  }

  async getComponents(id){
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT component_type as type, component_id as id FROM ComponentsRegistry WHERE id=${id}`, (err, rows) => {
        resolve(rows)
      });
    })
  }

  // async getNameFromId(id){
  async getObjectName(id){
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT name, displayName FROM Objects WHERE id=${id}`, (err, row) => {
        resolve(row.displayName || row.name)
      });
    })
  }

  async getObjectNames(id){
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT name, description, displayName, _internalNotes as notes FROM Objects WHERE id=${id}`, (err, row) => {
        resolve(this.removeNull(row))
      });
    })
  }

  async getMissionNPCComponents(component_id){
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT missionID as id, offersMission as offers, acceptsMission as accepts FROM MissionNPCComponent WHERE id=${component_id}`, (err, rows) => {
        resolve(rows)
      });
    })
  }

  async getMissionData(mission_id){
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM Missions WHERE id=${mission_id}`, (err, row) => {

        resolve(this.removeNull(row))
      });
    })
  }

  async getVendorLootMatrixIndex(vendor_component){
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT LootMatrixIndex FROM VendorComponent WHERE id=${vendor_component}`, (err, row) => {

        resolve(row.LootMatrixIndex)
      });
    })
  }

  async getLootTablesInLootMatrix(lmi){
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT LootTableIndex as lti, RarityTableIndex as rti, percent, minToDrop as min, maxToDrop as max FROM LootMatrix WHERE LootMatrixIndex=${lmi}`, (err, rows) => {
        resolve(rows)
      });
    })
  }

  async getItemsInLootTable(lti){
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT itemid as id FROM LootTable WHERE LootTableIndex=${lti}`, (err, rows) => {
        console.log({lti});
        resolve(rows.map((item) => item.id))
      });
    })
  }

}

module.exports = CDClient;