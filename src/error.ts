import { ChatInputCommandInteraction, MessageComponentInteraction, MessageFlags, ModalSubmitInteraction } from 'discord.js';
import { logChannelId } from './config';
import { Embed } from './types/Embed';

const NOT_FOUND_IMAGE_URL = 'https://media.discordapp.net/attachments/820782771403751478/986374533630013500/unknown.png';

export async function notFound(interaction: ChatInputCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction): Promise<void> {
  const embed = new Embed();
  embed.setImage(NOT_FOUND_IMAGE_URL);
  embed.addField('Your search was not found.', 'Please use the autocomplete suggestions to be safe :)');
  await interaction.reply({
    embeds: [embed],
    flags: MessageFlags.Ephemeral,
  });
}

export async function error(interaction: ChatInputCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction, err: any): Promise<void> {
  console.log(err);

  const embed = new Embed();
  embed.setTitle('Error');
  embed.setDescription(`\`\`\`\n${err.toString()}\`\`\``);

  await interaction.reply({
    embeds: [embed],
    flags: MessageFlags.Ephemeral,
  });

  if (interaction.isChatInputCommand()) {
    embed.addField('Command', `\`\`\`\n/${interaction.commandName} ${interaction.options.data.map((o: any) => `${o.name}:"${o.value}"`).join(' ')}\`\`\``);
  }
  if (interaction.isMessageComponent()) {
    embed.addField('Instruction', `\`\`\`\n${interaction.customId}\`\`\``);
  }

  const logChannel = await interaction.client.channels.fetch(logChannelId);
  if (logChannel && 'send' in logChannel) {
    await logChannel.send({ embeds: [embed] });
  }
}
