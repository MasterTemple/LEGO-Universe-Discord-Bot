import { AutocompleteInteraction, Client, CommandInteraction, CommandInteractionOption, CommandInteractionOptionResolver, Interaction } from "discord.js"
import { Database } from "sqlite3";
import { CDClient } from "./cdclient";
import { token, sqlite_path } from "./config.json";
import { getSlashCommands, updateSlashCommands } from "./setup";
const client = new Client({
  intents: []
})

var slashCommands:Map<string, Function> = getSlashCommands();
const db = new Database(sqlite_path);
const cdclient = new CDClient(db);

client.once("ready", async () => {
  // updateSlashCommands(client);
  // cdclient.load();
  await cdclient.test();
  console.log("LEGO Universe Discord Bot is online.");
  // process.exit(0)
})

client.on("interactionCreate", async (interaction: CommandInteraction) => {
  const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
  console.log(options);

  // console.log(interaction.options.data);

  if(interaction.type === "APPLICATION_COMMAND"){
    slashCommands.get(interaction.commandName)(interaction, options, cdclient)
  }
  else if(interaction.type === "APPLICATION_COMMAND_AUTOCOMPLETE"){

  }
})

client.login(token)
