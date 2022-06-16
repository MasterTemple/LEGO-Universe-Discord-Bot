import { ApplicationCommandOptionData, BaseCommandInteraction, CommandInteractionOption, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';
import { CDClient } from '../cdclient';

export interface SlashCommand {
  name: string;
  description: string;
  options: ApplicationCommandOptionData[];
  run(interaction: BaseCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
    options: readonly CommandInteractionOption[] | [],
    cdclient: CDClient): Promise<void>;
}

export type SlashCommandMap = Map<string, SlashCommand>;
