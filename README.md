# LEGO Universe Discord Bot

# Overview

1. [Prerequisites:](#prerequisites) what you need prior to setting the bot up
2. [Setup:](#setup) instructions on how to set up the bot
3. [Features:](#features) the bots functionality within Discord
4. [Commands:](#commands) a short description and example for each command

# Prerequisites

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

# Setup

1. Run `git clone https://github.com/MasterTemple/LEGO-Universe-Discord-Bot.git`
2. **Configuration**

   Rename `.env.template` to `.env` and fill in the data from the comments provided.

   If you do not have a `cdclient.sqlite` create one from your `cdclient.fdb` at https://fdb.lu-dev.net/.

3. Install proper dependencies with `npm install`
4. Transpile with `tsc --build`

   If `tsc` is not found, install it with `npm i typescript -g` and then run `tsc --build`.

5. Run `./lib/index.js`

   I would recommend using something that restarts if it crashes such as pm2

   Install pm2 with `npm install pm2 -g` and run it with `pm2 start .`

   Restart with `pm2 restart all` and stop with `pm2 stop all`

   If you edit the cdclient.sqlite or locale.xml, they can be reloaded without restarting the bot by using the Slash Command `/reload` in Discord.

   If you edit the .env file, you just need to restart the bot.

# Features

## Autocomplete

This allows users to search objects by their name instead of relying on knowing the internal object id.
![autocomplete](screenshots/autocomplete.gif)

## Message Embeds

Message embeds allow for organizing and displaying data in a much more visually appealing way.

They are indicated below by the colored bar on the left and the darker background.

**Normal Message**

![no embed](screenshots/no_embed.png)

**Message Embed**

![embed](screenshots/item.png)

## Message Components

Message components are the buttons underneath the embed. These allow for the user to execute related commands on an object.

For example, an item that can be earned can also be bought. Instead of having to use `/earn` and then `/buy`, the user can use `/earn` and then click the `Buy` button.

The green button indicates the current command. Disabled/faded buttons show that an item cannot be obtained through a certain method.

![message components](screenshots/components.png)

If the user clicks the `Buy` button, the message is edited to display the following

![message components](screenshots/component_buy.png)

## Paging

The current page index is indicated between the parenthesis in the title.

Page navigation can be controlled through the buttons on the bottom.

####

![/buy](screenshots/buy.png)

## External Links

The blue hyper-linked text will take the user to the corresponding page of hosted [LU Explorer](https://github.com/LUDevNet/lu-explorer) that is specified in the configuration.

[LU Explorer](https://github.com/LUDevNet/lu-explorer) an angular.io webapp that displays LEGO Universe game data..

# Commands

### `/activity`

View all activitys given from an activity!

![/activity](screenshots/activity.png)

### `/drop`

View all smashables that drop an item!

![/drop](screenshots/drop.png)

### `/get`

View how to get an item!

![/get](screenshots/get.png)

### `/mission`

View the stats of a mission!

![/mission](screenshots/mission.png)

### `/reload`

Reload the data from the cdclient.sqlite and locale.xml!

![/reload](screenshots/reload.png)

### `/skillitems`

View all items that have a skill!

![/skillitems](screenshots/skillitems.png)

### `/vendor`

View all items sold from a vendor!

![/vendor](screenshots/vendor.png)

### `/brick`

View the stats of a brick!

![/brick](screenshots/brick.png)

### `/earn`

View all missions that reward an item!

![/earn](screenshots/earn.png)

### `/item`

View the stats of an item!

![/item](screenshots/item.png)

### `/npc`

View all missions from an NPC!

![/npc](screenshots/npc.png)

### `/report`

Open a dialog to report anything about this bot!

![/report](screenshots/report.png)

### `/skills`

View all skills attached to an item!

![/skills](screenshots/skills.png)

### `/buy`

View all vendors that sell an item!

![/buy](screenshots/buy.png)

### `/enemy`

View the stats of an enemy!

![/enemy](screenshots/enemy.png)

### `/level`

View stats about a level in LEGO Universe!

![/level](screenshots/level.png)

### `/package`

View all items given from a package!

![/package](screenshots/package.png)

### `/reward`

View all activities that drop an item!

![/reward](screenshots/reward.png)

### `/smash`

View all enemys given from a package!

![/smash](screenshots/smash.png)

### `/cooldowngroup`

View the skills in a cooldowngroup!

![/cooldowngroup](screenshots/cooldowngroup.png)

### `/execute`

Open a dialog to execute multiple commands on this bot!

![/execute dialog](screenshots/execute_dialog.png)

![/execute](screenshots/execute.png)

### `/loottable`

View all items in a loot table!

![/loottable](screenshots/loottable.png)

### `/preconditions`

View the preconditions to use an item!

![/preconditions](screenshots/preconditions.png)

### `/skill`

View the stats of a skill!

![/skill](screenshots/skill.png)

### `/unpack`

View all packages that drop an item!

![/unpack](screenshots/unpack.png)
