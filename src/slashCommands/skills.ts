import { dropHomeRow, itemHomeRow } from '../components';
import { customEmojis } from '../config';
import { notFound } from '../error';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';
import { emojiStats } from './item';

export default {
	name: 'skills',
	description: 'View all skills attached to an item!',
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
			if (skill.onEquip || skill.name.match(/ - Passive/) || skill.cooldownGroup === -1) {
				// same items
				if (item.id === skill.itemId && skill.descriptions.length === 1) {
					embed.addField(skill.name, skill.descriptions[0].description, false);
				}
				// proxy
				else {
					embed.addField(skill.name, `From ${await item.getObjectName(skill.itemId)} ${bracketURL(skill.itemId)}`, false);
					skill.descriptions.forEach((desc) => {
						embed.addField(desc.name.replace(/[A-Z]/g, (m) => " " + m), desc.description || "No Description", true);
					});
				}
			}
			// stat boost
			else {
				const statType = skill.imaginationBonus ? "imagination" : skill.armorBonus ? "armor" : skill.healthBonus ? "life" : undefined;
				if (statType)
					embed.addField(skill.name, emojiStats(item.stats[statType], statType, customEmojis.find(({ name }) => name === statType)["id"]), false);
			}
		}


		if (embed.fields.length === 0) {
			embed.addField("No Skills!", `${item.name} is has no usable skills!`);
		}

		await replyOrUpdate({
			interaction: interaction,
			embeds: [embed],
			components: [dropHomeRow(item), itemHomeRow(item, "skills")],
		});
	},
} as SlashCommand;
