import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { executeRoleId } from '../config';
import { SlashCommand } from '../types/SlashCommand';

function hasExecuteAccess(interaction: any): boolean {
  if (!executeRoleId) return true;
  if (!interaction?.inGuild?.()) return false;

  const roles = interaction.member?.roles;
  if (roles?.cache?.has) return roles.cache.has(executeRoleId);

  const roleIds = roles?._roles || roles;
  return Array.isArray(roleIds) ? roleIds.includes(executeRoleId) : false;
}

export default {
  name: 'execute',
  description: 'Open a dialog to execute multiple commands on this bot!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    if (!hasExecuteAccess(interaction)) {
      await interaction.reply({ content: `You need the configured execute role (<@&${executeRoleId}>) to use this command.`, ephemeral: true });
      return;
    }

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
