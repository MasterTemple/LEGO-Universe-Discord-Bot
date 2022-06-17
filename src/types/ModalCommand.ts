import { ModalSubmitInteraction } from 'discord.js';
import { CDClient } from '../cdclient';

export interface ModalCommand {
  name: string;
  run(interaction: ModalSubmitInteraction,
    cdclient: CDClient): Promise<void>;
}

export type ModalCommandMap = Map<string, ModalCommand>;
