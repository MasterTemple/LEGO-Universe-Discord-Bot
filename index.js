const Discord = require('discord.js')
const fs = require('fs')
const {token} = require('./config.json')
const locale = require('./classes/locale')

let CDClient = require('./classes/cdclient')

var cdclient = new CDClient()


const { search } = require('./functions/search.js')

const client = new Discord.Client({
    presence: {
        status: 'online',
    },
    // intents: ['GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILDS', 'GUILD_MEMBERS']
    intents: []
})

var slashCommands = new Map()
for(const fileName of fs.readdirSync("./slash_commands")){
  slashCommands.set(fileName.match(/\w+/)[0], require(`./slash_commands/${fileName}`))
}


client.once('ready', async () => {
  await cdclient.load()
  console.log("LEGO Universe Bot is up and running!");

})


client.on('interactionCreate', async (interaction) => {
  const options = interaction.options._hoistedOptions
  if(interaction.type === "APPLICATION_COMMAND"){

    let command = slashCommands.get(interaction.commandName)
    command(interaction, options)

  }

  if(interaction.type === "APPLICATION_COMMAND_AUTOCOMPLETE"){

    let {name, value} = options.find(f => f.focused)
    // console.log({name, value});
    if(!value){ return}

    let results = await search(name, value)
    // console.log({results});
    interaction.respond(results)

  }

})

client.login(token)

