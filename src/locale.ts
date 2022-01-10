import {localePath} from './config.json';
import {existsSync} from 'fs';
import {readFile} from 'fs/promises';
import {DOMParser} from 'xmldom';
import * as xpath from 'xpath-ts';

export class LocaleXML {
  // (I don't know why eslint complains about this)
  // eslint-disable-next-line no-undef
  doc: Document;
  async load():Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!existsSync(localePath)) {
        console.error('Please provide a path to the locale.xml in config.json.');
      }
      readFile(localePath).then((fileData) => {
        const xml = fileData.toString();
        this.doc = new DOMParser().parseFromString(xml);
        resolve();
      });
    });
  }

  async getNodeData(phrase:string):Promise<string> {
    return new Promise<string>((resolve, reject) => {
      console.log(`Getting Node Data for phrase: "${phrase}"`);
      const nodes = xpath.select(`//localization//phrase[@id='${phrase}']//translation[@locale='en_US']`, this.doc);
      const name = nodes?.[0]?.firstChild?.data;
      resolve(name)
      // resolve(name || phrase);
    });
  }

  async getObjectName(id:number):Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // resolve(undefined)
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
