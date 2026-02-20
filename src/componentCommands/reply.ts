import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ComponentCommand } from '../types/ComponentCommand';

export default {
  name: 'reply',
  run: async function (
    interaction,
    cdclient) {

    const userId = interaction.customId.match(/(?<=^[^\/]+\/)\d+/g)?.[0];
    const user = await interaction.client.users.fetch(userId);

    const modal = new ModalBuilder()
      .setCustomId(`reply/${userId}`)
      .setTitle(`Reply To ${user.username}`);
    const input = new TextInputBuilder()
      .setCustomId('input')
      .setLabel(`What would you like to say to ${user.username}?`)
      .setStyle(TextInputStyle.Paragraph);

    const description = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
    modal.addComponents(description);

    await interaction.showModal(modal);
  },
} as ComponentCommand;
