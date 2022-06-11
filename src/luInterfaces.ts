
export interface ActivityDropFromQuery {
  id: number;
  activityName: string;
  lootTableIndex: number;
  lootMatrixIndex: number;
  rarityIndex: number;
  percent: number;
  minToDrop: number;
  maxToDrop: number;
  randmax: number;
  rarity: number;
}

export interface EnemyHealth {
  life: number;
  armor: number;
}

export interface SkillDescription {
  name: string;
  description: string;
}

// export interface NPCMission {
//   id: number;
//   type: string;
//   subtype: string;
//   name: string;
//   description: string;
// }
export interface MissionReward {
  id: number;
  type: string;
  subtype: string;
  name: string;
  description: string;
  rewardCount: number;
}

export interface ItemSold {
  id: number;
  name: string;
  currency: ObjectElement;
  cost: number;
  alternateCurrency: ObjectElement;
  alternateCost: number;
  commendationCurrency: ObjectElement;
  commendationCost: number;
}

export interface LootDropFirstQuery {
  objectId: number;
  lootTableIndex: number;
  lootMatrixIndex: number;
  rarityIndex: number;
  percent: number;
  minToDrop: number;
  maxToDrop: number;
  randmax: number;
  rarity: number;
}

export interface SmashableDrop {
  lootTableIndex: number;
  chanceForItem: number;
  minToDrop: number;
  maxToDrop: number;
  chanceForRarity: number;
  rarity: number;
  poolSize: number;
}

export interface LootDrop {
  smashables: ObjectElement[];
  chanceForDrop: number;
  minToDrop: number;
  maxToDrop: number;
  chanceForRarity: number;
  chanceForItemInLootTable: number;
  chance: number;
}

export interface locale {
  key: string;
  value: string;
}

export interface ItemStats {
  armor: number;
  health: number;
  imagination: number;
}

export enum queryType {
  destroyable = 7,
  skill = 9,
  vendor = 16,
  item = 11,
  package = 53
}
export interface EnemyDrop {
  LootTableIndex: number;
  RarityTableIndex: number;
  percent: number;
  minToDrop: number;
  maxToDrop: number;
  rarity: number;
  randmax: number;
  ItemCount: number;
}
export interface Skill {
  id: number;
  behaviorId: number;
  onEquip: boolean;
  imaginationCost: number;
  cooldownGroup: number;
  cooldownTime: number;
  armorBonus: number;
  healthBonus: number;
  imaginationBonus: number;
}

export interface ObjectElement {
  id: number;
  name: string;
}
export interface NameValuePair {
  name: string;
  value: string;
}

export interface ItemPrecondition {
  id: number;
  description: string;
}

export type EquipLocation = 'Head' | 'Chest' | 'Legs' | 'Right Hand' | 'Left Hand' | 'Armor' | 'Consumable' | 'Unknown';

export interface ItemComponent {
  proxyItems: ObjectElement[];
  equipLocations: EquipLocation[];
  buyPrice: number;
  rarity: number;
  stackSize: number;
  color: number;
  preconditions: ItemPrecondition[];
  twoHanded: boolean;
  alternateCurrencyId: number;
  alternateCurrencyCost: number;
  alternateCurrencyName: string;
  commendationCurrencyId: number;
  commendationCurrencyCost: number;
  commendationCurrencyName: string;
  isWeapon: boolean;
  levelRequirement: number;
}

export interface ItemDrop {
  LootTableIndex: number;
  LootMatrixIndex: number;
  RarityTableIndex: number;
  rarityChance: number;
  itemsInLootTable: number;
  percent: number;
  minToDrop: number;
  maxToDrop: number;
  destructibleComponents: number[];
  enemies: ObjectElement[];
  packageComponents: number[];
  packages: ObjectElement[];
  totalChance: number;
}

export interface NPCMissionReward {
  id: number;
  name: string;
  count: number;
}

export interface NPCMission {
  id: number;
  type: string;
  subtype: string;
  name: string;
  description: string;
  isRepeatable: boolean;
  rewards: NPCMissionReward[];
  isAchievement: boolean;
  giver: ObjectElement;
  accepter: ObjectElement;
}

export interface SoldItem {
  id: number;
  name: string;
  cost: number;
}


export interface LootTableItem {
  id: number;
  name: string;
  rarity: number;
}

export interface HowToGet {
  isFromMission: boolean;
  isFromSmashable: boolean;
  isFromPackage: boolean;
  isFromActivity: boolean;
  isFromVendor: boolean;
}

export type UnofficialType = "LootTableName";

export type localeXMLType = "Activities_ID_ActivityName" | "ItemSets_ID_kitName" | "MissionEmail_ID_announceText" | "MissionEmail_ID_bodyText" | "MissionEmail_ID_senderName" | "MissionEmail_ID_subjectText" | "MissionTasks_ID_description" | "MissionText_ID_accept_chat_bubble" | "MissionText_ID_chat_state_1" | "MissionText_ID_chat_state_2" | "MissionText_ID_chat_state_3_turnin" | "MissionText_ID_completion_succeed_tip" | "MissionText_ID_in_progress" | "MissionText_ID_offer" | "MissionText_ID_ready_to_complete" | "MissionText_ID_description" | "MissionText_ID_chat_state_3" | "MissionText_ID_chat_state_4" | "MissionText_ID_chat_state_4_turnin" | "MissionText_ID_offer_repeatable" | "Missions_ID_name" | "Objects_ID_description" | "Objects_ID_name" | "Preconditions_ID_FailureReason" | "SkillBehavior_ID_descriptionUI" | "SkillBehavior_ID_name";
