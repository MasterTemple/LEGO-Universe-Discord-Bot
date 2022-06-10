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

      interaction.respond(autocompleteOptions);
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(token);
