import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL } from '../functions';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'earn',
  description: 'View all missions that reward an item!',
  options: [
    {
      name: 'item',
      description: 'An item in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'item').value.toString();
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addMissionRewards();

    const embed = new MessageEmbed();
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)
    embed.setTitle(`${item.name} [${item.id}]`);

    item.reward.forEach((reward) => {
      // let title = `${reward.type} > ${reward.subtype} > ${reward.name}`
      let title = reward.type
      if (reward.subtype) title += ` > ${reward.subtype}`
      title += ` > ${reward.name}`
      embed.addField(title, `${reward.description} ${bracketURL(reward.id)} Rewards **${reward.rewardCount}**`)
    })

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
