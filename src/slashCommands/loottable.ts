import { MessageActionRow } from 'discord.js';
import { notFound } from '../error';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
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
    const query = getOption(options, "loottable");
    const lootTableId = parseInt(query) || await cdclient.getObjectId(query);

    if (!lootTableId) {
      notFound(interaction);
      return;
    }

    const lootTable = new LootTable(cdclient, lootTableId);
    await lootTable.create();

    const embed = new Embed();
    embed.setURL(lootTable.getURL());
    embed.setThumbnail(lootTable.imageURL);
    embed.setTitle(`${lootTable.name} [${lootTable.id}]`);

    let selectedTier = 1;
    if (interaction.isMessageComponent()) selectedTier = parseInt(interaction.customId.match(/(?<=(\?|&)t=)\d/gi)?.[0]);
    // if (interaction.isMessageComponent()) console.log("📝 ~ file: loottable.ts ~ line 42 ~ customId", interaction.customId);
    // console.log("📝 ~ file: loottable.ts ~ line 42 ~ selectedTier", selectedTier);

    let tableSize = lootTable.loot.length;
    if (tableSize === 0) selectedTier = 0;

    let loot = lootTable.loot.filter((f) => f.rarity === selectedTier);
    let size = loot.length;
    let left = "";
    let right = "";
    let thisItem = "";

    loot.forEach((item, index) => {
      thisItem = `**${index + 1}.** ${item.name} ${bracketURL(item.id, "objects")}\n`;

      if (index % 2 === 0) {
        if (left.length + thisItem.length < 1024) left += thisItem;
        else {
          embed.addField(`Tier ${selectedTier}`, left, true);
          left = thisItem;
        }
      }
      else {
        if (right.length + thisItem.length < 1024) right += thisItem;
        else {
          embed.addField(`${size} Items`, right, true);
          right = thisItem;
        }
      }
      if (index === loot.length - 1) {
        embed.addField(`Tier ${selectedTier}`, left, true);
        embed.addField(`${size} Items`, right, true);
      }
    });


    if (tableSize === 0) embed.addField(`Consumable`, `Consumables have no rarity!`);

    let buttons = new MessageActionRow().addComponents();

    for (let i = 1; i <= 4; i++) {
      // i added an extra '&' because all customIds must be different and it will be ignored
      // otherwise when I am on page 1 (starting at 0) of Tier 1, the 'Previous Page' button and 'Tier 1' button will have the same customId
      buttons.addComponents(
        new Button(selectedTier === i).setDisabled(!lootTable.loot.find(({ rarity }) => rarity === 1)).setLabel(`Tier ${i}`).setCustomId(`loottable/${lootTable.id}/0?t=${i}&`)
      );
    }

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [buttons],
      pageSize: 2
    });

  },
} as SlashCommand;
