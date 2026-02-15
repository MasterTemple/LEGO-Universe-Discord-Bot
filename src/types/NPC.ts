import { Database } from '../database';
import { CDClient } from "../cdclient";
import { ComponentsRegistry } from "../cdclientInterfaces";
import { explorerDomain } from "../config";
import { ItemSold, NPCMission } from "../luInterfaces";

export class NPC extends CDClient {
  declare db: Database;
  id: number;
  name: string;
  imageURL: string;
  components: ComponentsRegistry[];
  vendor: ItemSold[];
  missions: NPCMission[];

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
    await this.addMissions();
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/objects/${id}`;
  }

  async addSold(): Promise<void> {
    this.vendor = await this.getItemsSold(this.id);
  }
  async addMissions(): Promise<void> {
    this.missions = await this.getMissionsFromNPC(this.id);
  }
}