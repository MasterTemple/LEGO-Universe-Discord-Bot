import { locale_path } from "./config.json"
import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { DOMParser as dom } from 'xmldom';
import * as xpath from 'xpath-ts';

  export class LocaleXML {
    doc: Document;
    constructor(){}
    async load():Promise<void>{
      return new Promise<void>(async(resolve, reject) => {
        if(!existsSync(locale_path)){
          console.error('Please provide a path to the locale.xml in config.json.');
        }
        const xml = (await readFile(locale_path)).toString();
        this.doc = new dom().parseFromString(xml);
        console.log(`load(): this.doc="${typeof this.doc}"`);
        resolve()
      })
    }
    async getNodeData(phrase:string):Promise<string>{
      return new Promise<string>((resolve, reject) => {
        console.log(`Getting Node Data for phrase: "${phrase}"`);
        console.log(`getNodeData(): this.doc="${typeof this.doc}"`);

        const nodes = xpath.select(`//localization//phrase[@id='${phrase}']//translation[@locale='en_US']`, this.doc);
        const name = nodes?.[0].firstChild.data;
        resolve(name || phrase)
      })
    }
  async getObjectName(id:number):Promise<string>{
    return new Promise<string>(async(resolve, reject) => {
      const name = await this.getNodeData(`Objects_${id}_name`)
      resolve(name)
    })
  }
  async getLevelRequirement(precondition_ids:number[]):Promise<number> {
    return new Promise<number>(async(resolve, reject) => {
      for(const precondition_id of precondition_ids){
        const precondition_text = await this.getNodeData(`Preconditions_${precondition_id}_FailureReason`);
        const match = precondition_text.match(/(?<=You must be Level )\d+/)
        if(match){
          const level = parseInt(match[0])
          resolve(level)
        }
      }
      resolve(0)
    })
  }

}