import { Database } from "sqlite3";
import { ComponentsRegistry, DestructibleComponent, LootMatrix, LootTable, Objects } from "./cdclient_interfaces";
import { sqlite_path } from "./config.json";


export class CDClient {
  db: Database;
  constructor(){
  }
  async load(){
    return new Promise<void>((resolve, reject) => {
      this.db = new Database(sqlite_path, (err) => {

        if (err) {
          console.error('Please provide a path to the cdclient.sqlite in config.json.')
        }else{
          console.log(`Connected to '${sqlite_path}' as 'cdclient.sqlite'.`)
          resolve()
        }

      })
    })
  }
  async test(){
    return new Promise<void>((resolve, reject) => {

      this.db.get("SELECT * FROM Objects WHERE id=7415", function (_, row:Objects){
        console.log(row);
        resolve()
      })

    })
  }
  async getComponents(id:number){
    return new Promise<ComponentsRegistry[]>((resolve, reject) => {
      this.db.all(`SELECT component_type, component_id FROM ComponentsRegistry WHERE id=${id}`, function(_, rows:ComponentsRegistry[]){
        resolve(rows)
      })
    })
  }
  async getIdFromDestructibleComponent(comp_id:number){
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT id FROM ComponentsRegistry WHERE component_type=7 AND component_id=${comp_id}`, function(_, row:ComponentsRegistry){
        // if(!row) resolve()
        resolve(row?.id)
      })
    })
  }
  async getObjectName(id:number){
    return new Promise<string>((resolve, reject) => {
      this.db.get(`SELECT name FROM Objects WHERE id=${id}`, function(_, row:Objects){
        resolve(row?.displayName || row?.name)
      })
    })
  }
  async getItemLootTables(id:number){
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(`SELECT LootTableIndex FROM LootTable WHERE itemid=${id}`, function(_, rows:LootTable[]){
        resolve(rows.map((e) => e.LootTableIndex))
      })
    })
  }
  async getLootMatricesFromLootTable(lti:number){
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(`SELECT LootTableIndex FROM LootMatrix WHERE LootTableIndex=${lti}`, function(_, rows:LootMatrix[]){
        resolve(rows.map((e) => e.LootTableIndex))
      })
    })
  }
  async getLootMatricesFromLootTables(ltis:number[]){
    return new Promise<LootMatrix[]>((resolve, reject) => {
      this.db.all(`SELECT LootMatrixIndex, RarityTableIndex, percent, minToDrop, maxToDrop FROM LootMatrix WHERE LootTableIndex in (${ltis.join(",")})`, function(_, rows:LootMatrix[]){
        resolve(rows)
      })
    })
  }
  async getDestructibleComponentsFromLootMatrix(lmi:number){
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(`SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi}`, function(_, rows:DestructibleComponent[]){
        resolve(rows.map((e) => e.id))
      })
    })
  }
}
