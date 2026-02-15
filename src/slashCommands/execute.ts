import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'execute',
  description: 'Open a dialog to execute multiple commands on this bot!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    const modal = new ModalBuilder()
      .setCustomId('execute')
      .setTitle('Execute Commands');
    const input = new TextInputBuilder()
      .setCustomId('input')
      .setLabel("List one command per line. Ex: /drop 7570")
      .setStyle(TextInputStyle.Paragraph);

    const description = new ActionRowBuilder<any>().addComponents(input);
    modal.addComponents(description);

    if (interaction.isChatInputCommand() || interaction.isMessageComponent()) await interaction.showModal(modal);
    if (interaction.isModalSubmit()) await interaction.reply({ content: "Nice try", ephemeral: true });


  },
} as SlashCommand;
