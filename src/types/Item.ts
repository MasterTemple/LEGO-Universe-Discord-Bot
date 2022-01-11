import {Database} from 'sqlite3';
import {CDClient, ITEM_COMPONENT} from '../cdclient';
import {ComponentsRegistry, ObjectSkills, SkillBehavior} from '../cdclientInterfaces';
import {
  ItemStats,
  Skill,
  ItemComponent,
  ItemDrop,
  ObjectElement,
  EquipLocation,
  ItemPrecondition} from '../luInterfaces';
import {explorerDomain} from '../config.json';

export class Item extends CDClient {
  db:Database;
  id:number;
  name:string;
  components:ComponentsRegistry[];
  stats:ItemStats;
  skills:Skill[];
  itemComponent:ItemComponent;
  drop:ItemDrop[];
  // earn
  // buy
  constructor(cdclient:CDClient, id:number) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.components = await this.getComponents(this.id);
    this.name = (await this.getObjectName(this.id)).name;

    await this.addItemComponent();
    await this.addDrops();
    await this.addItemStats();
  }

  getURL(id:number = this.id):string {
    return `${explorerDomain}/objects/${id}`;
  }

  async getRarityChance(drop:ItemDrop):Promise<number> {
    const thisRarity = await this.getPercentToDropRarity(drop.RarityTableIndex, this.itemComponent.rarity);
    if (this.itemComponent.rarity - 1 === 0) {
      return thisRarity;
    } else {
      const lowerRarity = await this.getPercentToDropRarity(drop.RarityTableIndex, this.itemComponent.rarity - 1);
      return thisRarity - lowerRarity;
    }
  }

  async getItemsInLootTableOfRarity(lootTable:number, rarity:number):Promise<number> {
    const itemIds = await this.getItemsInLootTable(lootTable);
    const itemCompIds = await Promise.all(itemIds.map((id) => this.getItemComponentId(id)));
    let rarities = await Promise.all(itemCompIds.map((compId) => this.getItemRarity(compId)));
    rarities = rarities.filter((r) => r === rarity);
    return rarities.length;
  }

  async addDrops():Promise<void> {
    const ltis = await this.getItemLootTables(this.id);
    const lmis = await this.getLootMatricesFromLootTables(ltis);
    this.drop = await Promise.all(lmis.map((lmi) => this.addDestructibleComponentToLootMatrix(lmi)));
    for (const drop of this.drop) {
      drop.rarityChance = await this.getRarityChance(drop);
      const destructibleIds = this.removeUndefined(
          await Promise.all(drop.destructibleComponents.map((comp) => this.getIdFromDestructibleComponent(comp))),
      );
      drop.enemies = await Promise.all(destructibleIds.map((id) => this.getObjectName(id)));

      drop.itemsInLootTable = await this.getItemsInLootTableOfRarity(drop.LootTableIndex, this.itemComponent.rarity);
      if (drop.itemsInLootTable === 0 || drop.rarityChance === 0) {
        drop.totalChance = 0;
      } else {
        drop.totalChance = (drop.percent) * (drop.rarityChance) * (1 / drop.itemsInLootTable);
      }
    }
    this.drop = this.drop.sort((a, b) => b.totalChance - a.totalChance);
  }

  async getProxyItemsFromSubItems(subItems:string):Promise<ObjectElement[]> {
    if (subItems === null) return [];
    else {
      const ids:number[] = subItems.match(/\d+/g).map((num:string) => parseInt(num));
      const proxies:ObjectElement[] = await Promise.all(ids.map((id:number) => this.getObjectName(id)));
      return proxies;
    }
  }

  getEquipLocations(rawLocations:string[]):EquipLocation[] {
    const locations:EquipLocation[] = [];
    for (const loc of rawLocations) {
      if (loc === 'clavicle') {
        locations.push('Armor');
      } else if (loc === 'hair') {
        locations.push('Head');
      } else if (loc === 'legs') {
        locations.push('Legs');
      } else if (loc === 'chest') {
        locations.push('Chest');
      } else if (loc === 'special_r') {
        locations.push('Right Hand');
      } else if (loc === 'special_l') {
        locations.push('Left Hand');
      } else if (loc === null) {
        locations.push('Consumable');
      }
    }
    return locations;
  }

  getEquipLocation(rawLocation:string):EquipLocation {
    if (rawLocation === 'clavicle') {
      return 'Armor';
    } else if (rawLocation === 'hair') {
      return 'Head';
    } else if (rawLocation === 'legs') {
      return 'Legs';
    } else if (rawLocation === 'chest') {
      return 'Chest';
    } else if (rawLocation === 'special_r') {
      return 'Right Hand';
    } else if (rawLocation === 'special_l') {
      return 'Left Hand';
    } else if (rawLocation === null) {
      return 'Consumable';
    } else {
      return 'Unknown';
    }
  }

  async addPreconditionDescription(id:number):Promise<ItemPrecondition> {
    return new Promise<ItemPrecondition>((resolve, reject) => {
      resolve({
        id: id,
        description: 'description',
      });
    });
  }

  async getPreconditions(preconditionsString:string):Promise<ItemPrecondition[]> {
    if (preconditionsString === null) return [];
    else {
      const preconditionIds = preconditionsString.match(/\d+/g).map((n) => parseInt(n));

      const preconditions = await Promise.all(preconditionIds.map((id) => this.addPreconditionDescription(id)));
      return preconditions;
    }
  }

  async getLevelRequirementFromPreconditions(preconditionsString:string):Promise<number> {
    const preconditionIds = preconditionsString.split(',').map((p) => parseInt(p));
    const levelRequirement = await this.locale.getLevelRequirement(preconditionIds);
    return levelRequirement;
  }

  async getAllEquipLocations(ids:number[]):Promise<string[]> {
    const components = await Promise.all(ids.map((id) => this.getComponents(id)));
    const itemComponents = components.map((comp) => comp.find((c) => c.componentType === ITEM_COMPONENT).componentId);
    const equipLocations = await Promise.all(itemComponents.map((comp) => this.getEquipLocationFromCompId(comp)));
    return equipLocations;
  }

  async addItemComponent():Promise<void> {
    const rawItemComponent = await this.getItemComponent(
        this.components.find((f) => f.componentType === ITEM_COMPONENT).componentId,
    );
    const proxyItems:ObjectElement[] = await this.getProxyItemsFromSubItems(rawItemComponent.subItems);

    const allItemIds = [this.id, ...proxyItems.map((item) => item.id)];

    const equipLocations:string[] = await this.getAllEquipLocations(allItemIds);

    const equipLocationNames:EquipLocation[] = this.getEquipLocations(equipLocations);
    let alternateCurrencyName:string = null;
    if (rawItemComponent.currencyLOT) {
      alternateCurrencyName = (await this.getObjectName(rawItemComponent.currencyLOT)).name;
    }
    let commendationCurrencyName:string = null;
    if (rawItemComponent.commendationLOT) {
      commendationCurrencyName = (await this.getObjectName(rawItemComponent.commendationLOT)).name;
    }
    this.itemComponent = {
      proxyItems: proxyItems,
      equipLocations: equipLocationNames,
      buyPrice: rawItemComponent.baseValue,
      rarity: rawItemComponent.rarity,
      stackSize: rawItemComponent.stackSize,
      color: rawItemComponent.color1,
      preconditions: await this.getPreconditions(rawItemComponent.reqPrecondition),
      twoHanded: equipLocationNames.includes('Right Hand') && equipLocationNames.includes('Left Hand'),
      alternateCurrencyId: rawItemComponent.currencyLOT,
      alternateCurrencyCost: rawItemComponent.altCurrencyCost,
      alternateCurrencyName: alternateCurrencyName,
      commendationCurrencyId: rawItemComponent.commendationLOT,
      commendationCurrencyCost: rawItemComponent.commendationCost,
      commendationCurrencyName: commendationCurrencyName,
      isWeapon: equipLocationNames.includes('Right Hand'), // rawItemComponent.,
      levelRequirement: await this.getLevelRequirementFromPreconditions(
          rawItemComponent.reqPrecondition), // rawItemComponent.,
    };
  }
  async getSkill(objectSkill:ObjectSkills):Promise<Skill>{
    let skill = await this.getSkillBehavior(objectSkill.skillID)

    return {
      id: objectSkill.skillID,
      behaviorId: skill.behaviorID,
      onEquip: !objectSkill.AICombatWeight,
      imaginationCost: skill.imaginationcost,
      cooldownGroup: skill.cooldowngroup,
      cooldownTime: skill.cooldown,
      armorBonus: skill.armorBonusUI,
      healthBonus: skill.lifeBonusUI,
      imaginationBonus: skill.imBonusUI,
    }
  }
  async addItemStats():Promise<void>{
      let objectSkills = await this.getObjectSkills(this.id)
      this.skills = await Promise.all(objectSkills.map((skill) => this.getSkill(skill)))
      console.log(this.skills);

      this.stats = {
        armor: this.skills.find(({armorBonus}) => armorBonus !== null)?.armorBonus || 0,
        health: this.skills.find(({healthBonus}) => healthBonus !== null)?.healthBonus || 0,
        imagination: this.skills.find(({imaginationBonus}) => imaginationBonus !== null)?.imaginationBonus || 0,
      }

  }
}
