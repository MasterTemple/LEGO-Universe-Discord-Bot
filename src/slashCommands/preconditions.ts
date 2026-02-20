import { dropHomeRow, itemHomeRow } from '../components';
import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'preconditions',
  description: 'View the preconditions to use an item!',
  options: [
    {
      name: 'item',
      description: 'An item in LEGO Universe.',
      type: 3,
      required: true,
      autocomplete: true,
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

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);
    // console.log(item.imageURL)
    embed.addField("Preconditions",
      item.itemComponent.preconditions.length ? item.itemComponent.preconditions.map((p, i) => `**${i + 1}.** ${p.description}`).join("\n") : "This item has no preconditions to use it!"
    );

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item), itemHomeRow(item, "preconditions")],
    });

  },
} as SlashCommand;
