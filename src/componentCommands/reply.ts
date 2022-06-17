import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { ModalCommand } from '../types/ModalCommand';

export default {
  name: 'reply',
  run: async function (
    interaction,
    cdclient) {

    let userId = interaction.customId.match(/(?<=^[^\/]+\/)\d+/g)?.[0];
    let user = await interaction.client.users.fetch(userId);

    const modal = new Modal()
      .setCustomId(`reply/${userId}`)
      .setTitle(`Reply To ${user.username}`);
    const input = new TextInputComponent()
      .setCustomId('input')
      .setLabel(`What would you like to say to ${user.username}?`)
      .setStyle('PARAGRAPH');

    const description = new MessageActionRow<ModalActionRowComponent>().addComponents(input);
    modal.addComponents(description);

    if (interaction.isApplicationCommand() || interaction.isMessageComponent()) await interaction.showModal(modal);
    if (interaction.isModalSubmit()) await interaction.reply({ content: "Nice try", ephemeral: true });

  },
} as ModalCommand;
