import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { fillEmbedWithLootDrops } from '../discord';
import { bracketURL } from '../functions';
import { decimalToFraction } from '../math';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'reward',
  description: 'View all activities that drop an item!',
  options: [
    {
      name: 'item',
      description: 'An item in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'item').value.toString();
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addRewards();

    const embed = new MessageEmbed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)

    fillEmbedWithLootDrops(embed, item.activityRewards, item.name);

    if (embed.fields.length === 0) {
      embed.addField("Not Rewarded!", `${item.name} is not rewarded from an activity!`)
    }

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
