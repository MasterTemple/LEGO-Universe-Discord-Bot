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
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'execute',
  description: 'Open a dialog to execute multiple commands on this bot!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    const modal = new Modal()
      .setCustomId('execute')
      .setTitle('Execute Commands');
    const input = new TextInputComponent()
      .setCustomId('input')
      .setLabel("List one command per line. Ex: /drop 7570")
      .setStyle('PARAGRAPH');

    const description = new MessageActionRow<ModalActionRowComponent>().addComponents(input);
    modal.addComponents(description);

    if (interaction.isApplicationCommand() || interaction.isMessageComponent()) await interaction.showModal(modal);
    if (interaction.isModalSubmit()) await interaction.reply({ content: "Nice try", ephemeral: true });


  },
} as SlashCommand;
