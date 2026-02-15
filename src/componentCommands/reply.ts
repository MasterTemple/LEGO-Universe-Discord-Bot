import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ModalCommand } from '../types/ModalCommand';

export default {
  name: 'reply',
  run: async function (
    interaction,
    cdclient) {

    let userId = interaction.customId.match(/(?<=^[^\/]+\/)\d+/g)?.[0];
    let user = await interaction.client.users.fetch(userId);

    const modal = new ModalBuilder()
      .setCustomId(`reply/${userId}`)
      .setTitle(`Reply To ${user.username}`);
    const input = new TextInputBuilder()
      .setCustomId('input')
      .setLabel(`What would you like to say to ${user.username}?`)
      .setStyle(TextInputStyle.Paragraph);

    const description = new ActionRowBuilder<any>().addComponents(input);
    modal.addComponents(description);

    if (interaction.isChatInputCommand()) await interaction.showModal(modal);
    else if (interaction.isMessageComponent()) await interaction.showModal(modal);
    else if (interaction.isModalSubmit()) await interaction.reply({ content: "Nice try", ephemeral: true });

  },
} as ModalCommand;
