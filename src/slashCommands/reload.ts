import { replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'reload',
  description: 'Reload the data from the cdclient.sqlite and locale.xml!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    await cdclient.locale.reload();

    const embed = new Embed();
    embed.setTitle(`Reload Successful!`);

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      isPaged: false,
      components: [],
    });
  },
} as SlashCommand;
