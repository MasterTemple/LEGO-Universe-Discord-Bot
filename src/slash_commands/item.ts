import {CommandInteraction, CommandInteractionOption} from 'discord.js';
import {CDClient} from '../cdclient';
import { Item } from '../types/Item';
import {SlashCommand} from '../types/SlashCommand';

export default {
  name: 'item',
  description: 'Get information about an item',
  options: [
    {
      name: 'id',
      description: 'The id of the item',
      type: 'NUMBER',
      required: true,
    }],
  run: async function(
      interaction: CommandInteraction,
      options: readonly CommandInteractionOption[],
      cdclient: CDClient) {
    console.log('/item');
    const itemId = parseInt(options.find((option) => option.name === 'id').value.toString())
    const item = new Item(cdclient, itemId);

    interaction.reply({
      content: '```json\n' +
      JSON.stringify(await cdclient.getComponents(parseInt(options[0].value.toString())), null, 2) +
      '\n```',
      ephemeral: true,
    });
  },
} as SlashCommand;
