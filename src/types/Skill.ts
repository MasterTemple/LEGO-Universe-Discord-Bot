import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ComponentsRegistry, SkillBehavior } from "../cdclientInterfaces";
import { explorerDomain } from "../config";
import { ObjectElement, SkillDescription } from "../luInterfaces";

export class Skill extends CDClient {
  db: Database;
  id: number;
  name: string;
  descriptions: SkillDescription[];
  imageURL: string;
  skillBehavior: SkillBehavior;
  skillItems: ObjectElement[];

  constructor(cdclient: CDClient, id: number) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.name = this.locale.getSkillName(this.id);
    this.descriptions = this.locale.getSkillDescription(this.id);
    await this.addThumbnail();
    await this.addSkillBehavior();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/skills/${id}`;
  }

  async addThumbnail(id: number = this.id): Promise<void> {
    this.imageURL = `${explorerDomain}${await this.getIconAssetFromSkill(id)}`;
  }

  async addSkillBehavior(): Promise<void> {
    this.skillBehavior = await this.getSkillBehavior(this.id);
  }

  async addSkillItems(): Promise<void> {
    this.skillItems = await this.getItemsWithSkill(this.id);
  }

}