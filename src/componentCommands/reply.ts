import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { ModalCommand } from '../types/ModalCommand';

export default {
  name: 'reply',
  run: async function (
    interaction,
    cdclient) {

    // let embed = new Embed();
    // embed.setTitle(interaction.fields.getTextInputValue("title"));
    // embed.setDescription(interaction.fields.getTextInputValue("input"));
    // embed.setAuthor({
    //   name: interaction.user.username,
    //   iconURL: interaction.user.avatarURL()
    // });

    // delete embed.footer;

    // let components = new MessageActionRow().addComponents(
    //   new Button().setLabel("Reply").setCustomId(`reply/${interaction.user.id}`)
    // );

    // // let reportChannel = await interaction.client.channels.fetch(reportChannelId);
    let userId = interaction.customId.match(/(?<=^[^\/]+\/)\d+/g)?.[0];
    let user = await interaction.client.users.fetch(userId);

    // await user.send({
    //   embeds: [embed],
    //   components: [components]
    // });
    // let user = await
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
