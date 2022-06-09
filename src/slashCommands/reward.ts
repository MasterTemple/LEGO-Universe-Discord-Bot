import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'reward',
  description: 'View all activities that drop an item!',
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
    await item.addRewards();

    const embed = new MessageEmbed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL)

    let c = 1;

    item.activityRewards.forEach((eachDrop, index) => {
      if (eachDrop.smashables.length > 0 && embed.fields.length < 25) {
        let range: string;
        if (eachDrop.minToDrop === eachDrop.maxToDrop) {
          range = eachDrop.minToDrop.toString();
        } else {
          range = `${eachDrop.minToDrop}-${eachDrop.maxToDrop}`;
        }
        embed.addField(
          `${c++}. ${decimalToFraction(eachDrop.chance)} for ${range} ${item.name} `,
          `From ${eachDrop.smashables.map(({ name, id }) => `${name} ${bracketURL(id, "activities")}`).join(', ')} `.slice(0, 1023),
        );
      }
    });

    if (embed.fields.length === 0) {
      embed.addField("Not Rewarded!", `${item.name} is not rewarded from an activity!`)
    }

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
