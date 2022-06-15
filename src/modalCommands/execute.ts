import { BaseCommandInteraction, CommandInteractionOption, Interaction, PartialWebhookMixin } from 'discord.js';
import { slashCommands } from '..';
import { reportChannelId } from '../config';
import { Embed } from '../types/Embed';
import { ModalCommand } from '../types/ModalCommand';

interface Instruction {
  command: string;
  parameters: string[];
}

export default {
  name: 'execute',
  description: 'Open a dialog to execute multiple commands on this bot!',
  options: [],
  run: async function (
    interaction,
    cdclient) {

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

    interaction.reply({
      embeds: [embed]
    });

    for (let { command, parameters } of instructions) {
      for (let parameter of parameters) {
        let options = [{ name: "execute", type: "STRING", value: parameter } as CommandInteractionOption];
        await slashCommands.get(command).run(interaction, options, cdclient);
      }
    }

  }
} as ModalCommand;
