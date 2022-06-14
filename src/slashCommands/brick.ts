import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'brick',
  description: 'View the stats of a brick!',
  options: [
    {
      name: 'brick',
      description: 'An brick in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "brick");
    const itemId = parseInt(query) || await cdclient.getObjectId(query);

    if (!itemId) {
      notFound(interaction);
      return;
    }

    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addObjectData();

    const embed = new Embed();
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);
    embed.setTitle(`${item.name} [${item.id}]`);

    embed.addField("Name", item.name, true);
    embed.addField("Description", item.objectData.description || "None", true);
    embed.addField("Internal Notes", item.objectData._internalNotes || "None", true);
    embed.addField("Cost", item.itemComponent?.buyPrice?.toString() || "0", true);
    embed.addField("Stack Size", item.itemComponent?.stackSize?.toString() || "999", true);
    embed.addField("Level Requirement", item.itemComponent?.levelRequirement?.toString() || "0", true);

    let buttons = new MessageActionRow().addComponents(
      new Button().setDisabled(!item.get.isFromMission).setLabel("Earn").setCustomId(`earn/${itemId}`),
      new Button().setDisabled(!item.get.isFromSmashable).setLabel("Drop").setCustomId(`drop/${itemId}`),
      new Button().setDisabled(!item.get.isFromPackage).setLabel("Unpack").setCustomId(`unpack/${itemId}`),
      new Button().setDisabled(!item.get.isFromActivity).setLabel("Reward").setCustomId(`reward/${itemId}`),
      new Button().setDisabled(!item.get.isFromVendor).setLabel("Buy").setCustomId(`buy/${itemId}`),
    );

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      isPaged: false,
      components: [buttons],
    });
  },
} as SlashCommand;
