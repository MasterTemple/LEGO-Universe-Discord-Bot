import {ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption} from 'discord.js';
import {CDClient} from '../cdclient';

export interface SlashCommand {
  name: string;
  description: string;
  options: ApplicationCommandOptionData[];
  run(interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient): Promise<void>;
}

export type SlashCommandMap = Map<string, SlashCommand>;
