# Currently Incomplete

## Setup
1. **Add `./src/config.json`**

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

2. Idk how someone is supposed to set up a TypeScript Project (if they transpile the files or i do or what), so good luck, I'll figure this out when it's in a usable state :)