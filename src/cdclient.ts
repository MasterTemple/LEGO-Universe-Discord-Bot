import { Database } from "sqlite3";
import { ComponentsRegistry, DestructibleComponent, ItemComponent, LootMatrix, LootTable, Objects, PackageComponent, RarityTable } from "./cdclient_interfaces";
import { sqlite_path } from "./config.json";
import { locale } from "./lu_interfaces";
export const RENDER_COMPONENT = 2
export const DESTRUCTIBLE_COMPONENT = 7
export const ITEM_COMPONENT = 11
export const VENDOR_COMPONENT = 16
export const PACKAGE_COMPONENT = 53

export class CDClient {
  db: Database;
  constructor(){
  }

  async load():Promise<void>{
    return new Promise<void>((resolve, reject) => {
      this.db = new Database(sqlite_path, (err) => {

        if (err) {
          console.error('Please provide a path to the cdclient.sqlite in config.json.')
        }else{
          // console.log(`Connected to '${sqlite_path}' as 'cdclient.sqlite'.`)
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
      this.db.get(`SELECT id FROM ComponentsRegistry WHERE component_type=${DESTRUCTIBLE_COMPONENT} AND component_id=${comp_id}`, function(_, row:ComponentsRegistry){
        // if(!row) resolve()
        resolve(row?.id)
      })
    })
  }
  async getIdFromPackageComponent(comp_id:number){
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT id FROM ComponentsRegistry WHERE component_type=${PACKAGE_COMPONENT} AND component_id=${comp_id}`, function(_, row:ComponentsRegistry){
        // if(!row) resolve()
        resolve(row?.id)
      })
    })
  }
  async getObjectName(id:number){
    return new Promise<string>((resolve, reject) => {
      // this.db.get(`SELECT name FROM Objects WHERE id=${id}`, function(_, row:Objects){
      //   resolve(row?.displayName || row?.name)
      // })
      this.db.get(`SELECT key FROM locale WHERE key="Objects_${id}_name"`, function(_, row:locale){
        resolve(row.value)
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
  async getPackageComponentsFromLootMatrix(lmi:number){
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(`SELECT id FROM PackageComponent WHERE LootMatrixIndex=${lmi}`, function(_, rows:PackageComponent[]){
        resolve(rows.map((e) => e.id))
      })
    })
  }
  async getRarityTableFromIndex(rti:number){
    return new Promise<RarityTable[]>((resolve, reject) => {
      this.db.all(`SELECT randmax, rarity FROM RarityTable WHERE RarityTableIndex=${rti}`, function(_, rows:RarityTable[]){
        resolve(rows)
      })
    })
  }
  async getPercentToDropRarity(rti:number, rarity:number){
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT randmax FROM RarityTable WHERE rarity=${rarity} AND RarityTableIndex=${rti}`, function(_, row:RarityTable){
        resolve(row.randmax)
      })
    })
  }
  async addDestructibleComponentToLootMatrix(lmi:LootMatrix){
    return new Promise<any>((resolve, reject) => {
      this.db.all(`SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi.LootMatrixIndex}`, function(_, rows:DestructibleComponent[]){
        resolve({
          ...lmi,
          destructibleComponent: rows.map((e) => e.id)
        })
      })
    })
  }
  async getItemRarity(item_component:number){
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT rarity FROM ItemComponent WHERE id=${item_component}`, function(_, row:ItemComponent){
        resolve(row.rarity)
      })
    })
  }
  async getItemComponent(item_component:number):Promise<ItemComponent>{
    return new Promise<ItemComponent>((resolve, reject) => {
      this.db.get(`SELECT * FROM ItemComponent WHERE id=${item_component}`, function(_, row:ItemComponent){
        resolve(row)
      })
    })
  }
}
