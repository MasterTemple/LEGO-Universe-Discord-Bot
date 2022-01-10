import {Client, CommandInteraction, CommandInteractionOption} from 'discord.js';
import {CDClient} from './cdclient';
import {token} from './config.json';
import {getSlashCommands, updateSlashCommands} from './setup';
import {SlashCommandMap} from './types/SlashCommand';

const cdclient = new CDClient();

const client = new Client({
  intents: [],
});

const slashCommands: SlashCommandMap = getSlashCommands();

client.once('ready', async () => {
  console.log('\n------------------------------------\n');
  await cdclient.load();
  updateSlashCommands(client, slashCommands);
  console.log('\n------------------------------------\n');
  console.log('LEGO Universe Discord Bot is online.');
  // process.exit(0)
});

client.on('interactionCreate', async (interaction: CommandInteraction) => {
  const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
  // console.log(options);

  if (interaction.type === 'APPLICATION_COMMAND') {
    slashCommands.get(interaction.commandName).run(interaction, options, cdclient);
  } else if (interaction.type === 'APPLICATION_COMMAND_AUTOCOMPLETE') {
    console.log('Bot not ready to autocomplete reply');
  }
});

client.login(token);
