import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL, getOption, replyOrUpdate, textToChunks } from '../functions';
import { Button } from '../types/Button';
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
    interaction,
    options,
    cdclient) {
    const query = getOption(options, "loottable")
    const lootTableId = parseInt(query) || await cdclient.getObjectId(query);
    const lootTable = new LootTable(cdclient, lootTableId);
    await lootTable.create();

    const embed = new Embed();
    embed.setURL(lootTable.getURL());
    embed.setThumbnail(lootTable.imageURL)
    embed.setTitle(`${lootTable.name} [${lootTable.id}]`);

    let selectedTier = 1;
    if (interaction.isMessageComponent()) selectedTier = parseInt(interaction.customId.match(/(?<=[^\/]+\/[^\/]+\/[^\?]+\?t=)\d/gi)?.[0])
    let tableSize = lootTable.loot.length;
    if (tableSize === 0) selectedTier = 0

    let loot = lootTable.loot.filter((f) => f.rarity === selectedTier)
    let size = loot.length
    let left = ""
    let right = ""

    loot.forEach((item, index) => {
      if (index % 2 === 0) left += `**${index + 1}.** ${item.name} ${bracketURL(item.id, "objects/loot/table")}\n`
      else right += `**${index + 1}.** ${item.name} ${bracketURL(item.id, "objects/loot/table")}\n`
    })

    if (left.length > 0) embed.addField(`Tier ${selectedTier}`, left, true)
    else if (tableSize > 0) embed.addField(`Tier ${selectedTier}`, `${lootTable.name} has no **Tier ${selectedTier}** items!`)
    else if (tableSize === 0) embed.addField(`Consumable`, `Consumables have no rarity!`)
    if (right.length > 0) embed.addField(`${size} Items`, right, true)



    let buttons = new MessageActionRow().addComponents(
      new Button().setDisabled(!lootTable.loot.find(({ rarity }) => rarity === 1)).setLabel("Tier 1").setCustomId(`loottable/${lootTable.id}/0?t=1`).setStyle(selectedTier === 1 ? "SUCCESS" : "PRIMARY"),
      new Button().setDisabled(!lootTable.loot.find(({ rarity }) => rarity === 2)).setLabel("Tier 2").setCustomId(`loottable/${lootTable.id}/0?t=2`).setStyle(selectedTier === 2 ? "SUCCESS" : "PRIMARY"),
      new Button().setDisabled(!lootTable.loot.find(({ rarity }) => rarity === 3)).setLabel("Tier 3").setCustomId(`loottable/${lootTable.id}/0?t=3`).setStyle(selectedTier === 3 ? "SUCCESS" : "PRIMARY"),
      new Button().setDisabled(!lootTable.loot.find(({ rarity }) => rarity === 4)).setLabel("Tier 4").setCustomId(`loottable/${lootTable.id}/0?t=4`).setStyle(selectedTier === 4 ? "SUCCESS" : "PRIMARY"),
    )

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [buttons],
      pageSize: 2
    })

  },
} as SlashCommand;
