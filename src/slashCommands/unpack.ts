import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { dropHomeRow, itemHomeRow } from '../components';
import { fillEmbedWithLootDrops } from '../discord';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { decimalToFraction } from '../math';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'unpack',
  description: 'View all packages that drop an item!',
  options: [
    {
      name: 'package',
      description: 'A package in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "package");
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addUnpacks();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);

    fillEmbedWithLootDrops(embed, item.unpack, item.name);

    if (embed.fields.length === 0) {
      embed.addField("Not Unpacked!", `${item.name} is not found by opening a package!`);
    }

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item, "unpack"), itemHomeRow(item)],
    });

  },
} as SlashCommand;
