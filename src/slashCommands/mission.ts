import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL } from '../functions';
import { Mission } from '../types/Mission';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'mission',
  description: 'View the stats of a mission!',
  options: [
    {
      name: 'mission',
      description: 'A mission in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'mission').value.toString();
    const missionId = parseInt(query) || (await cdclient.locale.searchMissions(query))?.[0]?.value;
    const mission = new Mission(cdclient, missionId);
    await mission.create();

    const embed = new MessageEmbed();
    embed.setURL(mission.getURL());
    embed.setThumbnail(mission.imageURL)
    embed.setTitle(mission.data.isRepeatable ? `${mission.name} [${mission.id}] (Repeatable)`: `${mission.name} [${mission.id}]`);

    let title = mission.data.type
    if (mission.data.subtype) title += ` > ${mission.data.subtype}`
    title += ` > ${mission.data.name}`

    embed.addField("Mission", title)
    embed.addField("Objective", mission.data.description)

    embed.addField("Accept From", `${mission.data.giver.name} ${bracketURL(mission.data.giver.id)}`, true)
    embed.addField("Return To", `${mission.data.accepter.name} ${bracketURL(mission.data.accepter.id)}`, true)
    
    embed.addField(mission.raw.isChoiceReward ? "Rewards (Choose One)": "Rewards", mission.data.rewards.map((reward, index) => `${reward.name} ${bracketURL(reward.id)} x **${reward.count}**`).join("\n"))
    
    embed.addField("LEGO Score", (mission.raw.LegoScore || 0).toString(), true)
    embed.addField("Reward Coins", (mission.raw.reward_currency || 0).toString(), true)
    embed.addField("Reputation", (mission.raw.reward_reputation || 0).toString(), true)

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
