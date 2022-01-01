import { Database } from "sqlite3";
import { ComponentsRegistry, DestructibleComponent, ItemComponent, LootMatrix, LootTable, Objects, PackageComponent, RarityTable } from "./cdclient_interfaces";
import { sqlite_path } from "./config.json";
import { ItemDrop, locale, ObjectElement } from "./lu_interfaces";
export const RENDER_COMPONENT = 2
export const DESTRUCTIBLE_COMPONENT = 7
export const ITEM_COMPONENT = 11
export const VENDOR_COMPONENT = 16
export const PACKAGE_COMPONENT = 53

export class CDClient {
  db: Database;
  constructor(){
  }
  removeUndefined(array:any[]){
    return array.filter((element) => element !== undefined)
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
  async getComponents(id:number){
    return new Promise<ComponentsRegistry[]>((resolve, reject) => {
      this.db.all(`SELECT component_type, component_id FROM ComponentsRegistry WHERE id=${id}`, (_,   rows:ComponentsRegistry[])=>{
        resolve(rows)
      })
    })
  }

  async getIdFromDestructibleComponent(comp_id:number){
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT id FROM ComponentsRegistry WHERE component_type=${DESTRUCTIBLE_COMPONENT} AND component_id=${comp_id}`, (_, row:ComponentsRegistry) => {
        // if(!row) resolve()
        resolve(row?.id)
      })
    })
  }
  async getIdFromPackageComponent(comp_id:number){
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT id FROM ComponentsRegistry WHERE component_type=${PACKAGE_COMPONENT} AND component_id=${comp_id}`, (_, row:ComponentsRegistry) => {
        // if(!row) resolve()
        resolve(row?.id)
      })
    })
  }
  async getObjectNameFromDB(id:number){
    return new Promise<string>((resolve, reject) => {
      this.db.get(`SELECT name FROM Objects WHERE id=${id}`, (_, row:Objects) => {
        resolve(row?.displayName || row?.name)
      })
    })
  }
  async getObjectName(id:number){
    return new Promise<string>((resolve, reject) => {
      // this.db.get(`SELECT name FROM Objects WHERE id=${id}`, function(_, row:Objects){
      //   resolve(row?.displayName || row?.name)
      // })
      this.db.get(`SELECT value FROM locale WHERE key="Objects_${id}_name"`, async(_, row:locale) => {
        // console.log(`Objects_${id}_name: ${row.value}`);
        if(row){
          resolve(row.value)
        }else{
          let name = await this.getObjectNameFromDB(id)
          resolve(name)
        }
      })
    })
  }
  async getObjectElement(id:number):Promise<ObjectElement>{
    return new Promise<ObjectElement>((resolve, reject) => {
      this.db.get(`SELECT value FROM locale WHERE key="Objects_${id}_name"`, async(_, row:locale) => {
        let name = row?.value
        if(!name){
          name = await this.getObjectNameFromDB(id)
        }
        resolve({
          id:id,
          name: name
        })
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
      this.db.all(`SELECT LootMatrixIndex, LootTableIndex, RarityTableIndex, percent, minToDrop, maxToDrop FROM LootMatrix WHERE LootTableIndex in (${ltis.join(",")})`, function(_, rows:LootMatrix[]){
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
      this.db.all(`SELECT randmax, rarity FROM RarityTable WHERE RarityTableIndex=${rti} ORDER BY rarity ASC`, function(_, rows:RarityTable[]){
        resolve(rows)
      })
    })
  }
  async getPercentToDropRarity(rti:number, rarity:number){
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT randmax FROM RarityTable WHERE rarity=${rarity} AND RarityTableIndex=${rti}`, function(_, row:RarityTable){
        resolve(row?.randmax || 0)
      })
    })
  }
  async addDestructibleComponentToLootMatrix(lmi:LootMatrix):Promise<ItemDrop>{
    return new Promise<ItemDrop>((resolve, reject) => {
      this.db.all(`SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi.LootMatrixIndex}`, function(_, rows:DestructibleComponent[]){
        // resolve({
        //   ...lmi,
        //   destructibleComponent: rows.map((e) => e.id)
        // })
        let item_drop:ItemDrop = {
          ...lmi,
          rarityChance: 0,
          itemsInLootTable: 0,
          destructibleComponents: rows.map((e) => e.id),
          destructibleIds: [],
          destructibleNames: [],
          packageComponents: [],
          packageIds: [],
          packageNames: [],
          totalChance:0
        }

        resolve(item_drop)
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
  async getEquipLocationFromCompId(item_component:number):Promise<string>{
    return new Promise<string>((resolve, reject) => {
      this.db.get(`SELECT equipLocation FROM ItemComponent WHERE id=${item_component}`, function(_, row:ItemComponent){
        resolve(row.equipLocation)
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
  async getItemsInLootTable(loot_table:number):Promise<number[]>{
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(`SELECT itemid FROM LootTable WHERE LootTableIndex=${loot_table}`, (_,   rows:LootTable[])=>{
        resolve(rows.map(e => e.itemid))
      })
    })
  }
  async getItemComponentId(id:number):Promise<number>{
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT component_id FROM ComponentsRegistry WHERE component_type=${ITEM_COMPONENT} AND id=${id}`, (_,   row:ComponentsRegistry)=>{
        resolve(row.component_id)
      })
    })
  }
}

