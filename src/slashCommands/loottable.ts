import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'loottable',
  description: 'View all items in a loot table!',
  options: [
    {
      name: 'loottable',
      description: 'An Loot Table in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'loottable').value.toString();
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();

    const embed = new MessageEmbed();
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)
    embed.setTitle(`${item.name} [${item.id}]`);

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
