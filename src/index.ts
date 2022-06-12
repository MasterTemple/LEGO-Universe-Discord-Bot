import { Client, CommandInteractionOption, Interaction } from 'discord.js';
import { getAutocompleteOptions } from './autocomplete';
import { CDClient } from './cdclient';
import { token } from './config';
import { NameValuePair } from './luInterfaces';
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
});

client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    if (interaction.isApplicationCommand()) {
      const options = interaction.options?.data || [];
      slashCommands.get(interaction.commandName).run(interaction, options, cdclient);
    }

    if (interaction.isAutocomplete()) {
      const options = interaction.options.data;
      let { value } = options.find((f) => f.focused);
      let autocompleteOptions: NameValuePair[] = await getAutocompleteOptions(cdclient, interaction.commandName.toString(), value.toString());
      interaction.respond(autocompleteOptions);
    }

    if (interaction.isMessageComponent()) {
      console.log(interaction.customId);
      console.log(interaction.message.embeds[0].author);
      // console.log(interaction.message.embeds[0].footer);
      // // console.log(interaction.message.embeds[0].thumbnail);
      // // console.log(interaction.message.embeds[0].image);

      let { cmd, id } = [...interaction.customId.matchAll(/^(?<cmd>[^\/]+)\/(?<id>[^\/]+)/gi)][0].groups;
      let options = [{ name: "button", type: "STRING", value: id } as CommandInteractionOption];
      slashCommands.get(cmd).run(interaction, options, cdclient);
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(token);
