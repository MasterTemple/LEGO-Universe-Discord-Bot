import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { getOption } from '../functions';
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
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = getOption(options, "item")
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)
    // console.log(item.imageURL)
    embed.addField("Preconditions",
      item.itemComponent.preconditions.length ? item.itemComponent.preconditions.map((p, i) => `**${i + 1}.** ${p.description}`).join("\n") : "This item has no preconditions to use it!"
    )

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
