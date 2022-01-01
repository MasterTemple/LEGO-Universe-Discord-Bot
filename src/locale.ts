import { locale_path, sqlite_path, locale_last_updated } from "./config.json"
import { XMLParser } from "fast-xml-parser"
import { readFile, stat, writeFile } from "fs/promises"
import { Database } from "sqlite3";

export class LocaleXML { 
  db:Database;
  constructor(){}
  async connectToCDClient():Promise<void>{
    return new Promise<void>(async(resolve, reject) => {
      this.db = new Database(sqlite_path, (err) => {

        if (err) {
          console.error('\tPlease provide a path to the cdclient.sqlite in config.json.')
        }else{
          // console.log(`\tConnected to '${sqlite_path}' as 'cdclient.sqlite'.`)
          resolve()
        }

      })
    })
  }
  async closeCDClient():Promise<void>{
    return new Promise<void>(async(resolve, reject) => {
      this.db.close((err) => {
        if(err) {
          console.log("Error closing cdclient.sqlite.");
        }else{
          console.log("Closed cdclient.sqlite");

          resolve()
        }
      })
    })
  }
  async dropAndCreateLocaleTable():Promise<void>{
    return new Promise<void>(async(resolve, reject) => {
      this.db.exec("DROP TABLE IF EXISTS locale; CREATE TABLE locale (key TEXT PRIMARY KEY, value TEXT);", (err) => {
        // console.log({err});
        resolve()

      })
    })
    }
  async addEntry(key:string, value:string):Promise<void>{
    return new Promise<void>(async(resolve, reject) => {
      // value = value.toString().replace("\"", "'")
      this.db.exec(`INSERT INTO locale VALUES ("${key}", "${value}")`, (err) => {
        if(err){
          console.log({key, value});

          console.log(err);
        }
        resolve()
      })
    })
  }
  async updateIfChanged():Promise<void>{
    return new Promise<void>(async(resolve, reject) => {
      console.log("Checking 'locale.xml' for updates.");

      let {mtime} = await stat(locale_path)
      let date_modified = mtime.toISOString()
      // console.log({date_modified, locale_last_updated});
      if(date_modified === locale_last_updated){
        resolve()
        console.log("No updates required for 'locale.xml'.");

      }else{
        console.log("Updating cdclient.sqlite from 'locale.xml'.");

        await this.load()
        // locale_last_updated = date_modified
        let config = require('./config.json')
        config.locale_last_updated = date_modified
        writeFile("./src/config.json", JSON.stringify(config, null, 2))
        writeFile("./bin/config.json", JSON.stringify(config, null, 2))
        resolve()
      }
    })
  }

  async load():Promise<void>{
    return new Promise<void>(async(resolve, reject) => {
      await this.connectToCDClient();
      await this.dropAndCreateLocaleTable();

      const options = {
        ignoreAttributes: false,
      };
      let xml = new XMLParser(options)
      let parsed = xml.parse(await readFile(locale_path))
      console.log(`Connected to '${locale_path}' as 'locale.xml'.`);
      this.db.serialize(() => {
        var stmt = this.db.prepare("INSERT INTO locale VALUES (?, ?)");
        for(let phrase of parsed.localization.phrases.phrase){
            if(phrase["translation"]?.[0]?.["#text"] === undefined){
              stmt.run(phrase["@_id"], phrase["translation"]["#text"])
            }else{
              stmt.run(phrase["@_id"], phrase["translation"][0]["#text"])
            }
        }
        stmt.finalize();

      });


      await this.closeCDClient();
      resolve()
    })
  }
  
}