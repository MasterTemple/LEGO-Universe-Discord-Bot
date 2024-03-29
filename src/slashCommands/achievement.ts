import { notFound as achievement } from '../error';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { formatNum } from '../math';
import { Embed } from '../types/Embed';
import { Mission } from '../types/Mission';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'achievement',
  description: 'View the stats of an achievement!',
  options: [
    {
      name: 'achievement',
      description: 'A mission in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "achievement");
    const missionId = parseInt(query) || parseInt((cdclient.locale.searchMissions(query))?.[0]?.value);

    if (!missionId) {
      achievement(interaction);
      return;
    }

    const mission = new Mission(cdclient, missionId);
    await mission.create();

    const embed = new Embed();
    embed.setURL(mission.getURL());
    embed.setThumbnail(mission.imageURL);
    embed.setTitle(mission.data.isRepeatable ? `${mission.name} [${mission.id}] (Repeatable)` : `${mission.name} [${mission.id}]`);

    let title = mission.data.type;
    if (mission.data.subtype) title += ` > ${mission.data.subtype}`;
    title += ` > ${mission.data.name}`;

    embed.addField("Mission", title);
    embed.addField("Objective", mission.data.description);
    if (!mission.data.isAchievement) {
      embed.addField("Accept From", `${mission.data.giver.name} ${bracketURL(mission.data.giver.id)}`, true);
      embed.addField("Return To", `${mission.data.accepter.name} ${bracketURL(mission.data.accepter.id)}`, true);
    }

    embed.addField(mission.raw.isChoiceReward ? "Rewards (Choose One)" : "Rewards", mission.data.rewards.map((reward, index) => `${reward.name} ${bracketURL(reward.id)} x **${reward.count}**`).join("\n"));

    embed.addField("LEGO Score", (mission.raw.LegoScore || 0).toString(), true);
    embed.addField("Reward Coins", (formatNum(mission.raw.reward_currency) || 0).toString(), true);

    if (mission.raw.reward_bankinventory) embed.addField("Vault Increase", (mission.raw.reward_bankinventory).toString(), true);
    else if (mission.raw.reward_maximagination) embed.addField("Imagination Bonus", (mission.raw.reward_maximagination).toString(), true);
    else if (mission.raw.reward_maxhealth) embed.addField("Health Bonus", (mission.raw.reward_maxhealth).toString(), true);
    else if (mission.raw.reward_maxinventory) embed.addField("Inventory Increase", (mission.raw.reward_maxinventory).toString(), true);
    else embed.addField("Reputation Increase", (mission.raw.reward_reputation).toString(), true);

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      isPaged: false
    });

  },
} as SlashCommand;
