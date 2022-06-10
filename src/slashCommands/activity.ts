import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL } from '../functions';
import { percent } from '../math';
import { Activity } from '../types/Activity';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'activity',
  description: 'View all activitys given from an activity!',
  options: [
    {
      name: 'activity',
      description: 'An activity in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'activity').value.toString();
    const activityId = parseInt(query.match(/^[^;]+/g)?.[0]);
    const activityName = query.match(/(?<=^[^;]+;).*/g)?.[0]
    const activity = new Activity(cdclient, activityId, activityName);
    await activity.create();

    const embed = new MessageEmbed();
    embed.setURL(activity.getURL());
    embed.setTitle(`${activity.name} [${activity.id}]`);

    activity.rewards.push({ lootTableIndex: -1, chanceForItem: 0, chanceForRarity: 0, maxToDrop: 0, minToDrop: 0, poolSize: 0, rarity: 0, })

    let previousLTI = activity.rewards[0].lootTableIndex;
    let specificDrop = "Specific "
    let anyDrop = "Any "
    // consumable isn't necessary cause it is a package but i copy pasted so oh well
    let isConsumable = false;
    activity.rewards.forEach((drop, index) => {
      if (drop.lootTableIndex >= 0) {
        if (previousLTI !== drop.lootTableIndex) {
          let itemCountStr = `For ${drop.minToDrop}`
          if (drop.minToDrop !== drop.maxToDrop) itemCountStr += `-${drop.maxToDrop} Item`
          if (drop.maxToDrop > 1) itemCountStr += "s"
          if (isConsumable) {
            embed.addField(`${activity.locale.getLootTableName(drop.lootTableIndex)} - ${percent(drop.chanceForItem)} ${itemCountStr}`, `Conumable Do Not Have Rarity ${bracketURL(drop.lootTableIndex, "objects/loot/table")}`)
          } else {
            embed.addField(`${activity.locale.getLootTableName(drop.lootTableIndex)} percent(drop.chanceForItem)} ${itemCountStr}`, `${specificDrop}\n${anyDrop}${bracketURL(drop.lootTableIndex, "objects/loot/table")}`)
          }
          previousLTI = drop.lootTableIndex
          specificDrop = "Specific "
          anyDrop = "Any "
          isConsumable = false;
        }
        let chanceForRarity = drop.rarity === 1 ? drop.chanceForRarity : drop.chanceForRarity - activity.rewards[index - 1].chanceForRarity
        if (drop.poolSize === 0) isConsumable = true;
        specificDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem)} `
        anyDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem * (1 / drop.poolSize))} `
      }
    })
    activity.rewards.pop();
    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
