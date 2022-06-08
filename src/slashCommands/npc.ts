import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL } from '../functions';
import { NPC } from '../types/NPC';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'npc',
  description: 'View all missions from an NPC!',
  options: [
    {
      name: 'npc',
      description: 'An NPC in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'npc').value.toString();
    const npcId = parseInt(query) || await cdclient.getObjectId(query);
    const npc = new NPC(cdclient, npcId);
    await npc.create();

    const embed = new MessageEmbed();
    embed.setURL(npc.getURL());
    embed.setThumbnail(npc.imageURL)
    embed.setTitle(`${npc.name} [${npc.id}]`);

    npc.missions.forEach((mission, i) => {
      let title = `${i + 1}. ${mission.type}`
      if (mission.subtype) title += ` > ${mission.subtype}`
      title += ` > ${mission.name}`
      embed.addField(title, `${mission.description} ${bracketURL(mission.id, "missions")}`)
    })

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
