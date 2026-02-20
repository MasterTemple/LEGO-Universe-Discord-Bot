import { MessageComponentInteraction } from 'discord.js';
import { CDClient } from '../cdclient';

export interface ComponentCommand {
  name: string;
  run(interaction: MessageComponentInteraction,
    cdclient: CDClient): Promise<void>;
}

export type ComponentCommandMap = Map<string, ComponentCommand>;
