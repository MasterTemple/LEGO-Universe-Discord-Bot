import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL, getOption, textToChunks } from '../functions';
import { Embed } from '../types/Embed';
import { LootTable } from '../types/LootTable';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'loottable',
  description: 'View all items in a loot table!',
  options: [
    {
      name: 'loottable',
      description: 'An Loot Table in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {
    const query = getOption(options, "loottable")
    const lootTableId = parseInt(query) || await cdclient.getObjectId(query);
    const lootTable = new LootTable(cdclient, lootTableId);
    await lootTable.create();

    const embed = new Embed();
    embed.setURL(lootTable.getURL());
    embed.setThumbnail(lootTable.imageURL)
    embed.setTitle(`${lootTable.name} [${lootTable.id}]`);
    let previousTier = lootTable.loot?.[0]?.rarity || 0;
    let items = ""
    lootTable.loot.push({ id: 0, name: "", rarity: 0 })
    let c = 1;
    lootTable.loot.forEach((loot) => {
      if (previousTier !== loot.rarity) {
        let chunks = textToChunks(items)
        chunks.forEach((chunk) => {
          embed.addField(`Tier ${previousTier}`, chunk)
        })
        previousTier = loot.rarity;
        items = "";
        c = 1;
      }
      items += `**${c++}.** ${loot.name} ${bracketURL(loot.id, "objects/loot/table")}\n`
    })

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
