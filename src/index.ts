import { AutocompleteInteraction, Client, CommandInteraction, CommandInteractionOption, Interaction } from 'discord.js';
import { CDClient } from './cdclient';
import { token } from './config.json';
import { LocaleXML } from './locale';
import { LootDrop, NameValuePair, queryType } from './luInterfaces';
import { getSlashCommands, updateSlashCommands } from './setup';
import { SlashCommandMap } from './types/SlashCommand';

const cdclient = new CDClient();

const client = new Client({
  intents: [],
});

const slashCommands: SlashCommandMap = getSlashCommands();

client.once('ready', async () => {
  console.log('\n------------------------------------\n');
  await cdclient.load();
  updateSlashCommands(client, slashCommands);

  console.log('\n------------------------------------\n');
  console.log('LEGO Universe Discord Bot is online.');
  // process.exit(0)
});

client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    if (interaction.isApplicationCommand()) {
      const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
      slashCommands.get(interaction.commandName).run(interaction, options, cdclient);
    }

    if (interaction.isAutocomplete()) {
      const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
      // this is currently a general search for ALL objects in the 'Objects' table
      let { name, value } = options.find((f) => f.focused);
      value = value.toString();

      let autocompleteOptions: NameValuePair[];
      if (value.match(/^\d+$/g)) {
        autocompleteOptions = [{
          name: `${(await cdclient.getObjectName(parseInt(value)))} [${value}]`,
          value: value,
        }];
      } else {
        switch (interaction.commandName.toString()) {
          case "activity":
            autocompleteOptions = await cdclient.searchActivity(value.toString())
            break;

          case "preconditions":
          case "item":
          case "buy":
          case "drop":
          case "earn":
          case "reward":
          case "unpack":
            autocompleteOptions = await cdclient.searchItem(value.toString())
            break;

          case "brick":
            autocompleteOptions = await cdclient.searchBrick(value.toString())
            break;

          case "loottable":
            break;

          case "package":
            autocompleteOptions = await cdclient.searchPackage(value.toString());
            break;

          case "mission":
            autocompleteOptions = cdclient.locale.searchMissions(value.toString());
            break;

          case "enemy":
          case "smash":
            autocompleteOptions = await cdclient.searchSmashable(value.toString());
            break;

          case "skill":
            autocompleteOptions = cdclient.locale.searchSkills(value.toString());
            break;

          case "npc":
            autocompleteOptions = await cdclient.searchMissionNPC(value.toString());
            break;

          case "vendor":
            autocompleteOptions = await cdclient.searchVendor(value.toString());
            break;

          default:
            autocompleteOptions = await cdclient.searchObject(value);
        }
      }

      interaction.respond(autocompleteOptions);
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(token);
