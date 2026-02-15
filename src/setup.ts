import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { feedbackEnabled } from './config';
import { ComponentCommandMap } from './types/ComponentCommand';
import { ModalCommandMap } from './types/ModalCommand';
import { SlashCommandMap } from './types/SlashCommand';

export async function updateSlashCommands(client: Client, commands: SlashCommandMap) {
  client.application.commands.set(Array.from(commands.values()));
}

export function getSlashCommands(): SlashCommandMap {
  const slashCommands: SlashCommandMap = new Map();
  for (const fileName of readdirSync(__dirname + '/slashCommands')) {
    if (!fileName.endsWith('.js')) continue;
    if (!feedbackEnabled && fileName === 'report.js') continue;
    const command = require(`${__dirname}/slashCommands/${fileName}`).default;
    slashCommands.set(command.name, command);
  }
  return slashCommands;
}

export function getModalCommands(): ModalCommandMap {
  const modalCommands: ModalCommandMap = new Map();
  for (const fileName of readdirSync(__dirname + '/modalCommands')) {
    if (!fileName.endsWith('.js')) continue;
    if (!feedbackEnabled && fileName === 'report.js') continue;
    const command = require(`${__dirname}/modalCommands/${fileName}`).default;
    modalCommands.set(command.name, command);
  }
  return modalCommands;
}

export function getComponentCommands(): ComponentCommandMap {
  const componentCommands: ComponentCommandMap = new Map();
  for (const fileName of readdirSync(__dirname + '/componentCommands')) {
    if (!fileName.endsWith('.js')) continue;
    const command = require(`${__dirname}/componentCommands/${fileName}`).default;
    componentCommands.set(command.name, command);
  }
  return componentCommands;
}