import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ComponentsRegistry } from "../cdclient_interfaces";
import { ItemStats, Skill, ItemComponent, ItemDrop, ObjectElement, EquipLocation, ItemPrecondition } from "../lu_interfaces"
import { RENDER_COMPONENT, DESTRUCTIBLE_COMPONENT, ITEM_COMPONENT, VENDOR_COMPONENT, PACKAGE_COMPONENT} from "../cdclient"

export class Item extends CDClient{
  db:Database;
  id:number;
  name:string;
  components:ComponentsRegistry[];
  stats:ItemStats;
  skills:Skill[];
  item_component:ItemComponent;
  drop:ItemDrop[];
  //earn
  //buy
  constructor(db:Database, id:number){
    super();
    this.db = db;
    this.id = id;
  }
  async create(): Promise<void> {
      return new Promise<void>(async(resolve, reject) => {
        this.components = await this.getComponents(this.id)
        this.name = await this.getObjectName(this.id)
        // this.stats = await this.getItemStats()
        this.item_component = await this.addItemComponent()
        // console.log();

        resolve()
      })
  }
  async getProxyItemsFromSubItems(subItems):Promise<ObjectElement[]> {
    return new Promise<ObjectElement[]>((resolve, reject) => {
      resolve([])
    })
  }
  getEquipLocations(raw_locations:string[]):EquipLocation[]{
    let locations:EquipLocation[] = []
    for(let loc of raw_locations){
      if(loc === "clavicle"){
        locations.push("Armor")
      }
      else if(loc === "hair"){
        locations.push("Head")
      }
      else if(loc === "legs"){
        locations.push("Legs")
      }
      else if(loc === "chest"){
        locations.push("Chest")
      }
      else if(loc === "special_r"){
        locations.push("Right Hand")
      }
      else if(loc === "special_r"){
        locations.push("Left Hand")
      }
      else if(loc === null){
        locations.push("Consumable")
      }
    }
    return locations
  }
  getEquipLocation(raw_location:string):EquipLocation{
      if(raw_location === "clavicle"){
        return "Armor"
      }
      else if(raw_location === "hair"){
        return "Head"
      }
      else if(raw_location === "legs"){
        return "Legs"
      }
      else if(raw_location === "chest"){
        return "Chest"
      }
      else if(raw_location === "special_r"){
        return "Right Hand"
      }
      else if(raw_location === "special_r"){
        return "Left Hand"
      }
      else if(raw_location === null){
        return "Consumable"
      }
      else {
        return "Unknown"
      }
  }
  async addPreconditionDescription(id:number):Promise<ItemPrecondition>{
    return new Promise<ItemPrecondition>((resolve, reject) => {
      resolve({
        id: id,
        description: 'description'
      })
    })
  }
  async getPreconditions(preconditions_string:string):Promise<ItemPrecondition[]>{
    return new Promise<ItemPrecondition[]>(async(resolve, reject) => {

      let precondition_ids = preconditions_string.match(/\d+/).map(n => parseInt(n))
      let preconditions:ItemPrecondition[] = await Promise.all(precondition_ids.map((id) => this.addPreconditionDescription(id)))
      resolve(preconditions)
    })
  }
  async getLevelRequirementFromPreconditions(preconditions_string:string):Promise<number> {
    return new Promise<number>((resolve, reject) => {
      resolve(999)
    })
  }
  async addItemComponent():Promise<ItemComponent>{
    return new Promise<ItemComponent>(async (resolve, reject) => {

      let raw_item_component = await this.getItemComponent(this.components.find(f=>f.component_type===ITEM_COMPONENT).component_id)
      let equip_locations:EquipLocation[] = [this.getEquipLocation(raw_item_component.equipLocation)]
      resolve({
        proxy_items: await this.getProxyItemsFromSubItems(raw_item_component.subItems),
        equip_locations: equip_locations,
        buy_price: raw_item_component.baseValue,
        rarity: raw_item_component.rarity,
        stack_size: raw_item_component.stackSize,
        color: raw_item_component.color1,
        preconditions: await this.getPreconditions(raw_item_component.reqPrecondition),
        two_handed: raw_item_component.isTwoHanded,
        alternate_currency_id: raw_item_component.currencyLOT,
        alternate_currency_cost: raw_item_component.altCurrencyCost,
        alternate_currency_name: await this.getObjectName(raw_item_component.currencyLOT),
        commendation_currency_id: raw_item_component.commendationLOT,
        commendation_currency_cost: raw_item_component.commendationCost,
        commendation_currencyname: await this.getObjectName(raw_item_component.commendationLOT),
        is_weapon: equip_locations.includes("Right Hand"),//raw_item_component.,
        level_requirement: await this.getLevelRequirementFromPreconditions(raw_item_component.reqPrecondition)//raw_item_component.,
      })
    })
  }
  // async getItemStats():ItemStats{
  //   return new Promise<ItemStats>(async(resolve, reject) => {
  //     let item_component: = await this.getItemComponent(this.components.find(f=>f.component_type===ITEM_COMPONENT).component_id)
  //     console.log(item_component);

  //     return {
  //       armor: item_component.find(c => c);
  //       health: item_component.find(c => c);
  //       imagination: item_component.find(c => c);
  //     }

  //   })
  // }

}
