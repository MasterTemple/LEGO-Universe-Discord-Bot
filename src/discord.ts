import { MessageEmbed } from "discord.js";
import { bracketURL } from "./functions";
import { LocaleXML } from "./locale";
import { LootDrop, SmashableDrop } from "./luInterfaces";
import { decimalToFraction, percent } from "./math";
import { Enemy } from "./types/Enemy";
import { Item } from "./types/Item";
import { Activity } from "./types/Activity";

export function fillEmbedWithLootDrops(embed: MessageEmbed, drops: LootDrop[], itemName: string) {
  let c = 1;

  drops.forEach(async (eachDrop) => {
    if (eachDrop.smashables.length > 0) {
      let range: string;
      if (eachDrop.minToDrop === eachDrop.maxToDrop) {
        range = eachDrop.minToDrop.toString();
      } else {
        range = `${eachDrop.minToDrop}-${eachDrop.maxToDrop}`;
      }
      eachDrop.smashables = eachDrop.smashables.filter((e) => !e.name.includes("Objects_"))
      embed.addField(
        // `${c++}. ${decimalToFraction(eachDrop.chance)} for ${range} ${itemName} `,
        `${c++}. ${percent(eachDrop.chance)} for ${range} ${itemName} `,
        `From ${eachDrop.smashables.map(({ name, id }) => `${name} ${bracketURL(id)}`).join(', ')} `.slice(0, 1023),
      );
    }
  });
}
// this works for enemeies, packages, and activities
export function fillEmbedWithSmashableDrops(embed: MessageEmbed, drops: SmashableDrop[], locale: LocaleXML) {
  // to force add last embed
  drops.push({ lootTableIndex: -1, chanceForItem: 0, chanceForRarity: 0, maxToDrop: 0, minToDrop: 0, poolSize: 1, rarity: 0, })

  let previousLTI = drops[0].lootTableIndex;
  let specificDrop = "Specific "
  let anyDrop = "Any "
  drops.forEach((drop, index) => {
    if (previousLTI !== drop.lootTableIndex) {
      let previousDrop = drops[index - 1]
      let itemCountStr = `For ${previousDrop.minToDrop}`
      if (previousDrop.minToDrop !== previousDrop.maxToDrop) itemCountStr += `-${previousDrop.maxToDrop} Item`
      if (previousDrop.maxToDrop > 1) itemCountStr += "s"
      if (specificDrop === "Specific ") {
        embed.addField(`${locale.getLootTableName(previousLTI)} - ${percent(previousDrop.chanceForItem)} ${itemCountStr}`, `Conumable Do Not Have Rarity ${bracketURL(previousLTI, "objects/loot/table")}`)
      } else {
        embed.addField(`${locale.getLootTableName(previousLTI)} - ${percent(previousDrop.chanceForItem)} ${itemCountStr}`, `${specificDrop}\n${anyDrop}${bracketURL(previousLTI, "objects/loot/table")}`)
      }
      previousLTI = drop.lootTableIndex
      specificDrop = "Specific "
      anyDrop = "Any "
    }

    let chanceForRarity = 1;
    if (drops[index - 1]?.rarity === drop.rarity - 1) drop.chanceForRarity - drops[index - 1].chanceForRarity
    else chanceForRarity = drop.chanceForRarity

    if (drop.poolSize > 0) {
      specificDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem)} `
      anyDrop += `**T${drop.rarity}** ${percent(chanceForRarity * drop.chanceForItem * (1 / drop.poolSize))} `
    }
  })
  drops.pop();
}