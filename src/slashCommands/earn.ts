import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { dropHomeRow, itemHomeRow } from '../components';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
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
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "item");
    const itemId = parseInt(query) || await cdclient.getObjectId(query);
    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addMissionRewards();

    const embed = new Embed();
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);
    embed.setTitle(`${item.name} [${item.id}]`);

    item.reward.forEach((reward) => {
      // let title = `${reward.type} > ${reward.subtype} > ${reward.name}`
      let title = reward.type;
      if (reward.subtype) title += ` > ${reward.subtype}`;
      title += ` > ${reward.name}`;
      embed.addField(title, `${reward.description} ${bracketURL(reward.id)} Rewards **${reward.rewardCount}**`);
    });

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item, "earn"), itemHomeRow(item)],
    });

  },
} as SlashCommand;
