import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { fillEmbedWithSmashableDrops } from '../discord';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { percent } from '../math';
import { Activity } from '../types/Activity';
import { Embed } from '../types/Embed';
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
    interaction,
    options,
    cdclient) {

    let query = getOption(options, "activity");
    if (!query.match(/;/g)) query = (await cdclient.searchActivity(query))[0].value;
    const activityId = parseInt(query.match(/^[^;]+/g)?.[0]);
    const activityName = query.match(/(?<=^[^;]+;).*/g)?.[0];
    const activity = new Activity(cdclient, activityId, activityName);
    await activity.create();

    const embed = new Embed();
    embed.setURL(activity.getURL());
    embed.setTitle(`${activity.name} [${activity.id}]`);

    fillEmbedWithSmashableDrops(embed, activity.rewards, activity.locale);

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed]
    });

  },
} as SlashCommand;
