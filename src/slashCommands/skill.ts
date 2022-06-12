import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed } from 'discord.js';
import { CDClient } from '../cdclient';
import { skillHomeRow } from '../components';
import { getOption, replyOrUpdate } from '../functions';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { Skill } from '../types/Skill';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'skill',
  description: 'View the stats of a skill!',
  options: [
    {
      name: 'skill',
      description: 'A skill in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true,
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const query = getOption(options, "skill");
    const skillId = parseInt(query) || parseInt(cdclient.locale.searchSkills(query)[0].value);
    const skill = new Skill(cdclient, skillId);
    await skill.create();

    const embed = new Embed();
    embed.setTitle(`${skill.name} [${skill.id}]`);
    embed.setURL(skill.getURL());
    embed.setThumbnail(skill.imageURL);

    embed.addField("Cooldown Group", "Group " + skill.skillBehavior.cooldowngroup.toString() || "No Cooldown Group", true);
    embed.addField("Cooldown Time", (skill.skillBehavior.cooldown.toString() || "0") + " Seconds", true);
    embed.addField("Imagination Cost", (skill.skillBehavior.imaginationcost.toString() || "0") + " Imagination", true);
    if (skill.skillBehavior.armorBonusUI) embed.addField("Armor Bonus", skill.skillBehavior.armorBonusUI.toString() + " Armor", true);
    if (skill.skillBehavior.imBonusUI) embed.addField("Imagination Bonus", skill.skillBehavior.imBonusUI.toString() + " Imagination", true);
    if (skill.skillBehavior.lifeBonusUI) embed.addField("Life Bonus", skill.skillBehavior.lifeBonusUI.toString() + " Life", true);
    skill.descriptions.forEach((desc) => {
      embed.addField(desc.name, desc.description || "No Description");
    });

    replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      isPaged: false,
      components: [skillHomeRow(skill, "skill")],
    });

  },
} as SlashCommand;
