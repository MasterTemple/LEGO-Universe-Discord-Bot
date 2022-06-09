import { AutocompleteInteraction, Client, CommandInteraction, CommandInteractionOption, Interaction } from 'discord.js';
import { getAutocompleteOptions } from './autocomplete';
import { CDClient } from './cdclient';
import { token } from './config.json';
import { LocaleXML } from './locale';
import { LootDrop, NameValuePair, queryType } from './luInterfaces';
import { percent } from './math';
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

  // console.log(percent(0.0014999985918402459))
  // console.log(percent(0.029999971389770508 * 0.05000000074505806 * (1 / 1)))
  // console.log(percent(0.05000000074505806 * ))

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

      autocompleteOptions = await getAutocompleteOptions(cdclient, interaction.commandName.toString(), value.toString())

      // this is so that if they type the number it returns the value
      // if (value.match(/^\d+$/g)) {
      //   autocompleteOptions = [{
      //     name: `${(await cdclient.getObjectName(parseInt(value)))} [${value}]`,
      //     value: value,
      //   }];
      // } else {
      //   autocompleteOptions = await getAutocompleteOptions(cdclient, interaction.commandName.toString(), value.toString())
      // }

      interaction.respond(autocompleteOptions);
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(token);
