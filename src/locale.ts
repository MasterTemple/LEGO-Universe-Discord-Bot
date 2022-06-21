import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { localePath } from './config';
import { localeXMLType, NameValuePair, SkillDescription, UnofficialType } from './luInterfaces';
import { lootTableNames } from './unofficial/lootTableNames';

export class LocaleXML {
  localeTypes: localeXMLType[] = [
    "Activities_ID_ActivityName",
    "ItemSets_ID_kitName",
    "MissionEmail_ID_announceText",
    "MissionEmail_ID_bodyText",
    "MissionEmail_ID_senderName",
    "MissionEmail_ID_subjectText",
    "MissionTasks_ID_description",
    "MissionText_ID_accept_chat_bubble",
    "MissionText_ID_chat_state_1",
    "MissionText_ID_chat_state_2",
    "MissionText_ID_chat_state_3_turnin",
    "MissionText_ID_completion_succeed_tip",
    "MissionText_ID_in_progress",
    "MissionText_ID_offer",
    "MissionText_ID_ready_to_complete",
    "MissionText_ID_description",
    "MissionText_ID_chat_state_3",
    "MissionText_ID_chat_state_4",
    "MissionText_ID_chat_state_4_turnin",
    "MissionText_ID_offer_repeatable",
    "Missions_ID_name",
    "Objects_ID_description",
    "Objects_ID_name",
    "Preconditions_ID_FailureReason",
    "SkillBehavior_ID_descriptionUI",
    "SkillBehavior_ID_name",
  ];
  locale: Map<localeXMLType, Map<string, string>> = new Map<localeXMLType, Map<string, string>>();
  unofficial = new Map<UnofficialType, Map<any, any>>();

  async load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!existsSync(localePath)) {
        console.error('Please provide a path to the locale.xml in config.ts.');
      }
      // locale.xml
      readFile(localePath).then((fileData) => {
        // locale parsers are way too slow so im using regex and making a map
        const text = fileData.toString();
        for (let name of this.localeTypes) {
          let matchName = name.replace("ID", "(?<num>\\d+)");
          let matches = [
            ...text.matchAll(
              new RegExp(`id="${matchName}">[^"]+"en_US">(?<content>[^<]+)`, "gim")
            ),
          ].map((e) => e.groups);
          this.locale.set(name, new Map<string, string>());
          for (let { num, content } of matches) {
            content = content.replace(/\&lt;([^&]+(&apos;)?)+&gt;/gm, "");
            content = content.replace(/&apos;/gm, "'");
            this.locale.get(name).set(num, content);
          }
        }

        // loot table names
        let ltiNames = lootTableNames;
        this.unofficial.set("LootTableName", new Map<number, string>());
        for (let lti of ltiNames) {
          this.unofficial.get("LootTableName").set(lti.lti, lti.name);
        }

        resolve();
      });
    });
  }

  getObjectName(id: number): string {
    return this.locale.get("Objects_ID_name").get(id.toString()) || `Objects_${id}_name`;
  }

  getObjectNameOrUndefined(id: number): string {
    return this.locale.get("Objects_ID_name").get(id.toString());
  }

  getLootTableName(id: number): string {
    return this.unofficial.get("LootTableName").get(id.toString()) || `Loot Table ${id}`;
  }

  getActivityName(id: number): string {
    return this.locale.get("Activities_ID_ActivityName").get(id.toString()) || `Activities_${id}_ActivityName`;
  }

  getMissionName(id: number): string {
    return this.locale.get("Missions_ID_name").get(id.toString());
  }

  getMissionDescription(id: number): string {
    let desc = this.locale.get("MissionText_ID_description").get(id.toString());
    if (!desc) desc = this.locale.get("MissionText_ID_in_progress").get(id.toString());
    if (!desc) desc = this.locale.get("MissionText_ID_completion_succeed_tip").get(id.toString());
    return desc;
  }

  getPreconditionDescription(id: number): string {
    return this.locale.get("Preconditions_ID_FailureReason").get(id.toString());
  }
  getSkillName(id: number): string {
    return this.locale.get("SkillBehavior_ID_name").get(id.toString());
  }
  getSkillDescription(skillId: number): SkillDescription[] {
    let description = this.locale.get("SkillBehavior_ID_descriptionUI").get(skillId.toString());
    let descriptions = [...(description?.matchAll(/%\((?<name>[^\)]+)\)(?<description>[^%]+)/gm) || [])].map((e) => {
      return {
        name: e.groups.name,
        description: e.groups.description,
      };
    });
    if (descriptions.length === 0) descriptions = [{ name: "Description", description: description }];
    return descriptions;
  }

  searchActivities(query: string): NameValuePair[] {
    let matches: NameValuePair[] = [];
    let re = new RegExp(query, "gi");
    for (let [id, name] of this.locale.get("Activities_ID_ActivityName")) {
      if (name.match(re)) {
        matches.push({ name: `${name} [${id}]`, value: id });
        if (matches.length === 15) break;
      }
    }
    return matches;
  }

  searchObjects(query: string): NameValuePair[] {
    let matches: NameValuePair[] = [];
    let re = new RegExp(query, "gi");
    for (let [id, name] of this.locale.get("Objects_ID_name")) {
      if (name.match(re)) {
        matches.push({ name: `${name} [${id}]`, value: id });
        if (matches.length === 15) break;
      }
    }
    return matches;
  }

  searchSkills(query: string): NameValuePair[] {
    let matches: NameValuePair[] = [];
    let re = new RegExp(query, "gi");
    for (let [id, name] of this.locale.get("SkillBehavior_ID_name")) {
      if (name.match(re)) {
        matches.push({ name: `${name} [${id}]`, value: id });
        if (matches.length === 15) break;
      }
    }
    return matches;
  }

  searchMissions(query: string): NameValuePair[] {
    let matches: NameValuePair[] = [];
    let re = new RegExp(query, "gi");
    for (let [id, name] of this.locale.get("Missions_ID_name")) {
      if (name.match(re)) {
        matches.push({ name: `${name} [${id}]`, value: id });
        if (matches.length === 15) break;
      }
    }
    return matches;
  }

  searchLootTable(query: string): NameValuePair[] {
    let matches: NameValuePair[] = [];
    let re = new RegExp(query, "gi");
    for (let [id, name] of this.unofficial.get("LootTableName")) {
      if (name.match(re)) {
        matches.push({ name: `${name} [${id}]`, value: id });
        if (matches.length === 15) break;
      }
    }
    return matches;
  }

  // async getObjectName(id:number):Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     resolve(this.locale.get("Objects_ID_name").get(id.toString()))
  //   });
  // }

  async getLevelRequirement(preconditionIds: number[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      for (const preconditionId of preconditionIds) {
        const match = this.locale.get("Preconditions_ID_FailureReason").get(preconditionId.toString())?.match(/(?<=You must be Level )\d+/);
        if (match) {
          const level = parseInt(match[0]);
          resolve(level);
        }
      }
      resolve(0);
    });
  }
}
