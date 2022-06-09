import { Database } from 'sqlite3';
import { CDClient, ITEM_COMPONENT, RENDER_COMPONENT } from '../cdclient';
import { ComponentsRegistry, Objects, ObjectSkills, RenderComponent, SkillBehavior } from '../cdclientInterfaces';
import {
  ItemStats,
  Skill,
  ItemComponent,
  ItemDrop,
  ObjectElement,
  EquipLocation,
  ItemPrecondition,
  LootDrop,
  MissionReward,
  SmashableDrop,
} from '../luInterfaces';
import { explorerDomain } from '../config.json';

export class Item extends CDClient {
  db: Database;
  id: number;
  name: string;
  imageURL: string;
  components: ComponentsRegistry[];
  stats: ItemStats;
  skills: Skill[];
  itemComponent: ItemComponent;
  drop: LootDrop[] = [];
  unpack: LootDrop[] = [];
  buy: ObjectElement[] = [];
  reward: MissionReward[] = [];
  packageDrops: SmashableDrop[] = [];
  objectData: Objects;
  // earn
  // buy
  constructor(cdclient: CDClient, id: number) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.components = await this.getComponents(this.id);
    this.name = (await this.getObjectName(this.id));
    this.imageURL = await this.thumbnail()
    await this.addItemComponent();
    // await this.addDrops();
    await this.addItemStats();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/objects/${id}`;
  }

  async thumbnail(id: number = this.id): Promise<string> {
    return `${explorerDomain}${await this.getIconAsset(id)}`
  }

  async addPackageDrops(): Promise<void> {
    this.packageDrops = await this.getPackageDrops(this.id);
  }

  async getRarityChance(drop: ItemDrop): Promise<number> {
    const thisRarity = await this.getPercentToDropRarity(drop.RarityTableIndex, this.itemComponent.rarity);
    if (this.itemComponent.rarity - 1 === 0) {
      return thisRarity;
    } else {
      const lowerRarity = await this.getPercentToDropRarity(drop.RarityTableIndex, this.itemComponent.rarity - 1);
      return thisRarity - lowerRarity;
    }
  }

  async addMissionRewards(): Promise<void> {
    this.reward = await this.getMissionsThatRewardItem(this.id);
  }

  async addVendors(): Promise<void> {
    let vendorIds = await this.getIdsOfVendorsThatSellItem(this.id);
    // this.buy = await Promise.all(vendorIds.map((id) => this.getObjectElementFromLocale(id)))
    this.buy = vendorIds.map((id) => this.getObjectElementFromLocale(id))
    this.buy = this.buy.filter((b) => b?.name)
  }

  async addUnpacks(): Promise<void> {
    let rawLootDrops = await this.dropItemFromPackage(this.id, this.itemComponent.rarity);

    const packageToLMIMap = await this.getPackagesAndLootMatrixForLoot(this.id);
    rawLootDrops = rawLootDrops.filter((v) => packageToLMIMap.get(v.objectId) === v.lootMatrixIndex);
    const lootTableRaritySizes = new Map<number, number>();
    for (const value of rawLootDrops) {
      const element = this.unpack?.find((f) => f.chanceForDrop == value.percent && f.minToDrop == value.minToDrop && f.maxToDrop == value.maxToDrop && f.chanceForRarity == value.randmax);

      // if name is not in locale, then it is unused
      const name = this.locale.getObjectName(value.objectId);
      if (!name) continue;

      if (!element) {
        let ltiSize = lootTableRaritySizes?.get(value.lootTableIndex);
        if (!ltiSize) {
          ltiSize = await this.getItemsInLootTableOfRarity(value.lootTableIndex, value.rarity);
          lootTableRaritySizes.set(value.lootTableIndex, ltiSize);
        }
        this.unpack.push({
          smashables: [{
            id: value.objectId,
            name: name,
          }],
          chanceForDrop: value.percent,
          minToDrop: value.minToDrop,
          maxToDrop: value.maxToDrop,
          chanceForRarity: value.randmax,
          chanceForItemInLootTable: ltiSize,
          chance: value.percent * value.randmax * (1 / ltiSize),
        });
      } else {
        element.smashables.push({
          id: value.objectId,
          name: name,
        });
      }
    }
    // console.log(this.unpack)
  }

  async addDrops(): Promise<void> {
    let rawLootDrops = await this.dropItemFromEnemy(this.id, this.itemComponent.rarity);
    const enemyToLMIMap = await this.getEnemiesAndLootMatrixForLoot(this.id);
    rawLootDrops = rawLootDrops.filter((v) => enemyToLMIMap.get(v.objectId) === v.lootMatrixIndex);
    const lootTableRaritySizes = new Map<number, number>();
    for (const value of rawLootDrops) {
      const element = this.drop?.find((f) => f.chanceForDrop == value.percent && f.minToDrop == value.minToDrop && f.maxToDrop == value.maxToDrop && f.chanceForRarity == value.randmax);

      // if name is not in locale, then it is unused
      const name = this.locale.getObjectName(value.objectId);
      if (!name) continue;

      if (!element) {
        let ltiSize = lootTableRaritySizes?.get(value.lootTableIndex);
        if (!ltiSize) {
          ltiSize = await this.getItemsInLootTableOfRarity(value.lootTableIndex, value.rarity);
          lootTableRaritySizes.set(value.lootTableIndex, ltiSize);
        }
        this.drop.push({
          smashables: [{
            id: value.objectId,
            name: name,
          }],
          chanceForDrop: value.percent,
          minToDrop: value.minToDrop,
          maxToDrop: value.maxToDrop,
          chanceForRarity: value.randmax,
          chanceForItemInLootTable: ltiSize,
          chance: value.percent * value.randmax * (1 / ltiSize),
        });
      } else {
        element.smashables.push({
          id: value.objectId,
          name: name,
        });
      }
    }
  }

  async getProxyItemsFromSubItems(subItems: string): Promise<ObjectElement[]> {
    if (subItems === null) return [];
    else {
      const ids: number[] = subItems.match(/\d+/g).map((num: string) => parseInt(num));
      const proxies: ObjectElement[] = await Promise.all(ids.map((id: number) => this.getObjectElement(id)));
      return proxies;
    }
  }

  getEquipLocations(rawLocations: string[]): EquipLocation[] {
    const locations: EquipLocation[] = [];
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

  getEquipLocation(rawLocation: string): EquipLocation {
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

  // async addPreconditionDescription(id: number): Promise<ItemPrecondition> {
  //   return new Promise<ItemPrecondition>((resolve, reject) => {
  //     resolve({
  //       id: id,
  //       description: 'description',
  //     });
  //   });
  // }
  addPreconditionDescription(id: number): ItemPrecondition {
    return {
      id: id,
      description: this.locale.getPreconditionDescription(id),
    }
  }

  async getPreconditions(preconditionsString: string): Promise<ItemPrecondition[]> {
    if (preconditionsString === null) return [];
    else {
      const preconditionIds = preconditionsString.match(/\d+/g)?.map((n) => parseInt(n)) || [];

      // const preconditions = await Promise.all(preconditionIds.map((id) => this.addPreconditionDescription(id)));
      const preconditions = preconditionIds.map((id) => this.addPreconditionDescription(id));
      return preconditions;
    }
  }

  async getLevelRequirementFromPreconditions(preconditionsString: string): Promise<number> {
    const preconditionIds = preconditionsString?.split(',')?.map((p) => parseInt(p)) || [];
    const levelRequirement = await this.locale.getLevelRequirement(preconditionIds);
    return levelRequirement;
  }

  async getAllEquipLocations(ids: number[]): Promise<string[]> {
    const components = await Promise.all(ids.map((id) => this.getComponents(id)));
    const itemComponents = components.map((comp) => comp.find((c) => c.component_type === ITEM_COMPONENT).component_id);
    const equipLocations = await Promise.all(itemComponents.map((comp) => this.getEquipLocationFromCompId(comp)));
    return equipLocations;
  }

  async addItemComponent(): Promise<void> {
    const rawItemComponent = await this.getItemComponent(
      this.components.find((f) => f.component_type === ITEM_COMPONENT)?.component_id,
    );
    console.log("📝 ~ file: Item.ts ~ line 258 ~ Item ~ addItemComponent ~ rawItemComponent", rawItemComponent)
    if (!rawItemComponent) return;
    const proxyItems: ObjectElement[] = await this.getProxyItemsFromSubItems(rawItemComponent.subItems);

    const allItemIds = [this.id, ...proxyItems.map((item) => item.id)];

    const equipLocations: string[] = await this.getAllEquipLocations(allItemIds);

    const equipLocationNames: EquipLocation[] = this.getEquipLocations(equipLocations);
    let alternateCurrencyName: string = null;
    if (rawItemComponent.currencyLOT) {
      alternateCurrencyName = (await this.getObjectName(rawItemComponent.currencyLOT));
    }
    let commendationCurrencyName: string = null;
    if (rawItemComponent.commendationLOT) {
      commendationCurrencyName = (await this.getObjectName(rawItemComponent.commendationLOT));
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
  async getSkill(objectSkill: ObjectSkills): Promise<Skill> {
    const skill = await this.getSkillBehavior(objectSkill.skillID);

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
    };
  }
  async addItemStats(): Promise<void> {
    const objectSkills = await this.getObjectSkills(this.id);
    this.skills = await Promise.all(objectSkills.map((skill) => this.getSkill(skill)));
    // console.log(this.skills);

    this.stats = {
      armor: this.skills.find(({ armorBonus }) => armorBonus !== null)?.armorBonus || 0,
      health: this.skills.find(({ healthBonus }) => healthBonus !== null)?.healthBonus || 0,
      imagination: this.skills.find(({ imaginationBonus }) => imaginationBonus !== null)?.imaginationBonus || 0,
    };
  }
  async addObjectData(): Promise<void> {
    this.objectData = await this.getObjectData(this.id)
  }
}
