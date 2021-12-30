import { Database } from "sqlite3";
import { Objects } from "./cdclient_interfaces";
import { path } from "./config.json";

const cdclient = new Database(path);

cdclient.get("SELECT * FROM Objects WHERE id=7415", function (_, row:Objects){
  console.log(row);
})


