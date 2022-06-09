import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ComponentsRegistry, SkillBehavior } from "../cdclientInterfaces";
import { explorerDomain } from '../config.json';
import { ActivityDropFromQuery } from "../luInterfaces";
import { ObjectElement, SkillDescription } from "../luInterfaces";

export class Skill extends CDClient {
  db: Database;
  id: number;
  name: string;
  rewards: ActivityDropFromQuery[];

  constructor(cdclient: CDClient, id: number, name: string) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.name = name;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.name = await this.locale.getSkillName(this.id);
    this.descriptions = this.locale.getSkillDescription(this.id);
    await this.addRewards();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/skills/${id}`;
  }

  async addRewards(id: number = this.id): Promise<void> {
      this.rewards = await this.getActivitiesThatDropItem()
  }

}