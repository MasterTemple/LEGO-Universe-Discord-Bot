import {AutocompleteInteraction, Client, CommandInteraction, CommandInteractionOption, Interaction} from 'discord.js';
import {CDClient} from './cdclient';
import {token} from './config.json';
import {getSlashCommands, updateSlashCommands} from './setup';
import {SlashCommandMap} from './types/SlashCommand';

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
  if(interaction.isApplicationCommand()){
    const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
    slashCommands.get(interaction.commandName).run(interaction, options, cdclient);
  }

  if (interaction.isAutocomplete()) {

      const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
      // this is currently a general search for ALL objects in the 'Objects' table
      let autocompleteOptions = await cdclient.searchObject(options.find((f) => f.focused).value.toString())
      interaction.respond(autocompleteOptions)
  }


});

client.login(token);
