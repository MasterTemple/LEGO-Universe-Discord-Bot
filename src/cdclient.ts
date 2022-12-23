/* eslint-disable linebreak-style */
import { Database } from 'sqlite3';
import {
  ActivityRewards,
  ComponentsRegistry,
  DestructibleComponent,
  Icons,
  ItemComponent,
  LevelProgressionLookup,
  LootMatrix,
  LootTable, Missions, Objects,
  ObjectSkills,
  PackageComponent,
  RarityTable,
  RenderComponent,
  SkillBehavior,
  SkillBehaviorWithObjectSkills
} from './cdclientInterfaces';
import { HQValidOnly, sqlitePath } from './config';
import { formatIconPath } from './functions';
import { LocaleXML } from './locale';
import { ActivityDropFromQuery, EnemyHealth, ItemDrop, ItemSold, LevelData, LootDropFirstQuery, LootTableItem, MissionReward, NameValuePair, NPCMission, ObjectElement, queryType, Skill, SmashableDrop } from './luInterfaces';

export const RENDER_COMPONENT = 2;
export const DESTRUCTIBLE_COMPONENT = 7;
export const ITEM_COMPONENT = 11;
export const VENDOR_COMPONENT = 16;
export const PACKAGE_COMPONENT = 53;
export const HONOR_ACCOLADE = 13806;
export const MISSION_OFFER_COMPONENT = 73;

