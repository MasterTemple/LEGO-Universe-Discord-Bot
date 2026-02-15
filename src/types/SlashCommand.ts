import { ApplicationCommandOptionData, ChatInputCommandInteraction, ModalSubmitInteraction, MessageComponentInteraction } from 'discord.js';
import { CDClient } from '../cdclient';

export interface SlashCommand {
  name: string;
  description: string;
  options: ApplicationCommandOptionData[];
  run(interaction: ChatInputCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    options: readonly any[] | [],
    cdclient: CDClient): Promise<void>;
}

export type SlashCommandMap = Map<string, SlashCommand>;
