import { MessageActionRow } from 'discord.js';
import { reportChannelId } from '../config';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { ModalCommand } from '../types/ModalCommand';

export default {
  name: 'report',
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

    let components = new MessageActionRow().addComponents(
      new Button().setLabel(`Reply to ${interaction.user.username}`).setCustomId(`reply/${interaction.user.id}`)
    );

    let reportChannel = await interaction.client.channels.fetch(reportChannelId);
    if (reportChannel.isText()) await reportChannel.send({
      embeds: [embed],
      components: [components]
    });

    await interaction.reply({ content: 'Your report was recieved!', ephemeral: true });

  },
} as ModalCommand;
