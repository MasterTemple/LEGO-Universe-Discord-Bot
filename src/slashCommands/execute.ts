import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'execute',
  description: 'Open a dialog to execute multiple commands on this bot!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    const modal = new Modal()
      .setCustomId('execute')
      .setTitle('Execute Commands');
    const input = new TextInputComponent()
      .setCustomId('input')
      .setLabel("List one command per line. Ex: /drop 7570")
      .setStyle('PARAGRAPH');

    const description = new MessageActionRow<ModalActionRowComponent>().addComponents(input);
    modal.addComponents(description);

    if (interaction.isApplicationCommand() || interaction.isMessageComponent()) await interaction.showModal(modal);
    if (interaction.isModalSubmit()) await interaction.reply({ content: "Nice try", ephemeral: true });


  },
} as SlashCommand;
