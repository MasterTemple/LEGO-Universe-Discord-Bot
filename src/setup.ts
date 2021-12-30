import { ApplicationCommand, Client } from "discord.js";
import {readdirSync} from "fs"

export async function updateSlashCommands(client: Client) {
  // return new Promise (async(resolve, reject) => {
    let newCommands: ApplicationCommand[] = [];

    let currentCommands = await client.application.commands.fetch();
    currentCommands.forEach((command:ApplicationCommand) => {
      let correspondingCommand = newCommands.find
      // console.log(command.)
    })

  //   resolve()
  // })

}

export function getSlashCommands(): Map<string, Function> {
  let slashCommands = new Map<string, Function>();
  for(const fileName of readdirSync("./src/slash_commands")){
    const name = fileName.match(/\w+/)[0]
    slashCommands.set(name, require(`./slash_commands/${name}`).default)
  }
  return slashCommands
}