import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ComponentsRegistry } from "../cdclientInterfaces";
import { EnemyHealth, ItemSold, SmashableDrop } from "../luInterfaces";
import { explorerDomain } from "../config";

export class Enemy extends CDClient {
  db: Database;
  id: number;
  name: string;
  imageURL: string;
  components: ComponentsRegistry[];
  life: number;
  armor: number;
  drops: SmashableDrop[];

  constructor(cdclient: CDClient, id: number) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.components = await this.getComponents(this.id);
    this.name = (await this.getObjectName(this.id));
    await this.addStats();
    // await this.addDrops();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/objects/${id}`;
  }

  async addStats(): Promise<void> {
    let stats: EnemyHealth = await this.getEnemyHealth(this.id);
    this.life = stats.life || 0;
    this.armor = stats.armor || 0;
  }

  async addDrops(): Promise<void> {
    this.drops = await this.getSmashableDrops(this.id);
  }
}