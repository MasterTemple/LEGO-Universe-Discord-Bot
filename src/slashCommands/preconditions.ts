import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient, PACKAGE_COMPONENT } from '../cdclient';
import { dropHomeRow, itemHomeRow } from '../components';
import { getOption, replyOrUpdate } from '../functions';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'preconditions',
  description: 'View the preconditions to use an item!',
  options: [
    {
      name: 'item',
      description: 'An item in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "item");
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);
    // console.log(item.imageURL)
    embed.addField("Preconditions",
      item.itemComponent.preconditions.length ? item.itemComponent.preconditions.map((p, i) => `**${i + 1}.** ${p.description}`).join("\n") : "This item has no preconditions to use it!"
    );

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item), itemHomeRow(item, "preconditions")],
    });

  },
} as SlashCommand;
