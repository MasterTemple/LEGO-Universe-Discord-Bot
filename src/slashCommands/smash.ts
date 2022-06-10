import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL } from '../functions';
import { decimalToFraction, percent, round } from '../math';
import { Embed } from '../types/Embed';
import { Enemy } from '../types/Enemy';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'smash',
  description: 'View all enemys given from a package!',
  options: [
    {
      name: 'enemy',
      description: 'An enemy in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'enemy').value.toString();
    const enemyId = parseInt(query) || await cdclient.getObjectId(query);
    const enemy = new Enemy(cdclient, enemyId);
    await enemy.create();
    await enemy.addDrops();

    const embed = new Embed();
    embed.setTitle(`${enemy.name} [${enemy.id}]`);
    embed.setURL(enemy.getURL());
    // embed.setThumbnail(enemy.imageURL)
    // console.log(enemy.drops)
    // to force add last embed
    enemy.drops.push({ lootTableIndex: -1, chanceForItem: 0, chanceForRarity: 0, maxToDrop: 0, minToDrop: 0, poolSize: 1, rarity: 0, })

    let previousLTI = enemy.drops[0].lootTableIndex;
    let specificDrop = "Specific "
    let anyDrop = "Any "
    enemy.drops.forEach((drop, index) => {
      if (previousLTI !== drop.lootTableIndex) {
        let previousDrop = enemy.drops[index - 1]
        let itemCountStr = `For ${previousDrop.minToDrop}`
        if (previousDrop.minToDrop !== previousDrop.maxToDrop) itemCountStr += `-${previousDrop.maxToDrop} Item`
        if (previousDrop.maxToDrop > 1) itemCountStr += "s"
        if (specificDrop === "Specific ") {
          embed.addField(`${enemy.locale.getLootTableName(previousLTI)} - ${percent(previousDrop.chanceForItem)} ${itemCountStr}`, `Conumable Do Not Have Rarity ${bracketURL(previousLTI, "objects/loot/table")}`)
        } else {
          embed.addField(`${enemy.locale.getLootTableName(previousLTI)} - ${percent(previousDrop.chanceForItem)} ${itemCountStr}`, `${specificDrop}\n${anyDrop}${bracketURL(previousLTI, "objects/loot/table")}`)
        }
        previousLTI = drop.lootTableIndex
        specificDrop = "Specific "
        anyDrop = "Any "
      }

      let chanceForRarity = drop.rarity === 1 ? drop.chanceForRarity : drop.chanceForRarity - enemy.drops[index - 1].chanceForRarity
      if (drop.poolSize > 0) {
        specificDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem)} `
        anyDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem * (1 / drop.poolSize))} `
      }
    })
    enemy.drops.pop();

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
