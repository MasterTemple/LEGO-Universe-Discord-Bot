import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ComponentsRegistry } from "../cdclientInterfaces";
import { ItemSold } from "../luInterfaces";
import { explorerDomain } from '../config.json';

export class NPC extends CDClient {
  db: Database;
  id: number;
  name: string;
  imageURL: string;
  components: ComponentsRegistry[];
  vendor: ItemSold[];

  constructor(cdclient: CDClient, id: number) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.components = await this.getComponents(this.id);
    this.name = (await this.getObjectName(this.id));
    await this.addSold();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/objects/${id}`;
  }

  async addSold(): Promise<void> {
    this.vendor = await this.getItemsSold(this.id)
  }
}