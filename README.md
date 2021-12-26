# Currently Incomplete

## Setup
1. **Add `config.json`**

It should look like this, but fill in the data
```json
{
  "token": "DISCORD_TOKEN_GOES_HERE",
  "sqlite_path": "PATH_TO_CDCLIENT.SQLITE",
  "locale_path": "PATH_TO_LU_CLIENT\\client\\locale\\locale.xml",
  "res_path": "PATH_TO_LU_CLIENT\\client\\res"
}
```
If you do not have a `cdclient.sqlite` check out [lcdr's utils](https://github.com/lcdr/utils) and use `./utils/fdb_to_sqlite.py` to convert the `cdclient.fdb` to `cdclient.sqlite`.

2. **Run `npm install`**

Installs depdencies

3. **Run `node setup`**

Only necessary to run when first setting up the bot. (I will likely make it auto set up at one point)

4. **Run `node index`**

Starts the bot