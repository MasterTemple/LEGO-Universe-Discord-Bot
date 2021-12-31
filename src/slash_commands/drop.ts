import { CommandInteraction, CommandInteractionOption } from "discord.js";
import { CDClient } from "../cdclient";

export default async function(interaction:CommandInteraction, options: readonly CommandInteractionOption[], cdclient: CDClient) {
  console.log("drop");
  let id = parseInt(options[0].value.toString());

  let ltis = await cdclient.getItemLootTables(id)
  let lmis = await cdclient.getLootMatricesFromLootTables(ltis)

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


  // for(let lmi of lmis){
  //   let dcs = await cdclient.getDestructibleComponentsFromLootMatrix(lmi.LootMatrixIndex)
  //   dcs.forEach((dc) => {
  //     destructibleComponents.add(dc)
  //   })
  // }
  // for(let dc of [...destructibleComponents]) {

  // }
  interaction.reply({
    content: "```json\n"+JSON.stringify(await cdclient.getComponents(id),null,2)+"\n```",
    ephemeral: true
  })
}