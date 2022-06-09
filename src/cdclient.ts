import { ApplicationCommandAutocompleteOption } from 'discord.js';
import { Database } from 'sqlite3';
import {
  ActivityRewards,
  ComponentsRegistry,
  DestructibleComponent,
  Icons,
  ItemComponent,
  LootMatrix,
  LootTable,
  MissionNPCComponent,
  Missions,
  Objects,
  ObjectSkills,
  PackageComponent,
  RarityTable,
  RenderComponent,
  SkillBehavior
} from './cdclientInterfaces';
import { sqlitePath } from './config.json';
import { LocaleXML } from './locale';
import { EnemyDrop, EnemyHealth, ItemDrop, ItemSold, LootDrop, LootDropFirstQuery, LootTableItem, MissionReward, NameValuePair, NPCMission, ObjectElement, queryType, Skill, SmashableDrop } from './luInterfaces';
export const RENDER_COMPONENT = 2;
export const DESTRUCTIBLE_COMPONENT = 7;
export const ITEM_COMPONENT = 11;
export const VENDOR_COMPONENT = 16;
export const PACKAGE_COMPONENT = 53;
export const HONOR_ACCOLADE = 13806;
export const MISSION_OFFER_COMPONENT = 73;


export class CDClient {
  db: Database;
  locale: LocaleXML;
  constructor() {
    this.locale = new LocaleXML();
  }

  removeUndefined(array: any[]) {
    return array.filter((element) => element !== undefined);
  }

