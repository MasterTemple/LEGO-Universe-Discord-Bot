import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ComponentsRegistry } from "../cdclient_interfaces";
import { ItemStats, Skill, ItemComponent } from "../lu_interfaces"


export class Item extends CDClient{
  db:Database;
  id:number;
  name:string;
  components:ComponentsRegistry[];
  stats:ItemStats;
  skills:Skill[];
  item_component:ItemComponent;
  constructor(db:Database, id:number){
    super();
    this.db = db;
    this.id = id;
  }
  async create(): Promise<void> {
      return new Promise<void>(async(resolve, reject) => {
        this.components = await this.getComponents(this.id)

        resolve()
      })
  }

}
