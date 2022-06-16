import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'report',
  description: 'Open a dialog to report anything about this bot!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    const modal = new Modal()
      .setCustomId('report')
      .setTitle('Report');
    const title = new TextInputComponent()
      .setCustomId('title')
      .setLabel("Title")
      .setStyle('SHORT');
    const input = new TextInputComponent()
      .setCustomId('input')
      .setLabel("What's would you like to report?")
      .setStyle('PARAGRAPH');

    const subject = new MessageActionRow<ModalActionRowComponent>().addComponents(title);
    const description = new MessageActionRow<ModalActionRowComponent>().addComponents(input);
    modal.addComponents(subject, description);

    if (interaction.isApplicationCommand() || interaction.isMessageComponent()) await interaction.showModal(modal);

  },
} as SlashCommand;
