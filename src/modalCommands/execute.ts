import { BaseCommandInteraction, CommandInteractionOption, Interaction } from 'discord.js';
import { slashCommands } from '..';
import { reportChannelId } from '../config';
import { Embed } from '../types/Embed';
import { ModalCommand } from '../types/ModalCommand';

interface Instruction {
  command: string;
  parameter: string;
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
    /item 7570, 7415 => same command executed on multiple values
    /reward 7793 => separate command
    */

    let instructions: Instruction[] = [...input.matchAll(/^\/?(?<command>\w+) (?<parameter>.*)/gim)].map((m) => {
      return {
        command: m.groups.command,
        parameter: m.groups.parameter
      };
    });

    let embed = new Embed();
    embed.setTitle(`Executing ${instructions.length} Commands...`);
    embed.setDescription(`\`\`\`\n${instructions.map((i) => `/${i.command} ${i.parameter}`).join("\n")}\`\`\``);

    interaction.reply({
      embeds: [embed]
    });

    await Promise.all(instructions.map(({ command, parameter }) => {
      let options = [{ name: "execute", type: "STRING", value: parameter } as CommandInteractionOption];
      slashCommands.get(command).run(interaction, options, cdclient);
    }));

  }
} as ModalCommand;
