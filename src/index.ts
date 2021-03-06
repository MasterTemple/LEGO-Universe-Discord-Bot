import { Client, CommandInteractionOption, Interaction } from 'discord.js';
import { getAutocompleteOptions } from './autocomplete';
import { CDClient } from './cdclient';
import { token } from './config';
import { error } from './error';
import { NameValuePair } from './luInterfaces';
import { getComponentCommands, getModalCommands, getSlashCommands, updateSlashCommands } from './setup';
import { ComponentCommandMap } from './types/ComponentCommand';
import { ModalCommandMap } from './types/ModalCommand';
import { SlashCommandMap } from './types/SlashCommand';

export const cdclient = new CDClient();

const client = new Client({
  intents: [],
});

export const slashCommands: SlashCommandMap = getSlashCommands();
export const modalCommands: ModalCommandMap = getModalCommands();
export const componentCommands: ComponentCommandMap = getComponentCommands();

client.once('ready', async () => {
  console.log('\n------------------------------------\n');
  await cdclient.load();
  updateSlashCommands(client, slashCommands);
  console.log('\n------------------------------------\n');
  console.log('LEGO Universe Discord Bot is online.');
});

client.on('interactionCreate', async (interaction: Interaction) => {
  try {
    if (interaction.isAutocomplete()) {
      const options = interaction.options.data;
      let { value } = options.find((f) => f.focused);
      let autocompleteOptions: NameValuePair[] = await getAutocompleteOptions(cdclient, interaction.commandName.toString(), value.toString());
      await interaction.respond(autocompleteOptions);
    }

    if (interaction.isApplicationCommand()) {
      const options = interaction.options?.data || [];
      await slashCommands.get(interaction.commandName).run(interaction, options, cdclient);
    }

    if (interaction.isMessageComponent()) {
      let { cmd, id } = [...interaction.customId.matchAll(/^(?<cmd>[^\/]+)\/(?<id>[^\/]+)/gi)][0].groups;
      let options = [{ name: "button", type: "STRING", value: id } as CommandInteractionOption];
      if (slashCommands.has(cmd)) {
        await slashCommands.get(cmd).run(interaction, options, cdclient);
      } else {
        await componentCommands.get(cmd).run(interaction, cdclient);
      }
    }

    if (interaction.isModalSubmit()) {
      let cmd = interaction.customId.match(/^[^\/]+/g)[0];
      await modalCommands.get(cmd).run(interaction, cdclient);
      if (interaction.replied === false) await interaction.reply({ content: 'Your response was recieved!', ephemeral: true });
    }
  } catch (err) {
    if (interaction.isMessageComponent() || interaction.isApplicationCommand()) {
      error(interaction, err);
    }
  }
});

client.login(token);
