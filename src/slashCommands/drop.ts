import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { fillEmbedWithLootDrops } from '../discord';
import { bracketURL, getOption } from '../functions';
import { decimalToFraction } from '../math';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'drop',
  description: 'View all smashables that drop an item!',
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

    const query = getOption(options, "item")
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addDrops();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)

    fillEmbedWithLootDrops(embed, item.drop, item.name)

    if (embed.fields.length === 0) {
      embed.addField("Not Dropped!", `${item.name} is not found by smashing anything!`)
    }

    if (interaction.isMessageComponent()) {
      interaction.update({
        embeds: [embed],
      })
    }
    if (interaction.isApplicationCommand()) {
      interaction.reply({
        embeds: [embed],
      });
    }
  },
} as SlashCommand;
