import { NPCHomeRow } from '../components';
import { notFound } from '../error';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
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
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "npc");
    const npcId = parseInt(query) || await cdclient.getObjectId(query);

    if (!npcId) {
      notFound(interaction);
      return;
    }

    const npc = new NPC(cdclient, npcId);
    await npc.create();

    const embed = new Embed();
    embed.setURL(npc.getURL());
    embed.setThumbnail(npc.imageURL);
    embed.setTitle(`${npc.name} [${npc.id}]`);

    npc.missions.forEach((mission, i) => {
      let title = `${i + 1}. ${mission.type}`;
      if (mission.subtype) title += ` > ${mission.subtype}`;
      title += ` > ${mission.name}`;
      embed.addField(title, `${mission.description} ${bracketURL(mission.id, "missions")}`);
    });

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [NPCHomeRow(npc, "npc")],
    });

  },
} as SlashCommand;
