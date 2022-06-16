import { ApplicationCommandOptionData, ModalSubmitInteraction } from 'discord.js';
import { CDClient } from '../cdclient';

export interface ModalCommand {
  name: string;
  description: string;
  options: ApplicationCommandOptionData[];
  run(interaction: ModalSubmitInteraction,
    cdclient: CDClient): Promise<void>;
}

export type ModalCommandMap = Map<string, ModalCommand>;
