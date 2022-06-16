import { dropHomeRow, itemHomeRow } from '../components';
import { notFound } from '../error';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'skills',
  description: 'View all skills attached to an item!',
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
    await item.addSkillDescriptions();

    const embed = new Embed();
    embed.setTitle(`${item.name} [${item.id}]`);
    embed.setURL(item.getURL());
    embed.setThumbnail(item.imageURL);

    for (let skill of item.skills) {
      // console.log(skill);
      if (skill.onEquip) {
        embed.addField(skill.name, `From ${await item.getObjectName(skill.itemId)} ${bracketURL(skill.itemId)}`, false);
        skill.descriptions.forEach((desc) => {
          embed.addField(desc.name, desc.description || "No Description", true);
        });
      }
    }


    if (embed.fields.length === 0) {
      embed.addField("No Skills!", `${item.name} is has no usable skills!`);
    }

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      components: [dropHomeRow(item), itemHomeRow(item, "skills")],
    });
  },
} as SlashCommand;
