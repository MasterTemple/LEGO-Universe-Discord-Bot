import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Enemy } from '../types/Enemy';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'enemy',
  description: 'View the stats of an enemy!',
  options: [
    {
      name: 'enemy',
      description: 'An enemy in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "enemy")
    const enemyId = parseInt(query) || await cdclient.getObjectId(query);
    const enemy = new Enemy(cdclient, enemyId);
    await enemy.create();

    const embed = new Embed();
    embed.setURL(enemy.getURL());
    // embed.setThumbnail(enemy.imageURL)
    embed.setTitle(`${enemy.name} [${enemy.id}]`);

    embed.setDescription(`Life: **${enemy.life}**\nArmor: **${enemy.armor}**`)

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      isPaged: false
    })

  },
} as SlashCommand;
