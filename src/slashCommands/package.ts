import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { dropHomeRow, itemHomeRow } from '../components';
import { fillEmbedWithSmashableDrops } from '../discord';
import { notFound } from '../error';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { percent } from '../math';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'package',
  description: 'View all items given from a package!',
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

    if (!itemId) {
      notFound(interaction);
      return;
    }

    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addPackageDrops();

    const embed = new Embed();
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);
    embed.setTitle(`${item.name} [${item.id}]`);

    fillEmbedWithSmashableDrops(embed, item.packageDrops, item.locale);

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item), itemHomeRow(item, "package")],
    });

  },
} as SlashCommand;
