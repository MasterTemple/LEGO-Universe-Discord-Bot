import { Embed } from '../types/Embed';
import { ModalCommand } from '../types/ModalCommand';

export default {
  name: 'reply',
  run: async function (
    interaction,
    cdclient) {

    let embed = new Embed();
    embed.setTitle(`Report Response`);
    embed.setDescription(interaction.fields.getTextInputValue("input"));
    embed.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL()
    });

    (embed.data as any).footer = undefined;

    let userId = interaction.customId.match(/(?<=^[^\/]+\/)\d+/g)?.[0];
    let user = await interaction.client.users.fetch(userId);

    await user.send({
      embeds: [embed],
    });

    await interaction.reply({
      embeds: [embed],
    });

  },
} as ModalCommand;
