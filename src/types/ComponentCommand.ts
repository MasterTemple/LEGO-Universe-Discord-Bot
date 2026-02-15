import { BaseInteraction, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';
import { CDClient } from '../cdclient';

export interface ComponentCommand {
  name: string;
  run(interaction: BaseInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    cdclient: CDClient): Promise<void>;
}

export type ComponentCommandMap = Map<string, ComponentCommand>;
