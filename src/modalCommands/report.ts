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
    const sanitizedTitle = interaction.fields.getTextInputValue('title').trim().slice(0, 256);
    const sanitizedDescription = interaction.fields.getTextInputValue('input').trim().slice(0, 4096);

    embed.setTitle(sanitizedTitle || 'Untitled report');
    embed.setDescription(sanitizedDescription || 'No details provided.');
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
        allowedMentions: { parse: [] },
      });
    }

    await interaction.reply({ content: 'Your report was recieved!', flags: MessageFlags.Ephemeral });

  },
} as ModalCommand;
