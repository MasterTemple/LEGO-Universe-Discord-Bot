import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { fillEmbedWithLootDrops } from '../discord';
import { bracketURL } from '../functions';
import { decimalToFraction } from '../math';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'get',
  description: 'View how to get an item!',
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
    await item.findHowToGet();


    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)

    embed.setDescription(`${item.get.isFromMission ? "✅" : "❌"} Can be earned from a mission\n${item.get.isFromSmashable ? "✅" : "❌"} Can be dropped from a smashable\n${item.get.isFromPackage ? "✅" : "❌"} Can be dropped from a package\n${item.get.isFromActivity ? "✅" : "❌"} Can be rewarded from an activity\n${item.get.isFromVendor ? "✅" : "❌"} Can be bought from a vendor\n`)

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
