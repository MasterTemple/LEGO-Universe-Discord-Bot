export interface locale {
  key:string;
  value:string;
}

export interface ItemStats {
  armor:number;
  health:number;
  imagination:number;
}

export interface Skill {
  id:number;
  behavior_id:number;
  on_equip:boolean;
  imagination_cost:number;
  cooldown_group:number;
  cooldown_time:number;
  armor_bonus:number;
  health_bonus:number;
  imagination_bonus:number;
}

export interface ObjectElement {
  id:number;
  name:string;
}

export interface ItemPrecondition {
  id:number;
  description:string;
}

export type EquipLocation = "Head" | "Chest" | "Legs" | "Right Hand" | "Left Hand" | "Armor" | "Consumable" | "Unknown"

export interface ItemComponent {
  proxy_items:ObjectElement[];
  equip_locations:EquipLocation[];
  buy_price:number;
  rarity:number;
  stack_size:number;
  color:number;
  preconditions:ItemPrecondition[];
  two_handed:boolean;
  alternate_currency_id:number;
  alternate_currency_cost: number;
  alternate_currency_name: string;
  commendation_currency_id:number;
  commendation_currency_cost:number;
  commendation_currencyname:string;
  is_weapon:boolean;
  level_requirement:number;
}

export interface ItemDrop {
  LootMatrixIndex:number;
  RarityTableIndex:number;
  percent:number;
  minToDrop:number;
  maxToDrop:number;
  destructibleComponents:number[];
  destructibleIds:number[];
  destructibleNames:string[];
  packageComponents:number[];
  packageIds:number[];
  packageNames:string[];
}

export interface MissionReward {
  id:number;
  name:string;
  count:number;
}

export interface NPCMission {
  id:number;
  name:string;
  description:string;
  repeatable:boolean;
  rewards:MissionReward[];
}

export interface SoldItem {
  id:number;
  name:string;
  cost:number;
}