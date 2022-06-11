import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { fillEmbedWithLootDrops } from '../discord';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { decimalToFraction } from '../math';
import { Button } from '../types/Button';
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
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "item");
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.findHowToGet();


    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);

    const good = "✅";
    const bad = "❌";

    embed.setDescription(`${item.get.isFromMission ? good : bad} Can be earned from a mission\n${item.get.isFromSmashable ? good : bad} Can be dropped from a smashable\n${item.get.isFromPackage ? good : bad} Can be unpacked from a package\n${item.get.isFromActivity ? good : bad} Can be rewarded from an activity\n${item.get.isFromVendor ? good : bad} Can be bought from a vendor\n`);

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
      components: [buttons],
      isPaged: false
    });
  },
} as SlashCommand;
