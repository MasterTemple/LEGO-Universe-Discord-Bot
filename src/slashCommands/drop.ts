import { dropHomeRow, itemHomeRow } from '../components';
import { fillEmbedWithLootDrops } from '../discord';
import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'drop',
  description: 'View all smashables that drop an item!',
  options: [
    {
      name: 'item',
      description: 'An item in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "item");
    const itemId = parseInt(query) || (await cdclient.getObjectId(query));

    if (!itemId) {
      notFound(interaction);
      return;
    }

    const item = new Item(cdclient, itemId);
    await item.create();
    await item.addDrops();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);

    fillEmbedWithLootDrops(embed, item.drop, item.name);

    if (embed.fields.length === 0) {
      embed.addField("Not Dropped!", `${item.name} is not found by smashing anything!`);
    }

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item, "drop"), itemHomeRow(item)],
    });
  },
} as SlashCommand;
