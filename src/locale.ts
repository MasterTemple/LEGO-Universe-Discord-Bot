import { locale_path } from "./config.json"
import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { DOMParserImpl as dom } from 'xmldom-ts';
import * as xpath from 'xpath-ts';

export class LocaleXML { 
  doc: Document;
  constructor(){}
  async load():Promise<void>{
    return new Promise<void>(async(resolve, reject) => {
      if(!existsSync(locale_path)){
        console.error('Please provide a path to the locale.xml in config.json.');
        process.exit(1);
      }
      const xml = (await readFile(locale_path)).toString();
      this.doc = new dom().parseFromString(xml);
    })
  }
  private async getNodeData(phrase:string):Promise<string>{
    return new Promise<string>((resolve, reject) => {
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

}