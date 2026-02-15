import { ActionRowBuilder, ButtonBuilder, MessageFlags } from 'discord.js';
import { reportChannelId } from '../config';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { ModalCommand } from '../types/ModalCommand';

export default {
  name: 'report',
  run: async function (
    interaction,
    cdclient) {

    const embed = new Embed();
    embed.setTitle(interaction.fields.getTextInputValue('title'));
    embed.setDescription(interaction.fields.getTextInputValue('input'));
    embed.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL() || undefined,
    });
    (embed.data as any).footer = undefined;

    const components = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new Button().setLabel(`Reply to ${interaction.user.username}`).setCustomId(`reply/${interaction.user.id}`),
    );

    const reportChannel = await interaction.client.channels.fetch(reportChannelId);
    if (reportChannel && 'send' in reportChannel) {
      await reportChannel.send({
        embeds: [embed],
        components: [components],
      });
    }

    await interaction.reply({ content: 'Your report was recieved!', flags: MessageFlags.Ephemeral });

  },
} as ModalCommand;
