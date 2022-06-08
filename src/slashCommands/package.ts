import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL } from '../functions';
import { percent } from '../math';
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
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'package').value.toString();
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addPackageDrops();

    const embed = new MessageEmbed();
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)
    embed.setTitle(`${item.name} [${item.id}]`);

    item.packageDrops.push({ lootTableIndex: -1, chanceForItem: 0, chanceForRarity: 0, maxToDrop: 0, minToDrop: 0, poolSize: 0, rarity: 0, })

    let previousLTI = item.packageDrops[0].lootTableIndex;
    let specificDrop = "Specific "
    let anyDrop = "Any "
    // consumable isn't necessary cause it is a package but i copy pasted so oh well
    let isConsumable = false;
    item.packageDrops.forEach((drop, index) => {
      if (drop.lootTableIndex >= 0) {
        if (previousLTI !== drop.lootTableIndex) {
          let itemCountStr = `For ${drop.minToDrop}`
          if (drop.minToDrop !== drop.maxToDrop) itemCountStr += `-${drop.maxToDrop} Item`
          if (drop.maxToDrop > 1) itemCountStr += "s"
          if (isConsumable) {
            embed.addField(`LTI NAME HERE - ${percent(drop.chanceForItem)} ${itemCountStr}`, `Conumable Do Not Have Rarity ${bracketURL(drop.lootTableIndex, "objects/loot/table")}`)
          } else {
            embed.addField(`LTI NAME HERE - ${percent(drop.chanceForItem)} ${itemCountStr}`, `${specificDrop}\n${anyDrop}${bracketURL(drop.lootTableIndex, "objects/loot/table")}`)
          }
          previousLTI = drop.lootTableIndex
          specificDrop = "Specific "
          anyDrop = "Any "
          isConsumable = false;
        }
        let chanceForRarity = drop.rarity === 1 ? drop.chanceForRarity : drop.chanceForRarity - item.packageDrops[index - 1].chanceForRarity
        if (drop.poolSize === 0) isConsumable = true;
        specificDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem)} `
        anyDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem * (1 / drop.poolSize))} `
      }
    })
    item.packageDrops.pop();

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
