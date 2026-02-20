import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'report',
  description: 'Open a dialog to report anything about this bot!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    const modal = new ModalBuilder()
      .setCustomId('report')
      .setTitle('Report');
    const title = new TextInputBuilder()
      .setCustomId('title')
      .setLabel("Title")
      .setStyle(TextInputStyle.Short);
    const input = new TextInputBuilder()
      .setCustomId('input')
      .setLabel("What's would you like to report?")
      .setStyle(TextInputStyle.Paragraph);

    const subject = new ActionRowBuilder<any>().addComponents(title);
    const description = new ActionRowBuilder<any>().addComponents(input);
    modal.addComponents(subject, description);

    if (interaction.isChatInputCommand() || interaction.isMessageComponent()) await interaction.showModal(modal);

  },
} as SlashCommand;
