import { fillEmbedWithSmashableDrops } from '../discord';
import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Activity } from '../types/Activity';
import { Embed } from '../types/Embed';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'activity',
  description: 'View all rewards given from an activity!',
  options: [
    {
      name: 'activity',
      description: 'An activity in LEGO Universe.',
      type: 3,
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    let query = getOption(options, "activity");
    if (!query.match(/;/g)) query = (await cdclient.searchActivity(query))?.[0]?.value;

    const activityId = parseInt(query?.match(/^[^;]+/g)?.[0]);
    const activityName = query?.match(/(?<=^[^;]+;).*/g)?.[0];

    if (!activityId || !activityName) {
      notFound(interaction);
      return;
    }

    const activity = new Activity(cdclient, activityId, activityName);
    await activity.create();

    const embed = new Embed();
    embed.setURL(activity.getURL());
    embed.setTitle(`${activity.name} [${activity.id}]`);

    fillEmbedWithSmashableDrops(embed, activity.rewards, activity.locale);

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed]
    });

  },
} as SlashCommand;
