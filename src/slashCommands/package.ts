import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { fillEmbedWithSmashableDrops } from '../discord';
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
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addPackageDrops();

    const embed = new Embed();
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);
    embed.setTitle(`${item.name} [${item.id}]`);

    fillEmbedWithSmashableDrops(embed, item.packageDrops, item.locale);

    let buttons = new MessageActionRow().addComponents(
      new Button().setLabel("Item").setCustomId(`item/${item.id}`),
      new Button().setLabel("Get").setCustomId(`get/${item.id}`),
      new Button().setLabel("Preconditions").setCustomId(`preconditions/${item.id}`),
      new Button().setLabel("Open").setCustomId(`package/${item.id}`).setStyle("SUCCESS"),
    );

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [buttons],
    });

  },
} as SlashCommand;
