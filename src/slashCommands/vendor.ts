import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL, getOption, replyOrUpdate, textToChunks } from '../functions';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { NPC } from '../types/NPC';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'vendor',
  description: 'View all items sold from a vendor!',
  options: [
    {
      name: 'vendor',
      description: 'An vendor in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "vendor")
    const npcId = parseInt(query) || await cdclient.getObjectId(query);
    const npc = new NPC(cdclient, npcId);
    await npc.create();

    const embed = new Embed();
    embed.setTitle(`${npc.name} [${npc.id}]`);
    embed.setURL(npc.getURL());

    // console.log(npc.vendor)

    if (npc.vendor.length) {
      let vendorsText = npc.vendor.map((item, index) => {

        let totalCost: string = ""
        let costs = [];
        if (item.cost) costs.push(`**${item.cost}** ${item.currency.name}`)
        if (item.commendationCost) costs.push(`**${item.commendationCost}** ${item.commendationCurrency.name}s`)
        if (item.alternateCost) costs.push(`**${item.alternateCost}** ${item.alternateCurrency.name}s`)
        totalCost = costs.join(" **+** ")
        return `**${index + 1}.** ${item.name} ${bracketURL(item.id)} for ${totalCost}`
      }).join("\n");
      let totalSize = 0
      textToChunks(vendorsText).forEach((vendors) => {
        // console.log({ vendors, length: vendors.length })
        totalSize += vendors.length
        if (totalSize <= 6000) embed.addField("Sells", vendors);
      })

    } else {
      embed.addField("Not A Vendor!", `${npc.name} does not sell anything!`)
    }

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      pageSize: 1
    })

  },
} as SlashCommand;
