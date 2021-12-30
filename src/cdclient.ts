import { Database } from "sqlite3";
import { Objects } from "./cdclient_interfaces";
import { sqlite_path } from "./config.json";


export class CDClient {
  db: Database;
  constructor(db:Database){
    this.db = db;
  }
  async test(){
    return new Promise<void>((resolve, reject) => {

      this.db.get("SELECT * FROM Objects WHERE id=7415", function (_, row:Objects){
        console.log(row);
        resolve()
      })

    })
  }
}
