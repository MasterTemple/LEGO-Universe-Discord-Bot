import { AutocompleteInteraction, Client, CommandInteraction, CommandInteractionOption, CommandInteractionOptionResolver, Interaction } from "discord.js"
import { CDClient } from "./cdclient";
import { token, sqlite_path } from "./config.json";
import { getSlashCommands, updateSlashCommands } from "./setup";
import { Database } from "sqlite3";
import { LocaleXML } from "./locale";

// const db = new Database(sqlite_path, (err) => {

//   if (err) {
//     console.error('Please provide a path to the cdclient.sqlite in config.json.')
//   }else{
//     console.log(`Connected to '${sqlite_path}' as 'cdclient.sqlite'.`)
//   }
// })
const cdclient = new CDClient();
const client = new Client({
  intents: []
})

var slashCommands:Map<string, Function> = getSlashCommands();

client.once("ready", async () => {
  console.log("\n------------------------------------\n");

  let locale = new LocaleXML()
  await locale.updateIfChanged()
  await cdclient.load()
  // updateSlashCommands(client)
  console.log("\n------------------------------------\n");
  console.log("LEGO Universe Discord Bot is online.");
  // process.exit(0)
})

client.on("interactionCreate", async (interaction: CommandInteraction) => {
  const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
  // console.log(options);

  if(interaction.type === "APPLICATION_COMMAND"){
    slashCommands.get(interaction.commandName)(interaction, options, cdclient)
  }
  else if(interaction.type === "APPLICATION_COMMAND_AUTOCOMPLETE"){

  }
})

client.login(token)
