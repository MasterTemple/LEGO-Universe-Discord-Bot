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

    let query = options.find((option) => option.name === 'activity').value.toString();
    if (!query.match(/;/g)) query = (await cdclient.searchActivity(query))[0].value
    const activityId = parseInt(query.match(/^[^;]+/g)?.[0]);
    const activityName = query.match(/(?<=^[^;]+;).*/g)?.[0];
    const activity = new Activity(cdclient, activityId, activityName);
    await activity.create();

    const embed = new MessageEmbed();
    embed.setURL(activity.getURL());
    embed.setTitle(`${activity.name} [${activity.id}]`);

    activity.rewards.push({ lootTableIndex: -1, chanceForItem: 0, chanceForRarity: 0, maxToDrop: 0, minToDrop: 0, poolSize: 0, rarity: 0, })

    let previousLTI = activity.rewards[0].lootTableIndex;
    let specificDrop = "Specific "
    let anyDrop = "Any "

    activity.rewards.forEach((drop, index) => {
      if (previousLTI !== drop.lootTableIndex) {
        let previousDrop = activity.rewards[index - 1]
        let itemCountStr = `For ${previousDrop.minToDrop}`
        if (previousDrop.minToDrop !== previousDrop.maxToDrop) itemCountStr += `-${previousDrop.maxToDrop} Item`
        if (previousDrop.maxToDrop > 1) itemCountStr += "s"
        if (specificDrop === "Specific ") {
          embed.addField(`${activity.locale.getLootTableName(previousLTI)} - ${percent(previousDrop.chanceForItem)} ${itemCountStr}`, `Conumable Do Not Have Rarity ${bracketURL(previousLTI, "objects/loot/table")}`)
        } else {
          embed.addField(`${activity.locale.getLootTableName(previousLTI)} ${percent(previousDrop.chanceForItem)} ${itemCountStr}`, `${specificDrop}\n${anyDrop}${bracketURL(previousLTI, "objects/loot/table")}`)
        }
        previousLTI = drop.lootTableIndex
        specificDrop = "Specific "
        anyDrop = "Any "
      }
      let chanceForRarity = drop.rarity === 1 ? drop.chanceForRarity : drop.chanceForRarity - activity.rewards[index - 1].chanceForRarity
      // if (drop.poolSize === 0) isConsumable = true;
      if (drop.poolSize > 0) {
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
