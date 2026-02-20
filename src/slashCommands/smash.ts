import { enemyHomeRow } from '../components';
import { fillEmbedWithSmashableDrops } from '../discord';
import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Enemy } from '../types/Enemy';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'smash',
  description: 'View all enemys given from a package!',
  options: [
    {
      name: 'enemy',
      description: 'An enemy in LEGO Universe.',
      type: 3,
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "enemy");
    const enemyId = parseInt(query) || await cdclient.getObjectId(query);

    if (!enemyId) {
      notFound(interaction);
      return;
    }

    const enemy = new Enemy(cdclient, enemyId);
    await enemy.create();
    await enemy.addDrops();

    const embed = new Embed();
    embed.setTitle(`${enemy.name} [${enemy.id}]`);
    embed.setURL(enemy.getURL());

    fillEmbedWithSmashableDrops(embed, enemy.drops, enemy.locale);

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [enemyHomeRow(enemy, "smash")],

    });

  },
} as SlashCommand;
