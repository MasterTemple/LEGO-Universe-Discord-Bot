import { dropHomeRow, itemHomeRow } from '../components';
import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

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
        embed.addField("Armor", item.stats.armor.toString(), true);
        embed.addField("Health", item.stats.health.toString(), true);
        embed.addField("Imagination", item.stats.imagination.toString(), true);
      }

      embed.addField("Cost", item.itemComponent.buyPrice.toString(), true);
      embed.addField("Stack Size", item.itemComponent.stackSize.toString(), true);
      embed.addField("Level Requirement", item.itemComponent.levelRequirement.toString(), true);
    }
    else {
      embed.addField("Not an Item!", `${item.name} is not an item!`);
    }

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item), itemHomeRow(item, "item")],
      isPaged: false
    });

  },
} as SlashCommand;
