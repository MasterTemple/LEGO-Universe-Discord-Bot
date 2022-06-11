import { MessageEmbed } from "discord.js";
import { bracketURL } from "./functions";
import { LootDrop } from "./luInterfaces";
import { decimalToFraction, percent } from "./math";

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