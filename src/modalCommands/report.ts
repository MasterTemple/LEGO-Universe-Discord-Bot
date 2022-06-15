import { reportChannelId } from '../config';
import { Embed } from '../types/Embed';
import { ModalCommand } from '../types/ModalCommand';

export default {
  name: 'report',
  description: 'Open a dialog to report anything about this bot!',
  options: [],
  run: async function (
    interaction,
    cdclient) {

    let embed = new Embed();
    embed.setTitle(interaction.fields.getTextInputValue("title"));
    embed.setDescription(interaction.fields.getTextInputValue("input"));
    embed.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL()
    });

    delete embed.footer;

    let reportChannel = await interaction.client.channels.fetch(reportChannelId);
    if (reportChannel.isText()) await reportChannel.send({
      embeds: [embed]
    });

  },
} as ModalCommand;
