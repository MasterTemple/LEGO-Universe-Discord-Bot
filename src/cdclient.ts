import { ApplicationCommandAutocompleteOption } from 'discord.js';
import {Database} from 'sqlite3';
import {
  ComponentsRegistry,
  DestructibleComponent,
  ItemComponent,
  LootMatrix,
  LootTable,
  Objects,
  ObjectSkills,
  PackageComponent,
  RarityTable,
  SkillBehavior} from './cdclientInterfaces';
import {sqlitePath} from './config.json';
import {LocaleXML} from './locale';
import {ItemDrop, NameValuePair, ObjectElement, queryType, Skill} from './luInterfaces';
export const RENDER_COMPONENT = 2;
export const DESTRUCTIBLE_COMPONENT = 7;
export const ITEM_COMPONENT = 11;
export const VENDOR_COMPONENT = 16;
export const PACKAGE_COMPONENT = 53;

export class CDClient {
  db: Database;
  locale: LocaleXML;
  constructor() {
    this.locale = new LocaleXML();
  }

  removeUndefined(array:any[]) {
    return array.filter((element) => element !== undefined);
  }

  async connectToDB():Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db = new Database(sqlitePath, (err) => {
        if (err) {
          console.error('Please provide a path to the cdclient.sqlite in config.json.');
          process.exit(1);
        } else {
          resolve();
        }
      });
    });
  }

  async load():Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.connectToDB().then(() => {
        this.locale.load().then(() => {
          resolve();
        });
      });
    });
  }

  async getComponents(id:number) {
    return new Promise<ComponentsRegistry[]>((resolve, reject) => {
      this.db.all(
          `SELECT component_type as componentType, component_id as componentId FROM ComponentsRegistry WHERE id=${id}`,
          (_, rows:ComponentsRegistry[]) => {
            resolve(rows);
          });
    });
  }

  async getIdFromDestructibleComponent(compId:number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
          `SELECT id FROM ComponentsRegistry WHERE component_type=${DESTRUCTIBLE_COMPONENT} AND component_id=${compId}`,
          (_, row:ComponentsRegistry) => {
            // if(!row) resolve()
            resolve(row?.id);
          });
    });
  }

  async getIdFromPackageComponent(compId:number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
          `SELECT id FROM ComponentsRegistry WHERE component_type=${PACKAGE_COMPONENT} AND component_id=${compId}`,
          (_, row:ComponentsRegistry) => {
            // if(!row) resolve()
            resolve(row?.id);
          });
    });
  }

  private async getObjectNameFromDB(id:number) {
    return new Promise<string>((resolve, reject) => {
      this.db.get(`SELECT name FROM Objects WHERE id=${id}`, (_, row:Objects) => {
        resolve(row?.displayName || row?.name);
      });
    });
  }

  async getObjectName(id:number):Promise<ObjectElement> {
    return new Promise<ObjectElement>((resolve, reject) => {
      this.locale.getObjectName(id).then((name) => {
        const element:ObjectElement = {
          id: id,
          name: name,
        };
        if (element.name) {
          resolve(element);
        } else {
          this.getObjectNameFromDB(id).then((dbName) => {
            element.name = dbName;
            resolve(element);
          });
        }
      });
    });
  }

  async getItemLootTables(id:number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
          `SELECT LootTableIndex FROM LootTable WHERE itemid=${id}`,
          function(_, rows:LootTable[]) {
            resolve(rows.map((e) => e.LootTableIndex));
          });
    });
  }

  async getLootMatricesFromLootTable(lti:number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
          `SELECT LootTableIndex FROM LootMatrix WHERE LootTableIndex=${lti}`,
          function(_, rows:LootMatrix[]) {
            resolve(rows.map((e) => e.LootTableIndex));
          });
    });
  }

  async getLootMatricesFromLootTables(ltis:number[]) {
    return new Promise<LootMatrix[]>((resolve, reject) => {
      this.db.all(
          `SELECT LootMatrixIndex, LootTableIndex, RarityTableIndex, percent, minToDrop, maxToDrop 
           FROM LootMatrix WHERE LootTableIndex in (${ltis.join(',')})`,
          function(_, rows:LootMatrix[]) {
            resolve(rows);
          });
    });
  }

  async getDestructibleComponentsFromLootMatrix(lmi:number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
          `SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi}`,
          function(_, rows:DestructibleComponent[]) {
            resolve(rows.map((e) => e.id));
          });
    });
  }

  async getPackageComponentsFromLootMatrix(lmi:number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
          `SELECT id FROM PackageComponent WHERE LootMatrixIndex=${lmi}`,
          function(_, rows:PackageComponent[]) {
            resolve(rows.map((e) => e.id));
          });
    });
  }

  async getRarityTableFromIndex(rti:number) {
    return new Promise<RarityTable[]>((resolve, reject) => {
      this.db.all(
          `SELECT randmax, rarity FROM RarityTable WHERE RarityTableIndex=${rti} ORDER BY rarity ASC`,
          function(_, rows:RarityTable[]) {
            resolve(rows);
          });
    });
  }

  async getPercentToDropRarity(rti:number, rarity:number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT randmax FROM RarityTable WHERE rarity=${rarity} AND RarityTableIndex=${rti}`,
          function(_, row:RarityTable) {
            resolve(row?.randmax || 0);
          });
    });
  }

  async addDestructibleComponentToLootMatrix(lmi:LootMatrix):Promise<ItemDrop> {
    return new Promise<ItemDrop>((resolve, reject) => {
      this.db.all(
          `SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi.LootMatrixIndex}`,
          function(_, rows:DestructibleComponent[]) {
            // resolve({
            //   ...lmi,
            //   destructibleComponent: rows.map((e) => e.id)
            // })
            const itemDrop:ItemDrop = {
              ...lmi,
              rarityChance: 0,
              itemsInLootTable: 0,
              destructibleComponents: rows.map((e) => e.id),
              enemies: [],
              packageComponents: [],
              packages: [],
              totalChance: 0,
            };

            resolve(itemDrop);
          });
    });
  }

  async getItemRarity(itemComponent:number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT rarity FROM ItemComponent WHERE id=${itemComponent}`,
          function(_, row:ItemComponent) {
            resolve(row.rarity);
          });
    });
  }

  async getEquipLocationFromCompId(itemComponent:number):Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.get(`SELECT equipLocation FROM ItemComponent WHERE id=${itemComponent}`,
          function(_, row:ItemComponent) {
            resolve(row.equipLocation);
          });
    });
  }

  async getItemComponent(itemComponent:number):Promise<ItemComponent> {
    return new Promise<ItemComponent>((resolve, reject) => {
      this.db.get(`SELECT * FROM ItemComponent WHERE id=${itemComponent}`,
          function(_, row:ItemComponent) {
            resolve(row);
          });
    });
  }

  async getItemsInLootTable(lootTable:number):Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
          `SELECT itemid FROM LootTable WHERE LootTableIndex=${lootTable}`,
          (_, rows:LootTable[]) => {
            resolve(rows.map((e) => e.itemid));
          });
    });
  }

  async getItemComponentId(id:number):Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
          `SELECT component_id as componentId FROM ComponentsRegistry 
           WHERE component_type=${ITEM_COMPONENT} AND id=${id}`,
          (_, row:ComponentsRegistry) => {
            resolve(row.componentId);
          });
    });
  }

  async getObjectSkills(id:number):Promise<ObjectSkills[]> {
    return new Promise<ObjectSkills[]>((resolve, reject) => {
      this.db.all(
          `SELECT * FROM ObjectSkills
           WHERE objectTemplate=${id}`,
          (_, rows:ObjectSkills[]) => {
            resolve(rows);
          });
    });
  }
  async getSkillBehavior(skillId:number):Promise<SkillBehavior> {
    return new Promise<SkillBehavior>((resolve, reject) => {
      this.db.get(
          `SELECT * FROM SkillBehavior
           WHERE skillID=${skillId}`,
          (_, row:SkillBehavior) => {
            resolve(row);
          });
    });
  }

  async searchObject(query:string):Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
          `SELECT id, name, displayName FROM Objects WHERE displayName LIKE '%${query.replace(/\s/g, "%")}%' OR name LIKE '%${query.replace(/\s/g, "%")}%' ORDER BY id ASC LIMIT 15`,
          (_, rows:Objects[]) => {
            let pairs:NameValuePair[] = rows.map((row:Objects) => {
              return {
                name: `${row.displayName || row.name} [${row.id}]`,
                value: row.id.toString()
              }
            })
            resolve(pairs)
          });
    });
  }
  async searchObjectByType(query:string, componentType:queryType):Promise<NameValuePair[]>{
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
          `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(/\s/g, "%")}%' OR name LIKE '%${query.replace(/\s/g, "%")}%') AND id IN (SELECT id FROM ComponentsRegistry WHERE component_type=${componentType}) ORDER BY id ASC LIMIT 15`,
          (_, rows:Objects[]) => {
            let pairs:NameValuePair[] = rows.map((row:Objects) => {
              return {
                name: `${row.displayName || row.name} [${row.id}]`,
                value: row.id.toString()
              }
            })
            resolve(pairs)
          });
    });
  }

}
