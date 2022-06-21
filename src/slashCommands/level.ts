import { MessageActionRow } from 'discord.js';
import { explorerDomain } from '../config';
import { getOption, replyOrUpdate } from '../functions';
import { LevelData } from '../luInterfaces';
import { formatNum } from '../math';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'level',
  description: 'View stats about a level in LEGO Universe!',
  options: [
    {
      name: 'level',
      description: 'A level in LEGO Universe.',
      type: 'NUMBER',
      required: true
    }],
  run: async function (
    interaction,
    options,
    cdclient) {
    const level = parseInt(getOption(options, "level"));
    const data: LevelData = await cdclient.getLevelData(level);
    const minLevel = 1;
    const maxLevel: number = await cdclient.getMaxLevel();
    const isValid = level >= minLevel && level <= maxLevel;

    const embed = new Embed();
    const buttons = new MessageActionRow();

    const uIcon = `${explorerDomain}/lu-res/ui/ingame/passport_i90.png`;
    embed.setThumbnail(uIcon);

    if (isValid) {

      embed.setTitle(`Level ${level}!`);

      embed.addField("Requirements", `**For Level ${level}:**`, true);
      embed.addField(`From Level ${level - 1}`, `${formatNum(data.experienceFromPreviousLevel)} Experience`, true);
      embed.addField("Total", `${formatNum(data.experienceFromLevel0)} Experience`, true);

      buttons.addComponents(
        new Button().setDisabled(level === minLevel).setLabel(`Level ${level - 1}`).setCustomId(`level/${level - 1}`),
        new Button().setDisabled(level === maxLevel).setLabel(`Level ${level + 1}`).setCustomId(`level/${level + 1}`)
      );

    } else {

      embed.setTitle("Invalid Level!",);
      embed.addField("Please enter a valid level.", `All levels between ${minLevel} and ${maxLevel} are valid.`);

    }

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      isPaged: false,
      components: isValid ? [buttons] : [],
    });
  },
} as SlashCommand;
