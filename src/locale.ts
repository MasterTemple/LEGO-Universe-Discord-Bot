import {localePath} from './config.json';
import {existsSync} from 'fs';
import {readFile} from 'fs/promises';
import {DOMParser} from 'xmldom';
import * as xpath from 'xpath-ts';
import { localeXMLType } from './luInterfaces';

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

  async load():Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!existsSync(localePath)) {
        console.error('Please provide a path to the locale.xml in config.json.');
      }
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
            this.locale.get(name).set(num, content);
          }
        }
        // console.log(this.locale)
        resolve();
      });
    });
  }

  getObjectName(id:number):string {
    return this.locale.get("Objects_ID_name").get(id.toString());
  }

  // async getObjectName(id:number):Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     resolve(this.locale.get("Objects_ID_name").get(id.toString()))
  //   });
  // }

  async getLevelRequirement(preconditionIds:number[]):Promise<number> {
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
