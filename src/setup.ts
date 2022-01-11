import {Client} from 'discord.js';
import {readdirSync} from 'fs';
import {SlashCommandMap} from './types/SlashCommand';

export async function updateSlashCommands(client: Client, commands: SlashCommandMap) {
  client.application.commands.set(Array.from(commands.values()));
}

export function getSlashCommands(): SlashCommandMap {
  const slashCommands: SlashCommandMap = new Map();
  for (const fileName of readdirSync(__dirname + '/slashCommands')) {
    if (!fileName.endsWith('.js')) continue;
    const command = require(`${__dirname}/slashCommands/${fileName}`).default;
    slashCommands.set(command.name, command);
  }
  return slashCommands;
}
