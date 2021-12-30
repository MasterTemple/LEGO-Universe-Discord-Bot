"use strict";
exports.__esModule = true;
var sqlite3_1 = require("sqlite3");
var config_json_1 = require("./config.json");
var cdclient = new sqlite3_1.Database(config_json_1.path);
cdclient.get("SELECT * FROM Objects WHERE id=7415", function (_, row) {
    console.log(row);
});
