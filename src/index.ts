import {AutocompleteInteraction, Client, CommandInteraction, CommandInteractionOption, Interaction} from 'discord.js';
import {CDClient} from './cdclient';
import {token} from './config.json';
import { LocaleXML } from './locale';
import { LootDrop, NameValuePair } from './luInterfaces';
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


  // let values = await cdclient.dropItem(37337, 4);
  // // console.log(values)
  // let newValues = new Map<number, LootDrop>();
  // let lootTableRaritySizes = new Map<number, number>()
  // for(let value of values){
  //   let lmi = newValues?.get(value.lootMatrixIndex)
  //   if(lmi) {
  //     lmi.smashables.push({
  //       id: value.enemyId,
  //       name: await cdclient.getObjectName(value.enemyId)
  //     })
  //   } else {
  //     let ltiSize = lootTableRaritySizes?.get(value.lootTableIndex);
  //     if(!ltiSize) {
  //       ltiSize = await cdclient.getItemsInLootTableOfRarity(value.lootTableIndex, value.rarity)
  //       lootTableRaritySizes.set(value.lootTableIndex, ltiSize)
  //     }
  //     newValues.set(value.lootMatrixIndex, {
  //       smashables: [],
  //       chanceForDrop: value.percent,
  //       minToDrop: value.minToDrop,
  //       maxToDrop: value.maxToDrop,
  //       chanceForRarity: value.randmax,
  //       chanceForItemInLootTable: ltiSize,
  //       chance: value.percent * value.randmax * (1/ltiSize),
  //     })
  //   }
  // }
  // console.log(newValues)
  // await cdclient.dropItem(7570, 4)
  // console.log(await cdclient.getComponents(7570))


  console.log('\n------------------------------------\n');
  console.log('LEGO Universe Discord Bot is online.');
  // process.exit(0)
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if(interaction.isApplicationCommand()){
    const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
    slashCommands.get(interaction.commandName).run(interaction, options, cdclient);
  }

  if (interaction.isAutocomplete()) {

      const options: readonly CommandInteractionOption[] = interaction.options?.data || [];
      // this is currently a general search for ALL objects in the 'Objects' table
      let {name, value} = options.find((f) => f.focused)
      value = value.toString()

      let autocompleteOptions:NameValuePair[]
      if(parseInt(value)){
        autocompleteOptions = [{
          name: `${(await cdclient.getObjectName(parseInt(value)))} [${value}]`,
          value: value
        }]
      }else{
        autocompleteOptions = await cdclient.searchObject(value)
      }
      interaction.respond(autocompleteOptions)
  }


});

client.login(token);
