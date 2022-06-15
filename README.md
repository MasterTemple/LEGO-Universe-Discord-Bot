# LEGO Universe Discord Bot

## Setup

1. Run `git clone https://github.com/MasterTemple/LEGO-Universe-Discord-Bot.git`
2. **Configuration**

   Copy `src/config.ts.template` to `src/config.ts` and fill in the data.

   If you do not have a `cdclient.sqlite` create one from your `cdclient.fdb` at https://fdb.lu-dev.net/.

3. Install proper dependencies with `npm install`
4. Transpile with `tsc --build`
5. Run `./lib/index.js`

   I would recommend using something that restarts if it crashes such as pm2

   Install pm2 with `npm install pm2 -g` and run it with `pm2 start .`

   Restart with `pm2 restart all` and stop with `pm2 stop all`
