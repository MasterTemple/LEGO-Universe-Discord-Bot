import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { fillEmbedWithLootDrops } from '../discord';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { decimalToFraction } from '../math';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
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
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "item")
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addRewards();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)

    fillEmbedWithLootDrops(embed, item.activityRewards, item.name);

    if (embed.fields.length === 0) {
      embed.addField("Not Rewarded!", `${item.name} is not rewarded from an activity!`)
    }

    let buttons = new MessageActionRow().addComponents(
      new Button().setDisabled(!item.get.isFromMission).setLabel("Earn").setCustomId(`earn/${itemId}`),
      new Button().setDisabled(!item.get.isFromSmashable).setLabel("Drop").setCustomId(`drop/${itemId}`),
      new Button().setDisabled(!item.get.isFromPackage).setLabel("Unpack").setCustomId(`unpack/${itemId}`),
      new Button().setDisabled(!item.get.isFromActivity).setLabel("Reward").setCustomId(`reward/${itemId}`).setStyle("SUCCESS"),
      new Button().setDisabled(!item.get.isFromVendor).setLabel("Buy").setCustomId(`buy/${itemId}`),
    )

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [buttons],
    })

  },
} as SlashCommand;
