import { CommandInteraction, CommandInteractionOption, MessageActionRow, MessageEmbed, Modal, TextInputComponent } from 'discord.js';
import { CDClient } from '../cdclient';
import { dropHomeRow, itemHomeRow } from '../components';
import { reportChannelId } from '../config';
import { fillEmbedWithLootDrops } from '../discord';
import { notFound } from '../error';
import { bracketURL, getOption, replyOrUpdate } from '../functions';
import { decimalToFraction } from '../math';
import { Button } from '../types/Button';
import { Embed } from '../types/Embed';
import { Item } from '../types/Item';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'report',
  description: 'Open a dialog to report anything about this bot!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    if (interaction.isApplicationCommand()) {
      const modal = new Modal()
        .setCustomId('report')
        .setTitle('Report');
      const title = new TextInputComponent()
        .setCustomId('title')
        .setLabel("Title")
        .setStyle('SHORT');
      const input = new TextInputComponent()
        .setCustomId('input')
        .setLabel("What's would you like to report?")
        .setStyle('PARAGRAPH');

      modal.addComponents(
        new MessageActionRow().addComponents(title),
        new MessageActionRow().addComponents(input)
      );

      interaction.showModal(modal);

    } else if (interaction.isModalSubmit()) {

      let embed = new Embed();
      embed.setTitle(interaction.fields.getTextInputValue("title"));
      embed.setDescription(interaction.fields.getTextInputValue("input"));
      embed.setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL()
      });

      let reportChannel = await interaction.client.channels.fetch(reportChannelId);
      if (reportChannel.isText()) reportChannel.send({
        embeds: [embed]
      });

    }
  },
} as SlashCommand;
