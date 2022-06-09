import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
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
    const activityId = query.match(/^[^;]+/g);
    const activityName = query.match(/(?<=^[^;]+;).*/g)
    const activity = new Activity(cdclient, activityId, activityName);
    await activity.create();

    const embed = new MessageEmbed();
    embed.setURL(activity.getURL());
    embed.setTitle(`${activity.name} [${activity.id}]`);

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
