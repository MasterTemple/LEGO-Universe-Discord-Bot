import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient, PACKAGE_COMPONENT } from '../cdclient';
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

    let buttons = new MessageActionRow().addComponents(
      new Button().setLabel("Item").setCustomId(`item/${item.id}`),
      new Button().setLabel("Get").setCustomId(`get/${item.id}`),
      new Button().setLabel("Preconditions").setCustomId(`preconditions/${item.id}`).setStyle("SUCCESS"),
    )
    if (item.components.some((comp) => comp.component_type === PACKAGE_COMPONENT)) buttons.addComponents(
      new Button().setLabel("Open").setCustomId(`package/${item.id}`),
    )

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [buttons],
    })

  },
} as SlashCommand;
