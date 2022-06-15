import { MessageActionRow } from "discord.js";
import { PACKAGE_COMPONENT } from "./cdclient";
import { ComponentsRegistry } from "./cdclientInterfaces";
import { Button } from "./types/Button";
import { Enemy } from "./types/Enemy";
import { Item } from "./types/Item";
import { NPC } from "./types/NPC";
import { Skill } from "./types/Skill";

export function itemHomeRow(item: Item, green?: string): MessageActionRow {
  let row = new MessageActionRow().addComponents(
    new Button(green === "item").setLabel("Item").setCustomId(`item/${item.id}`),
    new Button(green === "get").setLabel("Get").setCustomId(`get/${item.id}`),
    new Button(green === "preconditions").setLabel("Preconditions").setCustomId(`preconditions/${item.id}`),
  );

  if (item.components.some((comp) => comp.component_type === PACKAGE_COMPONENT)) row.addComponents(
    new Button(green === "package").setLabel("Open").setCustomId(`package/${item.id}`),
  );

  if (item.skills.some((skill) => skill.descriptions.length > 0)) row.addComponents(
    new Button(green === "skills").setLabel("Skills").setCustomId(`skills/${item.id}`),
  );

  return row;
}

export function dropHomeRow(item: Item, green?: string): MessageActionRow {
  return new MessageActionRow().addComponents(
    new Button(green === "earn").setDisabled(!item.get.isFromMission).setLabel("Earn").setCustomId(`earn/${item.id}`),
    new Button(green === "drop").setDisabled(!item.get.isFromSmashable).setLabel("Drop").setCustomId(`drop/${item.id}`),
    new Button(green === "unpack").setDisabled(!item.get.isFromPackage).setLabel("Unpack").setCustomId(`unpack/${item.id}`),
    new Button(green === "reward").setDisabled(!item.get.isFromActivity).setLabel("Reward").setCustomId(`reward/${item.id}`),
    new Button(green === "buy").setDisabled(!item.get.isFromVendor).setLabel("Buy").setCustomId(`buy/${item.id}`),
  );
}

export function skillHomeRow(skill: Skill, green?: string): MessageActionRow {
  return new MessageActionRow().addComponents(
    new Button(green === "skill").setLabel(skill.name).setCustomId(`skill/${skill.id}`),
    new Button(green === "skillitems").setLabel(`Items with ${skill.name}`).setCustomId(`skillitems/${skill.id}`),
  );
}

export function NPCHomeRow(npc: NPC, green?: string): MessageActionRow {
  return new MessageActionRow().addComponents(
    new Button(green === "npc").setLabel("Missions Given").setCustomId(`npc/${npc.id}`),
    new Button(green === "vendor").setLabel("Sold Items").setCustomId(`vendor/${npc.id}`),
  );
}

export function enemyHomeRow(enemy: Enemy, green?: string): MessageActionRow {
  return new MessageActionRow().addComponents(
    new Button(green === "enemy").setLabel("Enemy Stats").setCustomId(`enemy/${enemy.id}`),
    new Button(green === "smash").setLabel("Smash Enemy").setCustomId(`smash/${enemy.id}`),
  );
}
