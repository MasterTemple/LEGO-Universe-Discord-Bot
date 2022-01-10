import {Client} from 'discord.js';
import {readdirSync} from 'fs';
import {SlashCommand} from './types/SlashCommand';

export async function updateSlashCommands(client: Client) {
  const commands = getSlashCommands();
  client.application.commands.set(Array.from(commands.values()));
}

export function getSlashCommands(): Map<string, SlashCommand> {
  const slashCommands = new Map<string, SlashCommand>();
  for (const fileName of readdirSync(__dirname + '/slash_commands')) {
    if (!fileName.endsWith('.js')) continue;
    console.debug(__dirname + `/slash_commands/${fileName}`);
    const cmd = require(__dirname + `/slash_commands/${fileName}`).default;
    slashCommands.set(cmd.name, cmd);
  }
  return slashCommands;
}
