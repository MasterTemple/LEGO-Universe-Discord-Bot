import { Database } from "sqlite3";
import { CDClient } from "../cdclient";
import { ComponentsRegistry, SkillBehavior, Missions } from "../cdclientInterfaces";
import { explorerDomain } from '../config.json';
import { NPCMission } from "../luInterfaces";
import { ObjectElement, SkillDescription } from "../luInterfaces";

export class Mission extends CDClient {
  db: Database;
  id: number;
  name: string;
  raw: Missions;
  data: NPCMission;
  imageURL: string;

  constructor(cdclient: CDClient, id: number) {
    super();
    this.db = cdclient.db;
    this.id = id;
    this.locale = cdclient.locale;
  }

  async create(): Promise<void> {
    this.raw = await this.getMission(this.id);
    await this.addThumbnail();
    this.organizeData()
  }

  getURL(id: number = this.id): string {
    return `${explorerDomain}/skills/${id}`;
  }

  async addThumbnail(id: number = this.id): Promise<void> {
    this.imageURL = `${explorerDomain}${await this.getIconAssetForMission(id)}`
  }

  organizeData() {
    this.data = {
        id: this.raw.id,
        type: this.raw.defined_type,
        subtype: this.raw.defined_subtype,
        name: this.locale.getMissionName(this.raw.id),
        description: this.locale.getMissionDescription(this.raw.id),
        isRepeatable: this.raw.repeatable,
        rewards: (!this.raw.repeatable ?
          [
            { id: this.raw.reward_item1, name: this.locale.getObjectName(this.raw.reward_item1), count: this.raw.reward_item1_count },
            { id: this.raw.reward_item2, name: this.locale.getObjectName(this.raw.reward_item2), count: this.raw.reward_item2_count },
            { id: this.raw.reward_item3, name: this.locale.getObjectName(this.raw.reward_item3), count: this.raw.reward_item3_count },
            { id: this.raw.reward_item4, name: this.locale.getObjectName(this.raw.reward_item4), count: this.raw.reward_item4_count },
          ] :
          [
            { id: this.raw.reward_item1_repeatable, name: this.locale.getObjectName(this.raw.reward_item1_repeatable), count: this.raw.reward_item1_repeat_count },
            { id: this.raw.reward_item2_repeatable, name: this.locale.getObjectName(this.raw.reward_item2_repeatable), count: this.raw.reward_item2_repeat_count },
            { id: this.raw.reward_item3_repeatable, name: this.locale.getObjectName(this.raw.reward_item3_repeatable), count: this.raw.reward_item3_repeat_count },
            { id: this.raw.reward_item4_repeatable, name: this.locale.getObjectName(this.raw.reward_item4_repeatable), count: this.raw.reward_item4_repeat_count },
          ]
        ).filter(({ id }) => id > 0),
        isAchievement: (row.offer_objectID > 0 && row.target_objectID > 0),
        giver: {id: row.offer_objectID, name: this.locale.getObjectName(row.offer_objectID)},
        accepter: {id: row.target_objectID, name: this.locale.getObjectName(row.target_objectID)},
      }
  }

}