function sqlike(str: string): string {
  return `%${str.replace(/\s/g, '%')}%`;
}
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
    return new Promise<void>((resolve) => {
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
    return new Promise<void>((resolve) => {
      this.connectToDB().then(() => {
        this.locale.load().then(() => {
          resolve();
        });
      });
    });
  }

  async getComponents(objectId: number) {
    return new Promise<ComponentsRegistry[]>((resolve) => {
      this.db.all(
        // `SELECT component_type as componentType, component_id as componentId FROM ComponentsRegistry WHERE id=${id}`,
        `SELECT * FROM ComponentsRegistry WHERE id=${objectId}`,
        (_, rows: ComponentsRegistry[]) => {
          resolve(rows);
        });
    });
  }

  async getIconAsset(objectId: number): Promise<string> {
    return new Promise<string>((resolve) => {
      this.db.get(
        `SELECT icon_asset FROM RenderComponent WHERE id=(
        SELECT component_id FROM ComponentsRegistry WHERE component_type=${RENDER_COMPONENT} and id=${objectId}
        )`,
        function (_, row: RenderComponent) {
          let icon = row?.icon_asset;
          if (!icon) resolve('/lu-res/textures/ui/inventory/unknown.png');
          icon = formatIconPath(icon);
          resolve(icon);
        });
    });
  }

  async getIconAssetFromSkill(skillId: number): Promise<string> {
    return new Promise<string>((resolve) => {
      this.db.get(
        `SELECT IconPath FROM Icons WHERE IconID=(SELECT skillIcon FROM SkillBehavior WHERE skillID = ${skillId})`,
        function (_, row: Icons) {
          let icon = row?.IconPath;
          if (!icon) resolve('/lu-res/textures/ui/inventory/unknown.png');
          icon = formatIconPath(icon);
          resolve(icon);
        });
    });
  }

  async getIconAssetFromIconId(iconId: number): Promise<string> {
    return new Promise<string>((resolve) => {
      this.db.get(
        `SELECT IconPath FROM Icons WHERE IconID=${iconId}`,
        function (_, row: Icons) {
          let icon = row?.IconPath;
          if (!icon) resolve('/lu-res/textures/ui/inventory/unknown.png');
          icon = formatIconPath(icon);
          resolve(icon);
        });
    });
  }

  async getIconAssetForMission(missionId: number): Promise<string> {
    return new Promise<string>((resolve) => {
      this.db.get(
        // `SELECT IconID, largeTaskIconID FROM MissionTasks WHERE id = ${missionId})`,
        `SELECT IconPath FROM Icons WHERE IconID = (SELECT IconID FROM MissionTasks WHERE id = ${missionId}) OR IconID = (SELECT largeTaskIconID FROM MissionTasks WHERE id = ${missionId})`,
        function (_, row: Icons) {
          let icon = row?.IconPath;
          if (!icon) resolve('/lu-res/textures/ui/inventory/unknown.png');
          icon = formatIconPath(icon);
          resolve(icon);
        });
    });
  }

  async getIdFromDestructibleComponent(compId: number) {
    return new Promise<number>((resolve) => {
      this.db.get(
        `SELECT id FROM ComponentsRegistry WHERE component_type=${DESTRUCTIBLE_COMPONENT} AND component_id=${compId}`,
        (_, row: ComponentsRegistry) => {
          // if(!row) resolve()
          resolve(row?.id);
        });
    });
  }

  async getIdFromPackageComponent(compId: number) {
    return new Promise<number>((resolve) => {
      this.db.get(
        `SELECT id FROM ComponentsRegistry WHERE component_type=${PACKAGE_COMPONENT} AND component_id=${compId}`,
        (_, row: ComponentsRegistry) => {
          // if(!row) resolve()
          resolve(row?.id);
        });
    });
  }

  private async getObjectNameFromDB(objectId: number) {
    return new Promise<string>((resolve) => {
      const query = `SELECT name FROM Objects WHERE id=${objectId}`;
      // if (HQValidOnly) query += " AND HQ_valid = 1";
      this.db.get(query, (_, row: Objects) => {
        resolve(row?.displayName || row?.name);
      });
    });
  }

  async getObjectName(objectId: number): Promise<string> {
    return new Promise<string>((resolve) => {
      const name = this.locale.getObjectNameOrUndefined(objectId);
      if (name) {
        resolve(name);
      } else {
        this.getObjectNameFromDB(objectId).then((dbName) => {
          resolve(dbName);
        });
      }
    });
  }

  getObjectElementFromLocale(objectId: number): ObjectElement {
    const name = this.locale.getObjectName(objectId);
    if (name) {
      return {
        id: objectId,
        name: name,
      };
    } else {
      return;
    }
  }

  async getObjectElement(objectId: number): Promise<ObjectElement> {
    return new Promise<ObjectElement>((resolve) => {
      const name = this.locale.getObjectName(objectId);
      const element: ObjectElement = {
        id: objectId,
        name: name,
      };
      if (element.name) {
        resolve(element);
      } else {
        this.getObjectNameFromDB(objectId).then((dbName) => {
          element.name = dbName;
          resolve(element);
        });
      }
    });
  }

  async getItemLootTables(itemId: number) {
    return new Promise<number[]>((resolve) => {
      this.db.all(
        `SELECT LootTableIndex FROM LootTable WHERE itemid=${itemId}`,
        function (_, rows: LootTable[]) {
          resolve(rows.map((e) => e.LootTableIndex));
        });
    });
  }

  async getLootMatricesFromLootTable(lti: number) {
    return new Promise<number[]>((resolve) => {
      this.db.all(
        `SELECT LootTableIndex FROM LootMatrix WHERE LootTableIndex=${lti}`,
        function (_, rows: LootMatrix[]) {
          resolve(rows.map((e) => e.LootTableIndex));
        });
    });
  }

  async getLootMatricesFromLootTables(ltis: number[]) {
    return new Promise<LootMatrix[]>((resolve) => {
      this.db.all(
        `SELECT LootMatrixIndex, LootTableIndex, RarityTableIndex, percent, minToDrop, maxToDrop
           FROM LootMatrix WHERE LootTableIndex in (${ltis.join(',')})`,
        function (_, rows: LootMatrix[]) {
          resolve(rows);
        });
    });
  }

  async getDestructibleComponentsFromLootMatrix(lmi: number) {
    return new Promise<number[]>((resolve) => {
      this.db.all(
        `SELECT id FROM DestructibleComponent WHERE LootMatrixIndex=${lmi}`,
        function (_, rows: DestructibleComponent[]) {
          resolve(rows.map((e) => e.id));
        });
    });
  }

  async getPackageComponentsFromLootMatrix(lmi: number) {
    return new Promise<number[]>((resolve) => {
      this.db.all(
        `SELECT id FROM PackageComponent WHERE LootMatrixIndex=${lmi}`,
        function (_, rows: PackageComponent[]) {
          resolve(rows.map((e) => e.id));
        });
    });
  }

  async getRarityTableFromIndex(rti: number) {
    return new Promise<RarityTable[]>((resolve) => {
      this.db.all(
        `SELECT randmax, rarity FROM RarityTable WHERE RarityTableIndex=${rti} ORDER BY rarity ASC`,
        function (_, rows: RarityTable[]) {
          resolve(rows);
        });
    });
  }

  async getPercentToDropRarity(rti: number, rarity: number) {
    return new Promise<number>((resolve) => {
      this.db.get(`SELECT randmax FROM RarityTable WHERE rarity=${rarity} AND RarityTableIndex=${rti}`,
        function (_, row: RarityTable) {
          resolve(row?.randmax || 0);
        });
    });
  }

  async addDestructibleComponentToLootMatrix(lmi: LootMatrix): Promise<ItemDrop> {
    return new Promise<ItemDrop>((resolve) => {
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
    return new Promise<number>((resolve) => {
      this.db.get(`SELECT rarity FROM ItemComponent WHERE id=${itemComponent}`,
        function (_, row: ItemComponent) {
          resolve(row.rarity);
        });
    });
  }

  async getEquipLocationFromCompId(itemComponent: number): Promise<string> {
    return new Promise<string>((resolve) => {
      this.db.get(`SELECT equipLocation FROM ItemComponent WHERE id=${itemComponent}`,
        function (_, row: ItemComponent) {
          resolve(row.equipLocation);
        });
    });
  }

  async getObjectData(objectId: number): Promise<Objects> {
    return new Promise<Objects>((resolve) => {
      const query = `SELECT * FROM Objects WHERE id=${objectId}`;
      // if (HQValidOnly) query += " AND HQ_valid = 1";
      this.db.get(query,
        function (_, row: Objects) {
          resolve(row);
        });
    });
  }

  async getItemComponent(itemComponent: number): Promise<ItemComponent> {
    return new Promise<ItemComponent>((resolve) => {
      this.db.get(`SELECT * FROM ItemComponent WHERE id=${itemComponent}`,
        function (_, row: ItemComponent) {
          resolve(row);
        });
    });
  }

  // get item count of rarity in loot table

  async getItemsInLootTable(lootTable: number): Promise<number[]> {
    return new Promise<number[]>((resolve) => {
      this.db.all(
        `SELECT itemid FROM LootTable WHERE LootTableIndex=${lootTable}`,
        (_, rows: LootTable[]) => {
          resolve(rows.map((e) => e.itemid));
        });
    });
  }

  async getItemComponentId(itemId: number): Promise<number> {
    return new Promise<number>((resolve) => {
      this.db.get(
        `SELECT component_id as componentId FROM ComponentsRegistry WHERE component_type=${ITEM_COMPONENT} AND id=${itemId}`,
        (_, row: ComponentsRegistry) => {
          resolve(row.component_id);
        });
    });
  }

  async getObjectSkills(objectId: number): Promise<ObjectSkills[]> {
    return new Promise<ObjectSkills[]>((resolve) => {
      this.db.all(
        `SELECT * FROM ObjectSkills
           WHERE objectTemplate=${objectId}`,
        (_, rows: ObjectSkills[]) => {
          resolve(rows);
        });
    });
  }

  async getSkillBehavior(skillId: number): Promise<SkillBehavior> {
    return new Promise<SkillBehavior>((resolve) => {
      this.db.get(
        `SELECT * FROM SkillBehavior
           WHERE skillID=${skillId}`,
        (_, row: SkillBehavior) => {
          resolve(row);
        });
    });
  }

  async getSkillsFromObject(itemId: number): Promise<Skill[]> {
    return new Promise<Skill[]>((resolve) => {
      this.db.all(
        `SELECT * FROM SkillBehavior JOIN ObjectSkills ON SkillBehavior.skillID = ObjectSkills.skillID AND ObjectSkills.objectTemplate = ${itemId} WHERE SkillBehavior.skillID IN (SELECT skillID From ObjectSkills WHERE objectTemplate = ${itemId})`,
        (_, rows: SkillBehaviorWithObjectSkills[]) => {
          const skills: Skill[] = rows.map((skill) => {
            return {
              itemId: skill.objectTemplate,
              id: skill.skillID,
              behaviorId: skill.behaviorID,
              onEquip: !skill.AICombatWeight,
              imaginationCost: skill.imaginationcost,
              cooldownGroup: skill.cooldowngroup,
              cooldownTime: skill.cooldown,
              armorBonus: skill.armorBonusUI,
              healthBonus: skill.lifeBonusUI,
              imaginationBonus: skill.imBonusUI,
              name: this.locale.getSkillName(skill.skillID),
              descriptions: this.locale.getSkillDescription(skill.skillID),
            };
          });
          resolve(skills);
        });
    });
  }

  async getSkillsFromObjects(itemIds: number[]): Promise<Skill[]> {
    return new Promise<Skill[]>((resolve) => {
      this.db.all(
        `SELECT * FROM SkillBehavior JOIN ObjectSkills ON SkillBehavior.skillID = ObjectSkills.skillID AND ObjectSkills.objectTemplate IN (${itemIds.join(',')}) WHERE SkillBehavior.skillID IN (SELECT skillID From ObjectSkills WHERE objectTemplate IN (${itemIds.join(',')})) ORDER BY ObjectSkills.objectTemplate`,
        (_, rows: SkillBehaviorWithObjectSkills[]) => {
          const skills: Skill[] = rows?.map((skill) => {
            return {
              itemId: skill.objectTemplate,
              id: skill.skillID,
              behaviorId: skill.behaviorID,
              onEquip: !skill.castOnType,
              imaginationCost: skill.imaginationcost,
              cooldownGroup: skill.cooldowngroup,
              cooldownTime: skill.cooldown,
              armorBonus: skill.armorBonusUI,
              healthBonus: skill.lifeBonusUI,
              imaginationBonus: skill.imBonusUI,
              name: this.locale.getSkillName(skill.skillID),
              descriptions: this.locale.getSkillDescription(skill.skillID),
            };
          });
          resolve(skills);
        });
    });
  }

  async getSkillsInCooldownGroup(cdg: number): Promise<SkillBehavior[]> {
    return new Promise<SkillBehavior[]>((resolve) => {
      this.db.all(`SELECT * FROM SkillBehavior WHERE cooldowngroup = ${cdg}`,
        function (_, rows: SkillBehavior[]) {
          resolve(rows);
        });
    });
  }

  async getObjectId(objectName: string): Promise<number> {
    return new Promise<number>((resolve) => {
      // let HQ_valid = HQValidOnly ? "HQ_valid = 1 AND" : "";
      // let query = `SELECT id FROM Objects WHERE ${HQ_valid} displayName LIKE '%${objectName.replace(/\s/g, "%")}%' OR name LIKE '%${objectName.replace(/\s/g, "%")}%' ORDER BY id ASC LIMIT 25`;
      const query = `SELECT id FROM Objects WHERE displayName LIKE '%${objectName.replace(/\s/g, '%')}%' OR name LIKE '%${objectName.replace(/\s/g, '%')}%' ORDER BY id ASC LIMIT 25`;
      // let itemId = parseInt(objectName)
      // if(itemId) {
      //   // this validates that the id is HQ valid
      //   query = `SELECT id FROM Objects WHERE ${HQ_valid} id = ${itemId}`
      // }
      this.db.get(
        query,
        (_, row: Objects) => {
          resolve(row?.id);
        });
    });
  }

  async getItemId(objectName: string): Promise<number> {
    return new Promise<number>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      let query = `SELECT id FROM Objects WHERE ${HQ_valid} (displayName LIKE '%${objectName.replace(/\s/g, '%')}%' OR name LIKE '%${objectName.replace(/\s/g, '%')}%') ORDER BY id ASC LIMIT 25`;
      const itemId = parseInt(objectName);
      if (itemId) {
        // this validates that the id is HQ valid
        query = `SELECT id FROM Objects WHERE ${HQ_valid} id = ${itemId}`;
      }
      this.db.get(
        query,
        (_, row: Objects) => {
          resolve(row?.id);
        });
    });
  }

  async searchObject(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE ${HQ_valid} (displayName LIKE '%${phrase.replace(/\s/g, '%')}%' OR name LIKE '%${phrase.replace(/\s/g, '%')}%') LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }
  async searchObjectByType(phrase: string, componentType: queryType): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE ${HQ_valid} (displayName LIKE '%${phrase.replace(/\s/g, '%')}%' OR name LIKE '%${phrase.replace(/\s/g, '%')}%') AND id IN (SELECT id FROM ComponentsRegistry WHERE component_type=${componentType}) LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }
  async getItemsSoldByVendor(vendorId: number): Promise<ObjectElement[]> {
    return new Promise<ObjectElement[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE ${HQ_valid} id in ( SELECT itemid FROM LootTable WHERE LootTableIndex in ( SELECT LootTableIndex FROM LootMatrix WHERE LootMatrixIndex=( SELECT LootMatrixIndex FROM VendorComponent WHERE id=( SELECT component_id FROM ComponentsRegistry WHERE component_type=16 and id=${vendorId} ) ) ) )`,
        (_, rows: Objects[]) => {
          resolve(
            rows.map(({ name, displayName, id }) => {
              return {
                name: displayName || name,
                id: id,
              };
            }),
          );
        },
      );
    });
  }

  async getItemsWithSkill(skillId: number): Promise<ObjectElement[]> {
    return new Promise<ObjectElement[]>((resolve) => {
      this.db.all(
        `SELECT objectTemplate as id FROM ObjectSkills JOIN SkillBehavior ON SkillBehavior.skillID = ObjectSkills.skillID WHERE ObjectSkills.skillID = ${skillId}`,
        (_, rows) => {
          resolve(
            rows.map(({ id }) => {
              return {
                name: this.locale.getObjectName(id),
                id: id,
              };
            }),
          );
        },
      );
    });
  }

  async getSmashableDrops(objectId: number): Promise<SmashableDrop[]> {
    return new Promise<SmashableDrop[]>(async (resolve) => {
      this.db.all(
        `SELECT LootMatrix.LootTableIndex as lootTableIndex, LootMatrix.percent as chanceForItem, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax as chanceForRarity, RarityTable.rarity FROM LootMatrix JOIN RarityTable on RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM DestructibleComponent WHERE id IN ( SELECT component_id FROM ComponentsRegistry WHERE component_type=${DESTRUCTIBLE_COMPONENT} AND id=${objectId}))`,
        async (_, rows: SmashableDrop[]) => {
          const lootTableRaritySizes = new Map<number, number>();
          for (const row of rows) {
            let ltiSize = lootTableRaritySizes?.get(row.lootTableIndex);
            if (!ltiSize) {
              ltiSize = await this.getItemsInLootTableOfRarity(row.lootTableIndex, row.rarity);
              lootTableRaritySizes.set(row.lootTableIndex, ltiSize);
            }
            row.poolSize = ltiSize;
          }
          resolve(rows);
        },
      );
    });
  }

  async getPackageDrops(packageId: number): Promise<SmashableDrop[]> {
    return new Promise<SmashableDrop[]>(async (resolve) => {
      const query = `SELECT LootMatrix.LootTableIndex as lootTableIndex, LootMatrix.percent as chanceForItem, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax as chanceForRarity, RarityTable.rarity FROM LootMatrix JOIN RarityTable on RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM PackageComponent WHERE id IN ( SELECT component_id FROM ComponentsRegistry WHERE component_type=${PACKAGE_COMPONENT} AND id=${packageId}))`;
      this.db.all(
        query,
        async (_, rows: SmashableDrop[]) => {
          const lootTableRaritySizes = new Map<number, number>();
          for (const row of rows) {
            let ltiSize = lootTableRaritySizes?.get(row.lootTableIndex);
            if (!ltiSize) {
              ltiSize = await this.getItemsInLootTableOfRarity(row.lootTableIndex, row.rarity);
              lootTableRaritySizes.set(row.lootTableIndex, ltiSize);
            }
            row.poolSize = ltiSize;
          }
          resolve(rows);
        },
      );
    });
  }

  async getActivityDrops(activityName: string): Promise<SmashableDrop[]> {
    return new Promise<SmashableDrop[]>(async (resolve) => {
      this.db.all(
        `SELECT LootMatrix.LootTableIndex as lootTableIndex, LootMatrix.percent as chanceForItem, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax as chanceForRarity, RarityTable.rarity, (SELECT COUNT(*) FROM LootTable WHERE LootMatrix.LootTableIndex=LootTable.LootTableIndex) AS poolSize FROM LootMatrix JOIN RarityTable on RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex WHERE LootMatrixIndex IN (SELECT LootMatrixIndex FROM ActivityRewards WHERE description LIKE '%${activityName}%')`,
        async (_, rows: SmashableDrop[]) => {
          // this is different because im getting across multiple rarities
          const lootTableRaritySizes = new Map<string, number>();
          // string: lti:rarity
          for (const row of rows) {
            let ltiSize = lootTableRaritySizes?.get(`${row.lootTableIndex}:${row.rarity}`);
            if (!ltiSize) {
              ltiSize = await this.getItemsInLootTableOfRarity(row.lootTableIndex, row.rarity);
              lootTableRaritySizes.set(`${row.lootTableIndex}:${row.rarity}`, ltiSize);
            }
            row.poolSize = ltiSize;
          }
          resolve(rows);
        },
      );
    });
  }

  async dropItemFromEnemy(itemId: number, rarity: number): Promise<LootDropFirstQuery[]> {
    return new Promise<LootDropFirstQuery[]>((resolve) => {
      const query = `SELECT ComponentsRegistry.id as objectId, LootTableIndex as lootTableIndex, LootMatrix.LootMatrixIndex as lootMatrixIndex, LootMatrix.RarityTableIndex as rarityIndex, LootMatrix.percent, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax, RarityTable.rarity FROM ComponentsRegistry JOIN LootMatrix ON LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) JOIN RarityTable ON RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex AND (RarityTable.rarity = ${rarity} OR RarityTable.rarity = ${rarity - 1}) WHERE component_type = ${DESTRUCTIBLE_COMPONENT} AND component_id IN ( SELECT id from DestructibleComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) ) )`;
      this.db.all(query,
        (_, rows: LootDropFirstQuery[]) => {
          // need rows with proper chance (by subtracting percent of rarity-1)
          // basically this returns a set of rows in pairs of 2 where i just need the percent of the first one and must subtract it from percent of second one
          if (rarity === 1) resolve(rows);

          const newRows: LootDropFirstQuery[] = [];
          let previousPercent = 0;
          for (const row of rows) {
            if (row.rarity !== rarity) {
              previousPercent = row.randmax;
            } else {
              row.randmax = row.randmax - previousPercent;
              newRows.push(row);
            }
          }
          resolve(newRows);
        });
    });
  }

  async dropItemFromPackage(itemId: number, rarity: number): Promise<LootDropFirstQuery[]> {
    return new Promise<LootDropFirstQuery[]>((resolve) => {
      const query = `SELECT ComponentsRegistry.id as objectId, LootTableIndex as lootTableIndex, LootMatrix.LootMatrixIndex as lootMatrixIndex, LootMatrix.RarityTableIndex as rarityIndex, LootMatrix.percent, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax, RarityTable.rarity FROM ComponentsRegistry JOIN LootMatrix ON LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) JOIN RarityTable ON RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex AND (RarityTable.rarity = ${rarity} OR RarityTable.rarity = ${rarity - 1}) WHERE component_type = ${PACKAGE_COMPONENT} AND component_id IN ( SELECT id from PackageComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) ) )`;
      this.db.all(query,
        (_, rows: LootDropFirstQuery[]) => {
          // need rows with proper chance (by subtracting percent of rarity-1)
          // basically this returns a set of rows in pairs of 2 where i just need the percent of the first one and must subtract it from percent of second one
          if (rarity === 1) resolve(rows);

          const newRows: LootDropFirstQuery[] = [];
          let previousPercent = 0;
          for (const row of rows) {
            if (row.rarity !== rarity) {
              previousPercent = row.randmax;
            } else {
              row.randmax = row.randmax - previousPercent;
              newRows.push(row);
            }
          }
          resolve(newRows);
        });
    });
  }

  async getItemsInLootTableWithRarity(lootTable: number): Promise<LootTableItem[]> {
    return new Promise<LootTableItem[]>((resolve) => {
      this.db.all(
        `SELECT itemid as id, ItemComponent.rarity FROM LootTable JOIN ItemComponent ON ItemComponent.id = (SELECT component_id FROM ComponentsRegistry WHERE id = LootTable.itemid AND component_type = ${ITEM_COMPONENT}) WHERE LootTable.LootTableIndex = ${lootTable} ORDER BY rarity ASC;`,
        (_, rows: LootTableItem[]) => {
          for (const row of rows) {
            row.name = this.locale.getObjectName(row.id);
          }
          resolve(rows);
        },
      );
    });
  }

  async getItemsInLootTableOfRarity(lootTable: number, rarity: number): Promise<number> {
    return new Promise<number>((resolve) => {
      this.db.get(
        `SELECT COUNT() as RarityCount FROM ItemComponent WHERE id IN (SELECT component_id FROM ComponentsRegistry WHERE component_type = ${ITEM_COMPONENT} AND id IN (SELECT itemid FROM LootTable WHERE LootTableIndex = ${lootTable})) AND rarity=${rarity}`,
        (_, row: any) => {
          // resolve(row?.RarityCount || 0)
          resolve(row?.RarityCount);
        },
      );
    });
  }

  async getEnemiesAndLootMatrixForLoot(itemId: number): Promise<Map<number, number>> {
    return new Promise<Map<number, number>>((resolve) => {
      const query = `SELECT ComponentsRegistry.id as enemyId, LootMatrixIndex as lootMatrixIndex from ComponentsRegistry JOIN DestructibleComponent on DestructibleComponent.id = ComponentsRegistry.component_id WHERE component_type = ${DESTRUCTIBLE_COMPONENT} AND component_id IN ( SELECT id from DestructibleComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) ) )`;
      this.db.all(query,
        (_, rows: any[]) => {
          const map = new Map<number, number>();
          rows.forEach((e) => map.set(e.enemyId, e.lootMatrixIndex));
          resolve(map);
        });
    });
  }

  async getPackagesAndLootMatrixForLoot(itemId: number): Promise<Map<number, number>> {
    return new Promise<Map<number, number>>((resolve) => {
      const query = `SELECT ComponentsRegistry.id as packageId, LootMatrixIndex as lootMatrixIndex from ComponentsRegistry JOIN PackageComponent on PackageComponent.id = ComponentsRegistry.component_id WHERE component_type = 53 AND component_id IN ( SELECT id from PackageComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) ) )`;
      this.db.all(query,
        (_, rows: any[]) => {
          const map = new Map<number, number>();
          rows.forEach((e) => map.set(e.packageId, e.lootMatrixIndex));
          resolve(map);
        });
    });
  }

  async getIdsOfItemsSold(vendorId: number): Promise<number[]> {
    return new Promise<number[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      const query = `SELECT id FROM Objects WHERE ${HQ_valid} id in ( SELECT itemid FROM LootTable WHERE LootTableIndex in ( SELECT LootTableIndex FROM LootMatrix WHERE LootMatrixIndex=( SELECT LootMatrixIndex FROM VendorComponent WHERE id=( SELECT component_id FROM ComponentsRegistry WHERE component_type=${VENDOR_COMPONENT} and id=${vendorId} ) ) ) )`;
      this.db.all(query,
        (_, rows: any[]) => {
          const map = rows.map((e) => e.id);
          resolve(map);
        });
    });
  }

  async getItemsSold(vendorId: number): Promise<ItemSold[]> {
    return new Promise<ItemSold[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';

      let query = `SELECT ComponentsRegistry.id, ItemComponent.baseValue as cost, ItemComponent.currencyLOT as alternateCurrencyId, ItemComponent.altCurrencyCost as alternateCost, ItemComponent.commendationLOT as commendationCurrencyId, ItemComponent.commendationCost as commendationCost FROM ComponentsRegistry JOIN ItemComponent ON ItemComponent.id = ComponentsRegistry.component_id WHERE component_type = ${ITEM_COMPONENT} AND ComponentsRegistry.id IN( SELECT id FROM Objects WHERE ${HQ_valid} id in ( SELECT itemid FROM LootTable WHERE LootTableIndex in ( SELECT LootTableIndex FROM LootMatrix WHERE LootMatrixIndex=( SELECT LootMatrixIndex FROM VendorComponent WHERE id=( SELECT component_id FROM ComponentsRegistry WHERE component_type=${VENDOR_COMPONENT} and id=${vendorId} ) ) ) ) )`;

      if (vendorId === HONOR_ACCOLADE) {
        query = `SELECT ComponentsRegistry.id, ItemComponent.baseValue as cost, ItemComponent.currencyLOT as alternateCurrencyId, ItemComponent.altCurrencyCost as alternateCost, ItemComponent.commendationLOT as commendationCurrencyId, ItemComponent.commendationCost as commendationCost FROM ItemComponent JOIN ComponentsRegistry ON ComponentsRegistry.component_id = ItemComponent.id AND  component_type = ${ITEM_COMPONENT} AND ComponentsRegistry.id WHERE ItemComponent.commendationLOT IS NOT NULL`;
      }

      this.db.all(query,
        (_, rows) => {
          const map = rows.map((item) => {
            return {
              id: item.id,
              currency: { id: 163, name: 'Coins' }, // default coin
              cost: vendorId === HONOR_ACCOLADE ? 0 : item.cost,
              name: this.locale.getObjectName(item.id),
              alternateCurrency: { id: item.alternateCurrencyId, name: item?.alternateCurrencyId ? this.locale.getObjectName(item.alternateCurrencyId) : 'Faction Token' },
              alternateCost: item.alternateCost || 0,
              commendationCurrency: { id: item.commendationCurrencyId, name: 'Faction Token' },
              commendationCost: item.commendationCost || 0,
            };
          });
          resolve(map);
        });
    });
  }

  async getIdsOfVendorsThatSellItem(itemId: number): Promise<number[]> {
    return new Promise<number[]>((resolve) => {
      const query = `SELECT id FROM ComponentsRegistry WHERE component_type = ${VENDOR_COMPONENT} AND component_id IN (SELECT id from VendorComponent WHERE LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) ))`;
      this.db.all(query,
        (_, rows: any[]) => {
          const map = rows.map((e) => e.id);
          resolve(map);
        });
    });
  }

  async getCommendationVendor(itemId: number): Promise<number[]> {
    return new Promise<number[]>((resolve) => {
      const query = `select * from ItemComponent where id = (select component_id from ComponentsRegistry where component_type = ${ITEM_COMPONENT} and id = ${itemId})`;
      this.db.all(query,
        (_, rows: any[]) => {
          const map = rows.map((e) => e.id);
          resolve([]);
        });
    });
  }

  async getItemsWithRarityInLootTable(lootTable: number): Promise<number> {
    return new Promise<number>((resolve) => {
      this.db.get(
        `SELECT itemid as id, ItemComponent.rarity FROM LootTable JOIN ItemComponent ON ItemComponent.id = (SELECT component_id FROM ComponentsRegistry WHERE id = LootTable.itemid AND component_type = ${ITEM_COMPONENT}) WHERE LootTable.LootTableIndex = ${lootTable};`,
        (_, row: any) => {
          resolve(row?.RarityCount || 0);
        },
      );
    });
  }

  async getMissionsThatRewardItem(itemId: number): Promise<MissionReward[]> {
    return new Promise<MissionReward[]>((resolve) => {
      this.db.all(
        `SELECT id, defined_type as type, defined_subtype as subtype, reward_item1, reward_item2, reward_item3, reward_item4, reward_item1_count, reward_item2_count, reward_item3_count, reward_item4_count FROM Missions WHERE reward_item1 = ${itemId} OR reward_item2 = ${itemId} OR reward_item3 = ${itemId} OR reward_item4 = ${itemId};`,
        (_, rows) => {
          let count = 0;

          rows = rows.map((row) => {
            if (itemId === row.reward_item1) count = row.reward_item1_count;
            else if (itemId === row.reward_item2) count = row.reward_item2_count;
            else if (itemId === row.reward_item3) count = row.reward_item3_count;
            else if (itemId === row.reward_item4) count = row.reward_item4_count;

            return {
              id: row.id,
              type: row.type,
              subtype: row.subtype,
              name: this.locale.getMissionName(row.id),
              description: this.locale.getMissionDescription(row.id),
              rewardCount: count,
            };
          });

          rows = rows.filter((r) => r.rewardCount > 0);
          resolve(rows);
        },
      );
    });
  }

  async getMissionsFromNPC(npcId: number): Promise<NPCMission[]> {
    return new Promise<NPCMission[]>((resolve) => {
      this.db.all(
        `SELECT * FROM Missions WHERE offer_objectID = ${npcId};`,
        (_, rows: Missions[]) => {
          const missions: NPCMission[] = rows.map((row) => {
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
              giver: { id: row.offer_objectID, name: this.locale.getObjectName(row.offer_objectID) },
              accepter: { id: row.target_objectID, name: this.locale.getObjectName(row.target_objectID) },
            };
          });
          resolve(missions);
        },
      );
    });
  }

  async getEnemyHealth(enemyId: number): Promise<EnemyHealth> {
    return new Promise<EnemyHealth>((resolve) => {
      this.db.get(
        `SELECT * FROM DestructibleComponent WHERE id = (SELECT component_id FROM ComponentsRegistry WHERE component_type = ${DESTRUCTIBLE_COMPONENT} AND id = ${enemyId})`,
        (_, row: EnemyHealth) => {
          resolve(row);
        },
      );
    });
  }

  async getMission(missionId: number): Promise<Missions> {
    return new Promise<Missions>((resolve) => {
      this.db.get(
        `SELECT * FROM Missions WHERE id = ${missionId}`,
        (_, row: Missions) => {
          resolve(row);
        },
      );
    });
  }

  async getActivitiesThatDropItem(itemId: number, rarity: number): Promise<ActivityDropFromQuery[]> {
    return new Promise<ActivityDropFromQuery[]>((resolve) => {
      this.db.all(
        `SELECT ActivityRewards.objectTemplate as id, ActivityRewards.description as activityName, LootTableIndex as lootTableIndex, LootMatrix.LootMatrixIndex as lootMatrixIndex, LootMatrix.RarityTableIndex as rarityIndex, LootMatrix.percent, LootMatrix.minToDrop, LootMatrix.maxToDrop, RarityTable.randmax, RarityTable.rarity FROM ActivityRewards JOIN LootMatrix ON LootMatrix.LootMatrixIndex = ActivityRewards.LootMatrixIndex AND LootMatrix.LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId}) JOIN RarityTable ON RarityTable.RarityTableIndex = LootMatrix.RarityTableIndex AND (RarityTable.rarity = ${rarity} OR RarityTable.rarity = ${rarity - 1}) WHERE ActivityRewards.LootMatrixIndex IN ( SELECT LootMatrixIndex FROM LootMatrix WHERE LootTableIndex IN ( SELECT LootTableIndex FROM LootTable WHERE itemid = ${itemId} ) ) `,
        (_, rows: ActivityDropFromQuery[]) => {
          // need rows with proper chance (by subtracting percent of rarity-1)
          // basically this returns a set of rows in pairs of 2 where i just need the percent of the first one and must subtract it from percent of second one
          if (rarity === 1) resolve(rows);

          const newRows: ActivityDropFromQuery[] = [];
          let previousPercent = 0;
          for (const row of rows) {
            if (row.rarity !== rarity) {
              previousPercent = row.randmax;
            } else {
              row.randmax = row.randmax - previousPercent;
              newRows.push(row);
            }
          }
          resolve(newRows);
        },
      );
    });
  }

  async getRarityVarianceMap(): Promise<Map<number, number>> {
    return new Promise<Map<number, number>>(async (resolve) => {
      const query = `SELECT RarityTableIndex FROM RarityTable`;
      this.db.all(
        query,
        async (_, rows: RarityTable[]) => {
          const map = new Map<number, number>();
          for (const { RarityTableIndex: rti } of rows) {
            if (map.has(rti)) map.set(rti, map.get(rti) + 1);
            else map.set(rti, 1);
          }
          return map;
        },
      );
    });
  }

  async getLevelData(level: number): Promise<LevelData> {
    return new Promise<LevelData>(async (resolve) => {
      const query = `select * from LevelProgressionLookup where id = ${level} or id = ${level - 1}`;
      this.db.all(
        query,
        async (_, rows: LevelProgressionLookup[]) => {
          const info: LevelData = {
            level: level,
            experienceFromLevel0: rows.find((row) => row.id === level)?.requiredUScore,
            experienceFromPreviousLevel: rows.find((row) => row.id === level)?.requiredUScore - (rows.find((row) => row.id === level - 1)?.requiredUScore || 0),
          };
          resolve(info);
        },
      );
    });
  }

  async getMaxLevel(): Promise<number> {
    return new Promise<number>(async (resolve) => {
      const query = `select max(id) as id from LevelProgressionLookup`;
      this.db.get(
        query,
        async (_, row: LevelProgressionLookup) => {
          resolve(row.id);
        },
      );
    });
  }

  async searchItem(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE ${HQ_valid} type='Loot' AND Objects.id IN(SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.component_type = ${ITEM_COMPONENT}) AND (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }

  // ! problem: locale grabs any match, not just items
  async searchItemWithLocale(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE ${HQ_valid} type='Loot' AND Objects.id IN(SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.component_type = ${ITEM_COMPONENT}) AND (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') LIMIT 25`,
        (_, rows: Objects[]) => {
          // cdclient matches
          let cdclientPairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          // locale matches
          const localePairs = this.locale.searchObjects(phrase);
          // remove from cdclient what is already found in locale
          cdclientPairs = cdclientPairs.filter((pair) => localePairs.every(({ value }) => pair.value !== value));
          // locale matches first, then cdclient matches
          const pairs = [...localePairs, ...cdclientPairs].slice(0, 25);
          resolve(pairs);
        });
    });
  }

  async searchPackage(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE ${HQ_valid} Objects.id IN(SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.component_type = ${PACKAGE_COMPONENT}) AND (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }

  async searchSmashable(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE Objects.id IN(SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.component_type = ${DESTRUCTIBLE_COMPONENT}) AND (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }

  async searchEnemy(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE Objects.type = 'Enemies' AND (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }

  async searchVendor(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      const statement =
        `SELECT id, name, displayName FROM Objects WHERE Objects.id IN (SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.component_type = ${VENDOR_COMPONENT}) AND (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') LIMIT 25`;
      console.log('📝 ~ file: cdclient.ts ~ line 1035 ~ CDClient ~ searchVendor ~ statement', statement);
      this.db.all(
        statement,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }

  async searchMissionNPC(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE Objects.id IN (SELECT id FROM ComponentsRegistry WHERE ComponentsRegistry.component_type = ${MISSION_OFFER_COMPONENT}) AND (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }

  async searchBrick(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      const HQ_valid = HQValidOnly ? 'HQ_valid = 1 AND' : '';
      this.db.all(
        `SELECT id, name, displayName FROM Objects WHERE ${HQ_valid} (displayName LIKE '${sqlike(phrase)}' OR name LIKE '${sqlike(phrase)}') AND Objects.type = 'LEGO brick' LIMIT 25`,
        (_, rows: Objects[]) => {
          const pairs: NameValuePair[] = rows?.map((row: Objects) => {
            return {
              name: `${row.displayName || row.name} [${row.id}]`,
              value: row.id.toString(),
            };
          });
          resolve(pairs);
        });
    });
  }

  async searchActivity(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      this.db.all(
        `SELECT * FROM ActivityRewards WHERE description LIKE '${sqlike(phrase)}' LIMIT 25`,
        (_, rows: ActivityRewards[]) => {
          const pairs: NameValuePair[] = rows?.map((row) => {
            return {
              name: `${this.locale.getActivityName(row.objectTemplate)} > ${row.description} [${row.objectTemplate}]`,
              value: `${row.objectTemplate};${row.description}`,
            };
          });
          resolve(pairs);
        });
    });
  }

  async searchFullActivity(phrase: string): Promise<NameValuePair[]> {
    return new Promise<NameValuePair[]>((resolve) => {
      this.db.all(
        `SELECT * FROM ActivityRewards`,
        (_, rows: ActivityRewards[]) => {
          const newRows: ActivityRewards[] = [];
          const re = new RegExp(`${phrase.replace(/[^A-z0-9]/gim, '.*')}`, 'gi');
          for (const row of rows) {
            if (row.description.match(re) || this.locale.getActivityName(row.objectTemplate).match(re)) {
              newRows.push(row);
              if (newRows.length === 25) break;
            }
          }

          const isActivityRegex = new RegExp('Activities_\\d+_ActivityName', 'gm');
          const pairs: NameValuePair[] = newRows?.map((row) => {
            const activityName = this.locale.getActivityName(row.objectTemplate);
            let title = !activityName.match(isActivityRegex) ? `${activityName} > ` : '';
            title += `${row.description} [${row.objectTemplate}]`;
            return {
              name: title,
              value: `${row.objectTemplate};${row.description}`,
            };
          });
          resolve(pairs);
        });
    });
  }


  async isFromActivity(itemId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.db.get(
        `SELECT objectTemplate FROM ActivityRewards WHERE ActivityRewards.LootMatrixIndex IN (SELECT LootMatrix.LootMatrixIndex FROM LootMatrix WHERE LootMatrix.LootTableIndex IN (SELECT LootTable.LootTableIndex FROM LootTable WHERE itemid=${itemId}))`,
        (_, row: ActivityRewards) => {
          resolve(!!row?.objectTemplate);
        });
    });
  }
  async isFromMission(itemId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.db.get(
        `SELECT id FROM Missions WHERE reward_item1 = ${itemId} OR reward_item2 = ${itemId} OR reward_item3 = ${itemId} OR reward_item4 = ${itemId};`,
        (_, row: Missions) => {
          resolve(!!row?.id);
        });
    });
  }
  async isFromPackage(itemId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.db.get(
        `SELECT id FROM PackageComponent WHERE PackageComponent.LootMatrixIndex IN (SELECT LootMatrix.LootMatrixIndex FROM LootMatrix WHERE LootMatrix.LootTableIndex IN (SELECT LootTable.LootTableIndex FROM LootTable WHERE itemid=${itemId}))`,
        (_, row: PackageComponent) => {
          resolve(!!row?.id);
        });
    });
  }
  async isFromSmashable(itemId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.db.get(
        `SELECT id FROM DestructibleComponent WHERE DestructibleComponent.LootMatrixIndex IN (SELECT LootMatrix.LootMatrixIndex FROM LootMatrix WHERE LootMatrix.LootTableIndex IN (SELECT LootTable.LootTableIndex FROM LootTable WHERE itemid=${itemId}))`,
        (_, row: DestructibleComponent) => {
          resolve(!!row?.id);
        });
    });
  }
  async isFromVendor(itemId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.db.get(
        `SELECT id FROM VendorComponent WHERE VendorComponent.LootMatrixIndex IN (SELECT LootMatrix.LootMatrixIndex FROM LootMatrix WHERE LootMatrix.loottableindex IN (SELECT loottable.loottableindex FROM loottable WHERE itemid=${itemId}))`,
        (_, row: Objects) => {
          resolve(!!row?.id);
        });
    });
  }
}
