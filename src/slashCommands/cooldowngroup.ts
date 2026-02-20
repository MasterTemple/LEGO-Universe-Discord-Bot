import { notFound } from '../error';
import { getOption, replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'cooldowngroup',
  description: 'View the skills in a cooldowngroup!',
  options: [
    {
      name: 'cooldowngroup',
      description: 'A cooldowngroup in LEGO Universe.',
      type: 10,
      required: true
    }],
  run: async function (
    interaction,
    options,
    cdclient) {

    const cdg = parseInt(getOption(options, "cooldowngroup"));
    const skills = await cdclient.getSkillsInCooldownGroup(cdg);

    if (!cdg) {
      notFound(interaction);
      return;
    }

    const embed = new Embed();
    embed.setTitle(`Cooldown Group ${cdg}`);

    skills.forEach((skill) => {
      let desc = cdclient.locale.getSkillDescription(skill.skillID).find((d) => d.name === "Description");
      embed.addField(cdclient.locale.getSkillName(skill.skillID) || `Skill ${skill.skillID}`,
        desc?.description || "No description",
        true);
    });

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
    });

  },
} as SlashCommand;
