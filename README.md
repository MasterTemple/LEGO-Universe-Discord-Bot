# LEGO Universe Discord Bot

## Prerequisites

1. Create a Discord Application

   View the [Official Guide](https://discord.com/developers/docs/getting-started) on how to create a Discord Application

   \*Please note that this Discord Bot does not require any special intents

   Invite the bot to your server with the following link: https://discord.com/api/oauth2/authorize?client_id={YOUR_BOTS_ID}&permissions=242666032192&scope=applications.commands%20bot

2. Have a LEGO Universe client

   You are not required to be hosting a LEGO Universe server to host this bot

   All you are required is to have the `locale.xml` and the `cdclient.sqlite` files

   The `locale.xml` can be found at `PATH_TO_LU_CLIENT\client\locale\locale.xml`

   The `cdclient.sqlite` is not found in the client. You must create it from the `cdclient.fdb` which is found in unpacked clients.

   If you are using a packed client, you can unpack just the `cdclient.fdb` using [lunpack.exe](https://lu-dev.net/LUnpack/) with the following command:

   - Make sure the contents of `globs.txt` is just `*.fdb`, otherwise you will unpack the whole client (which takes a lot more time)
   - Make sure `lunpack.exe` and `globs.txt` are in the same folder

   ```sh
   lunpack.exe "PATH_TO_LU_CLIENT" - g "globs.txt"
   ```

   To convert the `cdclient.fdb` to the `cdclient.sqlite`, upload the `cdclient.fdb` to https://fdb.lu-dev.net/.

## Setup

1. Run `git clone https://github.com/MasterTemple/LEGO-Universe-Discord-Bot.git`
2. **Configuration**

   Copy `src/config.ts.template` to `src/config.ts` and fill in the data.

   If you do not have a `cdclient.sqlite` create one from your `cdclient.fdb` at https://fdb.lu-dev.net/.

3. Install proper dependencies with `npm install`
4. Transpile with `tsc --build`

   If `tsc` is not found, install it with `npm i typescript -g` and then run `tsc --build`.

5. Run `./lib/index.js`

   I would recommend using something that restarts if it crashes such as pm2

   Install pm2 with `npm install pm2 -g` and run it with `pm2 start .`

   Restart with `pm2 restart all` and stop with `pm2 stop all`
