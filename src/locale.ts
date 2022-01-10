import {localePath} from './config.json';
import {existsSync} from 'fs';
import {readFile} from 'fs/promises';
import {DOMParser as Dom} from 'xmldom';
import * as xpath from 'xpath-ts';

export class LocaleXML {
  doc: Document;
  async load():Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!existsSync(localePath)) {
        console.error('Please provide a path to the locale.xml in config.json.');
      }
      readFile(localePath).then((fileData) => {
        const xml = fileData.toString();
        this.doc = new Dom().parseFromString(xml);
        console.log(`load(): this.doc="${typeof this.doc}"`);
        resolve();
      });
    });
  }

  async getNodeData(phrase:string):Promise<string> {
    return new Promise<string>((resolve, reject) => {
      console.log(`Getting Node Data for phrase: "${phrase}"`);
      console.log(`getNodeData(): this.doc="${typeof this.doc}"`);

      const nodes = xpath.select(`//localization//phrase[@id='${phrase}']//translation[@locale='en_US']`, this.doc);
      const name = nodes?.[0].firstChild.data;
      resolve(name || phrase);
    });
  }

  async getObjectName(id:number):Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.getNodeData(`Objects_${id}_name`).then((name) => {
        resolve(name);
      });
    });
  }

  async getLevelRequirement(preconditionIds:number[]):Promise<number> {
    return new Promise<number>((resolve, reject) => {
      for (const preconditionId of preconditionIds) {
        this.getNodeData(`Preconditions_${preconditionId}_FailureReason`).then((preconditionText) => {
          const match = preconditionText.match(/(?<=You must be Level )\d+/);
          if (match) {
            const level = parseInt(match[0]);
            resolve(level);
          }
        });
      }
      resolve(0);
    });
  }
}