  async connectToDB(): Promise<void> {
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

  async load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.connectToDB().then(() => {
        this.locale.load().then(() => {
          resolve();
        });
      });
    });
  }

  async getComponents(id: number) {
    return new Promise<ComponentsRegistry[]>((resolve, reject) => {
      this.db.all(
        // `SELECT component_type as componentType, component_id as componentId FROM ComponentsRegistry WHERE id=${id}`,
        `SELECT * FROM ComponentsRegistry WHERE id=${id}`,
        (_, rows: ComponentsRegistry[]) => {
          resolve(rows);
        });
    });
  }

  async getIconAsset(id: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.get(
        `SELECT icon_asset FROM RenderComponent WHERE id=(
        SELECT component_id FROM ComponentsRegistry WHERE component_type=${RENDER_COMPONENT} and id=${id}
        )`,
        function (_, row: RenderComponent) {
          let icon = row?.icon_asset;
          if (!icon) resolve("/lu-res/textures/ui/inventory/unknown.png")

          icon = icon.replace(/^\.\.\\\.\.\\/g, "/lu-res/");
          icon = icon.replace(/\\/g, "/");
          icon = icon.replace(/ /g, "%20");
          icon = icon.replace(/(?<=\.)dds/gi, "png");
          icon = icon.toLowerCase();
          resolve(icon)
        });
    });
  }

  async getIconAssetFromSkill(skillId: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.get(
        `SELECT IconPath FROM Icons WHERE IconID = (SELECT skillIcon FROM SkillBehavior WHERE skillID = ${skillId})`,
        function (_, row: Icons) {
          let icon = row?.IconPath;
          if (!icon) resolve("/lu-res/textures/ui/inventory/unknown.png")

          icon = icon.replace(/^\.\.\\\.\.\\/g, "/lu-res/");
          icon = icon.replace(/\\/g, "/");
          icon = icon.replace(/ /g, "%20");
          icon = icon.replace(/(?<=\.)dds/gi, "png");
          icon = icon.toLowerCase();
          resolve(icon)
        });
    });
  }

  async getIdFromDestructibleComponent(compId: number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
        `SELECT id FROM ComponentsRegistry WHERE component_type=${DESTRUCTIBLE_COMPONENT} AND component_id=${compId}`,
        (_, row: ComponentsRegistry) => {
          // if(!row) resolve()
          resolve(row?.id);
        });
    });
  }

  async getIdFromPackageComponent(compId: number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
        `SELECT id FROM ComponentsRegistry WHERE component_type=${PACKAGE_COMPONENT} AND component_id=${compId}`,
        (_, row: ComponentsRegistry) => {
          // if(!row) resolve()
          resolve(row?.id);
        });
    });
  }

  private async getObjectNameFromDB(id: number) {
    return new Promise<string>((resolve, reject) => {
      this.db.get(`SELECT name FROM Objects WHERE id=${id}`, (_, row: Objects) => {
        resolve(row?.displayName || row?.name);
      });
    });
  }

  async getObjectName(id: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let name = this.locale.getObjectName(id)
      if (name) {
        resolve(name);
      } else {
        this.getObjectNameFromDB(id).then((dbName) => {
          resolve(dbName);
        });
      }
    });
  }

  getObjectElementFromLocale(id: number): ObjectElement {
    let name = this.locale.getObjectName(id)
    if (name) return {
      id: id,
      name: name,
    };
    else {
      return
    }
  }

  async getObjectElement(id: number): Promise<ObjectElement> {
    return new Promise<ObjectElement>((resolve, reject) => {
      let name = this.locale.getObjectName(id)
      const element: ObjectElement = {
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
  }

  async getItemLootTables(id: number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
        `SELECT LootTableIndex FROM LootTable WHERE itemid=${id}`,
        function (_, rows: LootTable[]) {
          resolve(rows.map((e) => e.LootTableIndex));
        });
    });
  }

  async getLootMatricesFromLootTable(lti: number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
        `SELECT LootTableIndex FROM LootMatrix WHERE LootTableIndex=${lti}`,
        function (_, rows: LootMatrix[]) {
          resolve(rows.map((e) => e.LootTableIndex));
        });
    });
  }

  async getLootMatricesFromLootTables(ltis: number[]) {
    return new Promise<LootMatrix[]>((resolve, reject) => {
      this.db.all(
        `SELECT LootMatrixIndex, LootTableIndex, RarityTableIndex, percent, minToDrop, maxToDrop
           FROM LootMatrix WHERE LootTableIndex in (${ltis.join(',')})`,
        function (_, rows: LootMatrix[]) {
          resolve(rows);
        });
    });
  }

  async getDestructibleComponentsFromLootMatrix(lmi: number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
        `SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi}`,
        function (_, rows: DestructibleComponent[]) {
          resolve(rows.map((e) => e.id));
        });
    });
  }

  async getPackageComponentsFromLootMatrix(lmi: number) {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
        `SELECT id FROM PackageComponent WHERE LootMatrixIndex=${lmi}`,
        function (_, rows: PackageComponent[]) {
          resolve(rows.map((e) => e.id));
        });
    });
  }

  async getRarityTableFromIndex(rti: number) {
    return new Promise<RarityTable[]>((resolve, reject) => {
      this.db.all(
        `SELECT randmax, rarity FROM RarityTable WHERE RarityTableIndex=${rti} ORDER BY rarity ASC`,
        function (_, rows: RarityTable[]) {
          resolve(rows);
        });
    });
  }

  async getPercentToDropRarity(rti: number, rarity: number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT randmax FROM RarityTable WHERE rarity=${rarity} AND RarityTableIndex=${rti}`,
        function (_, row: RarityTable) {
          resolve(row?.randmax || 0);
        });
    });
  }

  async addDestructibleComponentToLootMatrix(lmi: LootMatrix): Promise<ItemDrop> {
    return new Promise<ItemDrop>((resolve, reject) => {
      this.db.all(
        `SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi.LootMatrixIndex}`,
        function (_, rows: DestructibleComponent[]) {
          // resolve({
          //   ...lmi,
          //   destructibleComponent: rows.map((e) => e.id)
          // })
          const itemDrop: ItemDrop = {
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

  async getItemRarity(itemComponent: number) {
    return new Promise<number>((resolve, reject) => {
      this.db.get(`SELECT rarity FROM ItemComponent WHERE id=${itemComponent}`,
        function (_, row: ItemComponent) {
          resolve(row.rarity);
        });
    });
  }

  async getEquipLocationFromCompId(itemComponent: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.db.get(`SELECT equipLocation FROM ItemComponent WHERE id=${itemComponent}`,
        function (_, row: ItemComponent) {
          resolve(row.equipLocation);
        });
    });
  }

  async getObjectData(id: number): Promise<Objects> {
    return new Promise<Objects>((resolve, reject) => {
      this.db.get(`SELECT * FROM Objects WHERE id=${id}`,
        function (_, row: Objects) {
          resolve(row);
        });
    });
  }

  async getItemComponent(itemComponent: number): Promise<ItemComponent> {
    return new Promise<ItemComponent>((resolve, reject) => {
      this.db.get(`SELECT * FROM ItemComponent WHERE id=${itemComponent}`,
        function (_, row: ItemComponent) {
          resolve(row);
        });
    });
  }

  // get item count of rarity in loot table

  async getItemsInLootTable(lootTable: number): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
      this.db.all(
        `SELECT itemid FROM LootTable WHERE LootTableIndex=${lootTable}`,
        (_, rows: LootTable[]) => {
          resolve(rows.map((e) => e.itemid));
        });
    });
  }

  async getItemComponentId(id: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
        `SELECT component_id as componentId FROM ComponentsRegistry WHERE component_type=${ITEM_COMPONENT} AND id=${id}`,
        (_, row: ComponentsRegistry) => {
          resolve(row.component_id);
        });
    });
  }

  async getObjectSkills(id: number): Promise<ObjectSkills[]> {
    return new Promise<ObjectSkills[]>((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ObjectSkills
           WHERE objectTemplate=${id}`,
        (_, rows: ObjectSkills[]) => {
          resolve(rows);
        });
    });
  }
  async getSkillBehavior(skillId: number): Promise<SkillBehavior> {
    return new Promise<SkillBehavior>((resolve, reject) => {
      this.db.get(
        `SELECT * FROM SkillBehavior
           WHERE skillID=${skillId}`,
        (_, row: SkillBehavior) => {
          resolve(row);
        });
    });
  }
  async getObjectId(query: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
        `SELECT id, name, displayName FROM Objects WHERE displayName LIKE '%${query.replace(/\s/g, "%")}%' OR name LIKE '%${query.replace(/\s/g, "%")}%' ORDER BY id ASC LIMIT 15`,
        (_, row: Objects) => {
          resolve(row.id);
        });
    });
  }
  async searchObject(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE displayName LIKE '%${query.replace(/\s/g, "%")}%' OR name LIKE '%${query.replace(/\s/g, "%")}%' LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          });
          resolve(pairs)
        });
    });
  }
  async searchObjectByType(query: string, componentType: queryType): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(/\s/g, "%")}%' OR name LIKE '%${query.replace(/\s/g, "%")}%') AND id IN (SELECT id FROM ComponentsRegistry WHERE component_type=${componentType}) LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          })
          resolve(pairs)
        });
    });
  }
  async getItemsSoldByVendor(vendorId: number): Promise<ObjectElement[]> {
    return new Promise<ObjectElement[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE id in ( SELECT itemid FROM LootTable WHERE LootTableIndex in ( SELECT LootTableIndex FROM LootMatrix WHERE LootMatrixIndex=( SELECT LootMatrixIndex FROM VendorComponent WHERE id=( SELECT component_id FROM ComponentsRegistry WHERE component_type=16 and id=${vendorId} ) ) ) )`,
        (_, rows: Objects[]) => {
          resolve(
            rows.map(({ name, displayName, id }) => {
              return {
                name: displayName || name,
                id: id
              }
            })
          )
        }
      )
    })
  }

  async getItemsWithSkill(skillId: number): Promise<ObjectElement[]> {
    return new Promise<ObjectElement[]>((resolve, reject) => {
      this.db.all(
        `SELECT objectTemplate as id FROM ObjectSkills JOIN SkillBehavior ON SkillBehavior.skillID = ObjectSkills.skillID WHERE ObjectSkills.skillID = ${skillId}`,
        (_, rows) => {
          resolve(
            rows.map(({ id }) => {
              return {
                name: this.locale.getObjectName(id),
                id: id
              }
            })
          )
        }
      )
    })
  }

  async getSmashableDrops(id: number): Promise<SmashableDrop[]> {
    return new Promise<SmashableDrop[]>(async (resolve, reject) => {
      this.db.all(
        `SELECT LootMatrix.LootTableIndex as lootTableIndex, LootMatrix.percent as chanceForItem, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax as chanceForRarity, RarityTable.rarity FROM LootMatrix JOIN RarityTable on RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM DestructibleComponent WHERE id IN ( SELECT component_id FROM ComponentsRegistry WHERE component_type=${DESTRUCTIBLE_COMPONENT} AND id=${id}))`,
        async (_, rows: SmashableDrop[]) => {
          const lootTableRaritySizes = new Map<number, number>();
          for (let row of rows) {
            let ltiSize = lootTableRaritySizes?.get(row.lootTableIndex);
            if (!ltiSize) {
              ltiSize = await this.getItemsInLootTableOfRarity(row.lootTableIndex, row.rarity);
              lootTableRaritySizes.set(row.lootTableIndex, ltiSize);
            }
            row.poolSize = ltiSize
          }
          resolve(rows)
        }
      )
    })
  }

  async getPackageDrops(id: number): Promise<SmashableDrop[]> {
    return new Promise<SmashableDrop[]>(async (resolve, reject) => {
      this.db.all(
        `SELECT LootMatrix.LootTableIndex as lootTableIndex, LootMatrix.percent as chanceForItem, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax as chanceForRarity, RarityTable.rarity FROM LootMatrix JOIN RarityTable on RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM PackageComponent WHERE id IN ( SELECT component_id FROM ComponentsRegistry WHERE component_type=${PACKAGE_COMPONENT} AND id=${id}))`,
        async (_, rows: SmashableDrop[]) => {
          const lootTableRaritySizes = new Map<number, number>();
          for (let row of rows) {
            let ltiSize = lootTableRaritySizes?.get(row.lootTableIndex);
            if (!ltiSize) {
              ltiSize = await this.getItemsInLootTableOfRarity(row.lootTableIndex, row.rarity);
              lootTableRaritySizes.set(row.lootTableIndex, ltiSize);
            }
            row.poolSize = ltiSize
          }
          resolve(rows)
        }
      )
    })
  }

  async dropItemFromEnemy(id: number, rarity: number): Promise<LootDropFirstQuery[]> {
    return new Promise<LootDropFirstQuery[]>((resolve, reject) => {
      let query = `SELECT ComponentsRegistry.id as objectId, LootTableIndex as lootTableIndex, LootMatrix.LootMatrixIndex as lootMatrixIndex, LootMatrix.RarityTableIndex as rarityIndex, LootMatrix.percent, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax, RarityTable.rarity FROM ComponentsRegistry JOIN LootMatrix ON LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${id} ) JOIN RarityTable ON RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex AND (RarityTable.rarity = ${rarity} OR RarityTable.rarity = ${rarity - 1}) WHERE component_type = ${DESTRUCTIBLE_COMPONENT} AND component_id IN ( SELECT id from DestructibleComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${id} ) ) )`;
      this.db.all(query,
        (_, rows: LootDropFirstQuery[]) => {
          // need rows with proper chance (by subtracting percent of rarity-1)
          // basically this returns a set of rows in pairs of 2 where i just need the percent of the first one and must subtract it from percent of second one
          if (rarity === 1) resolve(rows);

          let newRows: LootDropFirstQuery[] = [];
          let previousPercent = 0;
          for (let row of rows) {

            if (row.rarity !== rarity) {
              previousPercent = row.randmax;
            } else {
              row.randmax = row.randmax - previousPercent;
              newRows.push(row);
            }
          }
          resolve(newRows)
        })
    })
  }

  async dropItemFromPackage(id: number, rarity: number): Promise<LootDropFirstQuery[]> {
    return new Promise<LootDropFirstQuery[]>((resolve, reject) => {
      let query = `SELECT ComponentsRegistry.id as objectId, LootTableIndex as lootTableIndex, LootMatrix.LootMatrixIndex as lootMatrixIndex, LootMatrix.RarityTableIndex as rarityIndex, LootMatrix.percent, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax, RarityTable.rarity FROM ComponentsRegistry JOIN LootMatrix ON LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${id} ) JOIN RarityTable ON RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex AND (RarityTable.rarity = ${rarity} OR RarityTable.rarity = ${rarity - 1}) WHERE component_type = ${PACKAGE_COMPONENT} AND component_id IN ( SELECT id from PackageComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${id} ) ) )`;
      this.db.all(query,
        (_, rows: LootDropFirstQuery[]) => {
          // need rows with proper chance (by subtracting percent of rarity-1)
          // basically this returns a set of rows in pairs of 2 where i just need the percent of the first one and must subtract it from percent of second one
          if (rarity === 1) resolve(rows);

          let newRows: LootDropFirstQuery[] = [];
          let previousPercent = 0;
          for (let row of rows) {

            if (row.rarity !== rarity) {
              previousPercent = row.randmax;
            } else {
              row.randmax = row.randmax - previousPercent;
              newRows.push(row);
            }
          }
          resolve(newRows)
        })
    })
  }

  async getItemsInLootTableWithRarity(lootTable: number): Promise<LootTableItem[]> {
    return new Promise<LootTableItem[]>((resolve, reject) => {
      this.db.all(
        `SELECT itemid as id, ItemComponent.rarity FROM LootTable JOIN ItemComponent ON ItemComponent.id = (SELECT component_id FROM ComponentsRegistry WHERE id = LootTable.itemid AND component_type = ${ITEM_COMPONENT}) WHERE LootTable.LootTableIndex = ${lootTable} ORDER BY rarity ASC;`,
        (_, rows: LootTableItem[]) => {
          for (let row of rows) {
            row.name = this.locale.getObjectName(row.id)
          }
          resolve(rows)
        }
      )
    })
  }

  async getItemsInLootTableOfRarity(lootTable: number, rarity: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
        `SELECT COUNT() as RarityCount FROM ItemComponent WHERE id IN (SELECT component_id FROM ComponentsRegistry WHERE component_type = ${ITEM_COMPONENT} AND id IN (SELECT itemid FROM LootTable WHERE LootTableIndex = ${lootTable})) AND rarity=${rarity}`,
        (_, row: any) => {
          // resolve(row?.RarityCount || 0)
          resolve(row?.RarityCount)
        }
      )
    })
  }

  async getEnemiesAndLootMatrixForLoot(id: number): Promise<Map<number, number>> {
    return new Promise<Map<number, number>>((resolve, reject) => {
      let query = `SELECT ComponentsRegistry.id as enemyId, LootMatrixIndex as lootMatrixIndex from ComponentsRegistry JOIN DestructibleComponent on DestructibleComponent.id = ComponentsRegistry.component_id WHERE component_type = ${DESTRUCTIBLE_COMPONENT} AND component_id IN ( SELECT id from DestructibleComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${id} ) ) )`;
      this.db.all(query,
        (_, rows: any[]) => {
          let map = new Map<number, number>();
          rows.forEach((e) => map.set(e.enemyId, e.lootMatrixIndex))
          resolve(map)
        })
    })
  }

  async getPackagesAndLootMatrixForLoot(id: number): Promise<Map<number, number>> {
    return new Promise<Map<number, number>>((resolve, reject) => {
      let query = `SELECT ComponentsRegistry.id as packageId, LootMatrixIndex as lootMatrixIndex from ComponentsRegistry JOIN PackageComponent on PackageComponent.id = ComponentsRegistry.component_id WHERE component_type = 53 AND component_id IN ( SELECT id from PackageComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${id} ) ) )`;
      this.db.all(query,
        (_, rows: any[]) => {
          let map = new Map<number, number>();
          rows.forEach((e) => map.set(e.packageId, e.lootMatrixIndex))
          resolve(map)
        })
    })
  }

  async getIdsOfItemsSold(id: number): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
      let query = `SELECT id FROM Objects WHERE id in ( SELECT itemid FROM LootTable WHERE LootTableIndex in ( SELECT LootTableIndex FROM LootMatrix WHERE LootMatrixIndex=( SELECT LootMatrixIndex FROM VendorComponent WHERE id=( SELECT component_id FROM ComponentsRegistry WHERE component_type=${VENDOR_COMPONENT} and id=${id} ) ) ) )`;
      this.db.all(query,
        (_, rows: any[]) => {
          let map = rows.map((e) => e.id)
          resolve(map)
        })
    })
  }

  async getItemsSold(id: number): Promise<ItemSold[]> {
    let query = `SELECT ComponentsRegistry.id, ItemComponent.baseValue as cost, ItemComponent.currencyLOT as alternateCurrencyId, ItemComponent.altCurrencyCost as alternateCost, ItemComponent.commendationLOT as commendationCurrencyId, ItemComponent.commendationCost as commendationCost FROM ComponentsRegistry JOIN ItemComponent ON ItemComponent.id = ComponentsRegistry.component_id WHERE component_type = ${ITEM_COMPONENT} AND ComponentsRegistry.id IN( SELECT id FROM Objects WHERE id in ( SELECT itemid FROM LootTable WHERE LootTableIndex in ( SELECT LootTableIndex FROM LootMatrix WHERE LootMatrixIndex=( SELECT LootMatrixIndex FROM VendorComponent WHERE id=( SELECT component_id FROM ComponentsRegistry WHERE component_type=${VENDOR_COMPONENT} and id=${id} ) ) ) ) )`;
    if (id === HONOR_ACCOLADE) {
      query = `SELECT ComponentsRegistry.id, ItemComponent.baseValue as cost, ItemComponent.currencyLOT as alternateCurrencyId, ItemComponent.altCurrencyCost as alternateCost, ItemComponent.commendationLOT as commendationCurrencyId, ItemComponent.commendationCost as commendationCost FROM ItemComponent JOIN ComponentsRegistry ON ComponentsRegistry.component_id = ItemComponent.id AND  component_type = ${ITEM_COMPONENT} AND ComponentsRegistry.id WHERE ItemComponent.commendationLOT IS NOT NULL`
    }
    return new Promise<ItemSold[]>((resolve, reject) => {
      this.db.all(query,
        (_, rows) => {
          let map = rows.map((item) => {
            return {
              id: item.id,
              currency: { id: 163, name: "Coins" }, // default coin
              cost: id === HONOR_ACCOLADE ? 0 : item.cost,
              name: this.locale.getObjectName(item.id),
              alternateCurrency: { id: item.alternateCurrencyId, name: item?.alternateCurrencyId ? this.locale.getObjectName(item.alternateCurrencyId) : "Faction Token" },
              alternateCost: item.alternateCost || 0,
              commendationCurrency: { id: item.commendationCurrencyId, name: "Faction Token" },
              commendationCost: item.commendationCost || 0,
            }
          })
          resolve(map)
        })
    })
  }

  async getIdsOfVendorsThatSellItem(id: number): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
      let query = `SELECT id FROM ComponentsRegistry WHERE component_type = ${VENDOR_COMPONENT} AND component_id IN (SELECT id from VendorComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${id} ) ))`;
      this.db.all(query,
        (_, rows: any[]) => {
          let map = rows.map((e) => e.id)
          resolve(map)
        })
    })
  }

  async getItemsWithRarityInLootTable(lootTable: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.get(
        `SELECT itemid as id, ItemComponent.rarity FROM LootTable JOIN ItemComponent ON ItemComponent.id = (SELECT component_id FROM ComponentsRegistry WHERE id = LootTable.itemid AND component_type = ${ITEM_COMPONENT}) WHERE LootTable.LootTableIndex = ${lootTable};`,
        (_, row: any) => {
          resolve(row?.RarityCount || 0)
        }
      )
    })
  }

  async getMissionsThatRewardItem(item: number): Promise<MissionReward[]> {
    return new Promise<MissionReward[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, defined_type as type, defined_subtype as subtype, reward_item1, reward_item2, reward_item3, reward_item4, reward_item1_count, reward_item2_count, reward_item3_count, reward_item4_count FROM Missions WHERE reward_item1 = ${item} OR reward_item2 = ${item} OR reward_item3 = ${item} OR reward_item4 = ${item};`,
        (_, rows) => {
          let count = 0

          rows = rows.map((row) => {
            if (item === row.reward_item1) count = row.reward_item1_count;
            else if (item === row.reward_item2) count = row.reward_item2_count;
            else if (item === row.reward_item3) count = row.reward_item3_count;
            else if (item === row.reward_item4) count = row.reward_item4_count;

            return {
              id: row.id,
              type: row.type,
              subtype: row.subtype,
              name: this.locale.getMissionName(row.id),
              description: this.locale.getMissionDescription(row.id),
              rewardCount: count
            }
          })

          rows = rows.filter((r) => r.rewardCount > 0)
          resolve(rows)
        }
      )
    })
  }

  async getMissionsFromNPC(npcId: number): Promise<NPCMission[]> {
    return new Promise<NPCMission[]>((resolve, reject) => {
      this.db.all(
        // `SELECT * FROM MissionNPCComponent JOIN Missions ON MissionNPCComponent.missionID = Missions.id WHERE MissionNPCComponent.id = (SELECT component_id FROM ComponentsRegistry WHERE component_type = ${MISSION_OFFER_COMPONENT} AND id = ${npcId}) AND offersMission = 1;`,
        `SELECT * FROM Missions WHERE offer_objectID = ${npcId};`,

        (_, rows: Missions[]) => {
          let missions: NPCMission[] = rows.map((row) => {
            return {
              id: row.id,
              type: row.defined_type,
              subtype: row.defined_subtype,
              name: this.locale.getMissionName(row.id),
              description: this.locale.getMissionDescription(row.id),
              isRepeatable: row.repeatable,
              rewards: (!row.repeatable ?
                [
                  { id: row.reward_item1, name: this.locale.getObjectName(row.reward_item1), count: row.reward_item1_count },
                  { id: row.reward_item2, name: this.locale.getObjectName(row.reward_item2), count: row.reward_item2_count },
                  { id: row.reward_item3, name: this.locale.getObjectName(row.reward_item3), count: row.reward_item3_count },
                  { id: row.reward_item4, name: this.locale.getObjectName(row.reward_item4), count: row.reward_item4_count },
                ] :
                [
                  { id: row.reward_item1_repeatable, name: this.locale.getObjectName(row.reward_item1_repeatable), count: row.reward_item1_repeat_count },
                  { id: row.reward_item2_repeatable, name: this.locale.getObjectName(row.reward_item2_repeatable), count: row.reward_item2_repeat_count },
                  { id: row.reward_item3_repeatable, name: this.locale.getObjectName(row.reward_item3_repeatable), count: row.reward_item3_repeat_count },
                  { id: row.reward_item4_repeatable, name: this.locale.getObjectName(row.reward_item4_repeatable), count: row.reward_item4_repeat_count },
                ]
              ).filter(({ id }) => id > 0),
              isAchievement: false,
              giver: {id: row.offer_objectID, name: this.locale.getObjectName(row.offer_objectID)},
              accepter: {id: row.target_objectID, name: this.locale.getObjectName(row.target_objectID)},
            }
          })
          resolve(missions)
        }
      )
    })
  }

  async getEnemyHealth(enemyId: number): Promise<EnemyHealth> {
    return new Promise<EnemyHealth>((resolve, reject) => {
      this.db.get(
        `SELECT * FROM DestructibleComponent WHERE id = (SELECT component_id FROM ComponentsRegistry WHERE component_type = ${DESTRUCTIBLE_COMPONENT} AND id = ${enemyId})`,
        (_, row: EnemyHealth) => {
          resolve(row)
        }
      )
    })
  }

  async getMission(missionId: number): Promise<Missions> {
    return new Promise<Missions>((resolve, reject) => {
      this.db.get(
        `SELECT * FROM Missions WHERE id = ${missionId}`,
        (_, row: Missions) => {
          resolve(row)
        }
      )
    })
  }

  async getActivitiesThatDropItem(itemId: number, rarity: number): Promise<ActivityDropFromQuery> {
    return new Promise<ActivityDropFromQuery>((resolve, reject) => {
      this.db.all(
        `SELECT ActivityRewards.objectTemplate as id, ActivityRewards.description, LootTableIndex as lootTableIndex, LootMatrix.LootMatrixIndex as lootMatrixIndex, LootMatrix.RarityTableIndex as rarityIndex, LootMatrix.percent, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax, RarityTable.rarity FROM ActivityRewards 
        JOIN LootMatrix ON LootMatrix.LootMatrixIndex = ActivityRewards.LootMatrixIndex 
        JOIN RarityTable ON RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex AND (RarityTable.rarity = ${rarity} OR RarityTable.rarity = ${rarity - 1}) 
        WHERE ActivityRewardIndex in (
        SELECT ActivityRewardIndex from ActivityRewards WHERE LootMatrixIndex IN (
        SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN (
        SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) ) )`,
        (_, rows: ActivityDropFromQuery[]) => {
          // need rows with proper chance (by subtracting percent of rarity-1)
          // basically this returns a set of rows in pairs of 2 where i just need the percent of the first one and must subtract it from percent of second one
          if (rarity === 1) resolve(rows);

          let newRows: ActivityDropFromQuery[] = [];
          let previousPercent = 0;
          for (let row of rows) {

            if (row.rarity !== rarity) {
              previousPercent = row.randmax;
            } else {
              row.randmax = row.randmax - previousPercent;
              newRows.push(row);
            }
          }
          resolve(newRows)
        }
      )
    })
  }



  async searchItem(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%' OR name LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%') AND (SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.id = Objects.id AND component_type = ${ITEM_COMPONENT}) IS NOT NULL LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          });
          resolve(pairs)
        });
    });
  }

  async searchPackage(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%' OR name LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%') AND (SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.id = Objects.id AND component_type = ${PACKAGE_COMPONENT}) IS NOT NULL LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          });
          resolve(pairs)
        });
    });
  }

  async searchSmashable(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%' OR name LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%') AND (SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.id = Objects.id AND component_type = ${DESTRUCTIBLE_COMPONENT}) IS NOT NULL LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          });
          resolve(pairs)
        });
    });
  }

  async searchVendor(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%' OR name LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%') AND (SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.id = Objects.id AND component_type = ${VENDOR_COMPONENT}) IS NOT NULL LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          });
          resolve(pairs)
        });
    });
  }

  async searchMissionNPC(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%' OR name LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%') AND (SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.id = Objects.id AND component_type = ${MISSION_OFFER_COMPONENT}) IS NOT NULL LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          });
          resolve(pairs)
        });
    });
  }

  async searchBrick(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE (displayName LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%' OR name LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%') AND Objects.type = 'LEGO brick' LIMIT 15`,
        (_, rows: Objects[]) => {
          let pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString()
            }
          });
          resolve(pairs)
        });
    });
  }

  async searchActivity(query: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ActivityRewards WHERE description LIKE '%${query.replace(
          /\s/g,
          "%"
        )}%' LIMIT 15`,
        (_, rows: ActivityRewards[]) => {
          let pairs: NameValuePair[] = rows?.map((row) => {
            return {
              name: `${row.description} [${row.objectTemplate}]`,
              value: `${row.objectTemplate};${row.description}`
            }
          });
          resolve(pairs)
        });
    });
  }











}



