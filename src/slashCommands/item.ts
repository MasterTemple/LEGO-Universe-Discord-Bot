import { Client } from 'discord.js';
import { dropHomeRow, itemHomeRow } from '../components';
import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

const ARMOR_EMOJI = "1060367206422163566";
const LIFE_EMOJI = "1060367241205514291";
const IMAGINATION_EMOJI = "1060367253134131342";

function emojiStats(client: Client, count: number, name: string, id: string) {
  let str = "";
  // let emoji = client.emojis.cache.get("305818615712579584");
  for (let i = 0; i < count; i++) {
    str += `<a:${name}:${id}> `;
    // str += ` ${emoji}`;
    // str += `:${id}:`;
    // str += ":heart:";
  }
  if (str.length === 0) return "None";
  return str;
}

export default {
  name: 'item',
  description: 'View the stats of an item!',
  options: [
    {
      name: 'item',
      description: 'An item in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true
    }],
  run: async function (
    interaction,
    options,
    cdclient) {
    const query = getOption(options, "item");
    const itemId = await cdclient.getItemId(query);

    if (!itemId) {
      notFound(interaction);
      return;
    }

    const item = new Item(cdclient, itemId);
    await item.create();

    let embed = new Embed().setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);

    if (item.itemComponent) {
      embed.addField("Rarity", `Tier ${item.itemComponent.rarity}`, true);
      embed.addField("Equip Location(s)", item.itemComponent.equipLocations.join(", ") || "None", true);
      embed.addField("Proxies", item.itemComponent.proxyItems.map(({ name, id }) => `${name} [[${id}]](${item.getURL(id)})`).join(", ") || "None", true);

      if (item.stats) {
        // embed.addField("Armor", ":ARMOR_EMOJI:", true);
        embed.addField("Health", item.stats.health.toString(), true);
        embed.addField("Imagination", item.stats.imagination.toString(), true);
        // embed.addField("Armor", emojiStats(interaction.client, item.stats.armor, "ARMOR_EMOJI", ARMOR_EMOJI), true);
        // embed.addField("Health", emojiStats(interaction.client, item.stats.health, "LIFE_EMOJI", LIFE_EMOJI), true);
        // embed.addField("Imagination", emojiStats(interaction.client, item.stats.imagination, "IMAGINATION_EMOJI", IMAGINATION_EMOJI), true);
      }

      embed.addField("Cost", item.itemComponent.buyPrice.toString(), true);
      embed.addField("Stack Size", item.itemComponent.stackSize.toString(), true);
      embed.addField("Level Requirement", item.itemComponent.levelRequirement.toString(), true);
    }
    else {
      embed.addField("Not an Item!", `${item.name} is not an item!`);
    }
    embed.setDescription(emojiStats(interaction.client, item.stats.armor, "ARMOR_EMOJI", ARMOR_EMOJI));
    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item), itemHomeRow(item, "item")],
      isPaged: false
    });

  },
} as SlashCommand;
