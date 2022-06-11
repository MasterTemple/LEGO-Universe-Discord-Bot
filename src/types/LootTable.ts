import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ItemSold, LootTableItem } from "../luInterfaces";
import { explorerDomain } from "../config";

export class LootTable extends CDClient {
  db: Database;
  id: number;
  name: string;
  imageURL: string;
  loot: LootTableItem[];

  constructor(cdclient: CDClient, id: number) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.name = this.locale.getLootTableName(this.id) || `Loot Table`;
    await this.addLoot();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/objects/loot/table/${id}`;
  }

  async addLoot(): Promise<void> {
    this.loot = await this.getItemsInLootTableWithRarity(this.id);
  }

}