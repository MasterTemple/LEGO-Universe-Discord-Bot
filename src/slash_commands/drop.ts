import { CommandInteraction, CommandInteractionOption, MessageEmbed } from "discord.js";
import { CDClient } from "../cdclient";
import { Item } from "../classes/item";
// interface ItemDrop {

// }

export default async function(interaction:CommandInteraction, options: readonly CommandInteractionOption[], cdclient: CDClient) {
  console.log("drop");
  let item = new Item(cdclient.db, parseInt(options[0].value.toString()))
  await item.create()
  // console.log({item});

  // let id = parseInt(options[0].value.toString());
  // let components = await cdclient.getComponents(id)
  // let rarity = await cdclient.getItemRarity(components.find((f)=> f.component_type===11 ).component_id)
  // let ltis = await cdclient.getItemLootTables(id)
  // let lmis = await cdclient.getLootMatricesFromLootTables(ltis)

  /*
  let destructibleComponents:number[] = []
  let destructibleComponentsNested = await Promise.all(lmis.map(({LootMatrixIndex}) => cdclient.getDestructibleComponentsFromLootMatrix(LootMatrixIndex)))
  destructibleComponentsNested.forEach((dcs) => {
    dcs.forEach((dc) => {
      destructibleComponents.push(dc)
    })
  })
  let smashableIds = await Promise.all(destructibleComponents.map((dc) => cdclient.getIdFromDestructibleComponent(dc)))
  smashableIds = smashableIds.filter((id) => id!==undefined)
  console.log("🚀 ~ file: drop.ts ~ line 24 ~ function ~ smashableIds", smashableIds)
  let names = await Promise.all(smashableIds.map((id) => cdclient.getObjectName(id)))
  console.log("🚀 ~ file: drop.ts ~ line 26 ~ function ~ names", names)
  */
  // let destructibleComponents:number[] = []
  // let destructibleComponentsGrouped = await Promise.all(lmis.map((lmi) => cdclient.getDestructibleComponentsFromLootMatrix(lmi.LootMatrixIndex)))


  // let destructibleComponentsGrouped = await Promise.all(lmis.map((lmi) => cdclient.addDestructibleComponentToLootMatrix(lmi)))
  // console.log("📝 ~ file: drop.ts ~ line 35 ~ function ~ destructibleComponentsGrouped", destructibleComponentsGrouped)
  // lmis.forEach((lmi) => {
  //   lmi.destructibleComponent
  // })
  // async function getLMIGroups(lmi){
  //   return new Promise(async(resolve, reject) => {
  //     let dc = await cdclient.getDestructibleComponentsFromLootMatrix(lmi.LootMatrixIndex)
  //     resolve({
  //       ...lmi,
  //       DestructibleComponent: dc
  //     })
  //   })
  // }
  //   let destructibleComponentsGrouped = await Promise.all(lmis.map((lmi) => getLMIGroups(lmi.LootMatrixIndex)))
  //   console.log("📝 ~ file: drop.ts ~ line 47 ~ function ~ destructibleComponentsGrouped", destructibleComponentsGrouped)

  // let destructibleComponentsGrouped = await Promise.all(lmis.map((lmi) => {
  //   return {
  //     ...lmi,
  //     destructibleComponents: cdclient.getDestructibleComponentsFromLootMatrix(lmi.LootMatrixIndex)
  //   }
  // }))

  // destructibleComponentsNested.forEach((dcs) => {
  //   dcs.forEach((dc) => {
  //     destructibleComponents.push(dc)
  //   })
  // })

  // let smashableIds = await Promise.all(destructibleComponents.map((dc) => cdclient.getIdFromDestructibleComponent(dc)))
  // smashableIds = smashableIds.filter((id) => id!==undefined)
  // console.log("🚀 ~ file: drop.ts ~ line 24 ~ function ~ smashableIds", smashableIds)

  // let names = await Promise.all(smashableIds.map((id) => cdclient.getObjectName(id)))
  // console.log("🚀 ~ file: drop.ts ~ line 26 ~ function ~ names", names)

  // let embed:MessageEmbed = new MessageEmbed()
  // embed.setDescription("```json\n"+JSON.stringify(item,null,2)+"\n```")
  // console.log(item);

  interaction.reply({
    content: `${item.name} [[${item.id}]](https://explorer.lu-dev.net/objects/${item.id})`,
    // content: "```json\n"+JSON.stringify(item,null,2)+"\n```",
    // embeds: [embed],
    ephemeral: true
  })
}