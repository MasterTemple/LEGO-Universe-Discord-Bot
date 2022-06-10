import { CommandInteraction, CommandInteractionOption, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { bracketURL, textToChunks } from '../functions';
import { ObjectElement } from '../luInterfaces';
import { Embed } from '../types/Embed';
import { Skill } from '../types/Skill';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'skillitems',
  description: 'View all items that have a skill!',
  options: [
    {
      name: 'skill',
      description: 'An skill in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction: CommandInteraction,
    options: readonly CommandInteractionOption[],
    cdclient: CDClient) {

    const query = options.find((option) => option.name === 'skill').value.toString();
    const skillId = parseInt(query) || parseInt(cdclient.locale.searchSkills(query)[0].value);
    const skill = new Skill(cdclient, skillId);
    await skill.create();
    await skill.addSkillItems();

    const embed = new Embed();
    embed.setTitle(`${skill.name} [${skill.id}]`);
    embed.setURL(skill.getURL());
    embed.setThumbnail(skill.imageURL)

    if (skill.skillItems.length) {
      let text = skill.skillItems.map((item, index) => `**${index + 1}.** ${item.name} ${bracketURL(item.id)}`).join("\n");
      textToChunks(text).forEach((chunk) => {
        embed.addField("Items", chunk)
      })

    } else {
      embed.addField("No Items!", `${skill.name} is not attached to any item!`)
    }

    interaction.reply({
      embeds: [embed],
    });
  },
} as SlashCommand;
