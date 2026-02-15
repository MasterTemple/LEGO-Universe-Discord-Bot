import { slashCommands } from '..';
import { executeRoleId } from '../config';
import { error } from '../error';
import { Embed } from '../types/Embed';
import { ModalCommand } from '../types/ModalCommand';

function hasExecuteAccess(interaction: any): boolean {
  if (!executeRoleId) return true;
  if (!interaction?.inGuild?.()) return false;

  const roles = interaction.member?.roles;
  if (roles?.cache?.has) return roles.cache.has(executeRoleId);

  const roleIds = roles?._roles || roles;
  return Array.isArray(roleIds) ? roleIds.includes(executeRoleId) : false;
}

interface Instruction {
  command: string;
  parameters: string[];
}

export default {
  name: 'execute',
  run: async function (
    interaction,
    cdclient) {

    if (!hasExecuteAccess(interaction)) {
      await interaction.reply({ content: `You need the configured execute role (<@&${executeRoleId}>) to use this command.`, ephemeral: true });
      return;
    }

    let input = interaction.fields.getTextInputValue("input");

    /*
      USAGE:
      optional slash (/)
      command (drop)
      parameters (ids ONLY) separated by space, tab, newline, comma, or semicolon
    */

    let instructions: Instruction[] = [...input.matchAll(/^\/?(?<command>\w+)\s+(?<parameters>[^\/A-z]+)/gim)].map((m) => {
      return {
        command: m.groups.command,
        parameters: m.groups.parameters.match(/\d+/gim) // it should be just numbers anyway
      };
    });

    let embed = new Embed();
    embed.setTitle(`Executing ${instructions.length} Commands...`);
    embed.setDescription(`\`\`\`\n${instructions.map((i) => `/${i.command} ${i.parameters.join(", ")}`).join("\n")}\`\`\``);

    await interaction.reply({
      embeds: [embed]
    });

    for (let { command, parameters } of instructions) {
      for (let parameter of parameters) {
        let options = [{ name: "execute", type: 3, value: parameter } as any];
        try {
          const syntheticInteraction = Object.assign(
            Object.create(Object.getPrototypeOf(interaction)),
            interaction,
            { customId: `${command}/${parameter}/0` },
          );
          await slashCommands.get(command).run(syntheticInteraction, options, cdclient);
        } catch (err) {
          if (interaction.isMessageComponent() || interaction.isChatInputCommand()) {
            error(interaction, err);
          }
        }
      }
    }

  }
} as ModalCommand;
