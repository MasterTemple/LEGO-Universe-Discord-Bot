import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL, getOption, replyOrUpdate, textToChunks } from '../functions';
import { ObjectElement } from '../luInterfaces';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';
// this was to sort them by location

// const locations = {
//   "AG": "Avant Gardens",
//   "AM": "Aura Mar",
//   "CP": "Crux Prime",
//   "CT": "CT",
//   "DMB": "DMB",
//   "FB": "Frostbluff",
//   "FV": "Forbidden Valley",
//   "FVR": "Forbidden Valley Race Place",
//   "GC": "GC",
//   "GF": "Gnarled Forest",
//   "NO": "No Location",
//   "ND": "ND",
//   "NJ": "Ninjago",
//   "NJMON": "Ninjago Monastary",
//   "NJ Mon": "Ninjago Monastary",
//   "NS": "Nimbus Station",
//   "NT": "Nexus Tower",
//   "OLD": "OLD",
//   "PC": "Pet Cove",
//   "PR": "Pet Cove",
//   "PROLD": "PROLD",
//   "RAF": "RAF",
//   "UGG": "UGG",
//   "VO": "VO",
//   "WBL": "World Builder League",
//   "ZP": "ZP",
// }
// const locationRegex = new RegExp(`(${Object.keys(locations).join("|")})`, "g")
// item.buy.forEach((vendor) => {
//   let location = vendor.name.match(locationRegex)?.[0] || "NO";
//   if (locationToNPC.has(location)) {
//     locationToNPC.get(location).push(vendor);
//   } else {
//     locationToNPC.set(location, [vendor]);
//   }
// })
// locationToNPC.forEach((vendors, location) => {
//   embed.addField(location, vendors.map((vendor) => `${vendor.name} [[${vendor.id}]](${item.getURL(vendor.id)}`).join("\n"))
// })

export default {
  name: 'buy',
  description: 'View all vendors that sell an item!',
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
    await item.addVendors();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)

    let price: string = ""
    let costs = [];
    if (item.itemComponent.buyPrice) costs.push(`**${item.itemComponent.buyPrice}** Coins`)
    if (item.itemComponent.commendationCurrencyCost) costs.push(`**${item.itemComponent.commendationCurrencyCost}** ${item.itemComponent.commendationCurrencyName}s`)
    if (item.itemComponent.alternateCurrencyCost) costs.push(`**${item.itemComponent.alternateCurrencyCost}** ${item.itemComponent.alternateCurrencyName}s`)
    price = costs.join(" **+** ")

    if (item.buy.length) {
      let vendorsText = item.buy.map((vendor, index) => `**${index + 1}.** ${vendor.name} ${bracketURL(vendor.id)} for ${price}`).join("\n");
      textToChunks(vendorsText).forEach((vendors) => {
        embed.addField("Vendors", vendors)
      })

    } else {
      embed.addField("Not Sold!", `${item.name} is not sold by a vendor!`)
    }

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      pageSize: 1
    })

  },
} as SlashCommand;
