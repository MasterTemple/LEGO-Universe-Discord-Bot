import { BaseCommandInteraction, CommandInteraction, CommandInteractionOption, MessageActionRow, MessageComponentInteraction, MessageEmbed, Modal, ModalActionRowComponent, ModalSubmitInteraction, TextInputComponent } from 'discord.js';
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
import { ModalCommand } from '../types/ModalCommand';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'report',
  description: 'Open a dialog to report anything about this bot!',
  options: [],
  run: async function (
    interaction,
    cdclient) {

    let embed = new Embed();
    embed.setTitle(interaction.fields.getTextInputValue("title"));
    embed.setDescription(interaction.fields.getTextInputValue("input"));
    embed.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL()
    });

    let reportChannel = await interaction.client.channels.fetch(reportChannelId);
    if (reportChannel.isText()) await reportChannel.send({
      embeds: [embed]
    });

  },
} as ModalCommand;
