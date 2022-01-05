import { CommandInteraction, CommandInteractionOption, MessageEmbed } from "discord.js";
import { CDClient } from "../cdclient";
import { Item } from "../classes/item";
// interface ItemDrop {

// }

export default async function(interaction:CommandInteraction, options: readonly CommandInteractionOption[], cdclient: CDClient) {
  console.log("/drop");
  let item = new Item(cdclient.db, parseInt(options[0].value.toString()))
  await item.create()
  console.log({item});
  let embed = new MessageEmbed()
  embed.setTitle(`${item.name} [${item.id}]`)
  embed.setURL(item.getURL())
  let c = 1
  item.drop.forEach((each_drop) => {
    if(each_drop.enemies.length > 0){
      // embed.addField(`${c}. ${each_drop.destructibleNames.join(", ")}`, `1/${Math.round(1/each_drop.totalChance)}`)
      let range:string;
      if(each_drop.minToDrop === each_drop.maxToDrop){
        range = each_drop.minToDrop.toString()
      }else{
        range = `${each_drop.minToDrop}-${each_drop.maxToDrop}`
      }
      embed.addField(`${c++}. 1/${Math.round(1/each_drop.totalChance)} for ${range} ${item.name}`, `From ${each_drop.enemies.map(({name, id}) => `${name} [${id}]`).join(", ")}`)

    }
  })

  interaction.reply({
    // content: `${item.name} [[${item.id}]](https://explorer.lu-dev.net/objects/${item.id})`,
    // content: "```json\n"+JSON.stringify(item,null,2)+"\n```",
    embeds: [embed],
    ephemeral: true
  })
}