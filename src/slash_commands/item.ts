import {CommandInteraction, CommandInteractionOption} from 'discord.js';
import {CDClient} from '../cdclient';

export default async function(interaction:CommandInteraction, options: readonly CommandInteractionOption[], cdclient: CDClient) {
  console.log('item');

  interaction.reply({
    content: '```json\n' + JSON.stringify(await cdclient.getComponents(parseInt(options[0].value.toString())), null, 2) + '\n```',
    ephemeral: true,
  });
}
