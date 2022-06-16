import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { explorerDomain } from "../config";
import { SmashableDrop } from "../luInterfaces";

export class Activity extends CDClient {
  db: Database;
  id: number;
  name: string;
  rewards: SmashableDrop[];

  constructor(cdclient: CDClient, id: number, name: string) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.name = name;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    await this.addRewards();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/activity/${id}`;
  }

  async addRewards(): Promise<void> {
    this.rewards = await this.getActivityDrops(this.name);
  }

}