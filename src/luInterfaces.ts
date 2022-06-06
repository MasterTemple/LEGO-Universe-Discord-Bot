export type localeXMLType = "Activities_ID_ActivityName" | "ItemSets_ID_kitName" | "MissionEmail_ID_announceText" | "MissionEmail_ID_bodyText" | "MissionEmail_ID_senderName" | "MissionEmail_ID_subjectText" | "MissionTasks_ID_description" | "MissionText_ID_accept_chat_bubble" | "MissionText_ID_chat_state_1" | "MissionText_ID_chat_state_2" | "MissionText_ID_chat_state_3_turnin" | "MissionText_ID_completion_succeed_tip" | "MissionText_ID_in_progress" | "MissionText_ID_offer" | "MissionText_ID_ready_to_complete" | "MissionText_ID_description" | "MissionText_ID_chat_state_3" | "MissionText_ID_chat_state_4" | "MissionText_ID_chat_state_4_turnin" | "MissionText_ID_offer_repeatable" | "Missions_ID_name" | "Objects_ID_description" | "Objects_ID_name" | "Preconditions_ID_FailureReason" | "SkillBehavior_ID_descriptionUI" | "SkillBehavior_ID_name"

export interface LootDropFirstQuery {
  enemyId: number;
  lootTableIndex: number;
  lootMatrixIndex: number;
  rarityIndex: number;
  percent: number;
  minToDrop: number;
  maxToDrop: number;
  randmax: number;
  rarity: number;
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

export type EquipLocation = 'Head' | 'Chest' | 'Legs' | 'Right Hand' | 'Left Hand' | 'Armor' | 'Consumable' | 'Unknown'

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

export interface MissionReward {
  id: number;
  name: string;
  count: number;
}

export interface NPCMission {
  id: number;
  name: string;
  description: string;
  repeatable: boolean;
  rewards: MissionReward[];
}

export interface SoldItem {
  id: number;
  name: string;
  cost: number;
}
