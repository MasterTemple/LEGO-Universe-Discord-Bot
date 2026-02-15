import { ActionRowBuilder, BaseInteraction, ButtonBuilder, MessageComponentInteraction, ModalSubmitInteraction, TextBasedChannel } from 'discord.js';
import { explorerDomain } from './config';
import { Button } from './types/Button';
import { Embed } from './types/Embed';

export function textToChunks(input: string, size: number = 1024): string[] {
  if (input.at(-1) !== '\n') input += '\n';
  const fields: string[] = [];
  const indexes = [...input.matchAll(/\n/g)].map(({ index }) => index as number);
  const breakIndexes: number[][] = [];
  let previousIndex = 0;
  let previousStartIndex = 0;
  if (input.length > size) {
    for (const index of indexes) {
      if (index - previousStartIndex >= size && previousIndex - previousStartIndex < size) {
        breakIndexes.push([previousStartIndex, previousIndex]);
        previousStartIndex = previousIndex;
      }
      previousIndex = index;
    }
    breakIndexes.push([previousStartIndex, indexes.at(-1) as number]);

    const groups: string[] = [];
    for (const [breakStartIndex, breakIndex] of breakIndexes) {
      groups.push(input.slice(breakStartIndex, breakIndex));
    }
    if (breakIndexes.length > 0) groups.push(input.slice(breakIndexes.at(-1)![1], input.length));

    groups.forEach((e) => fields.push(e));
    let lastField = fields.at(-1);
    if (lastField == '\n' || lastField == '') fields.pop();
    lastField = fields.at(-1);
    if (lastField == '\n' || lastField == '') fields.pop();

    return fields;
  }
  return [input];
}

type urlType = 'objects' | 'missions' | 'objects/loot/table' | 'activity';

export function bracketURL(id: number, type: urlType = 'objects'): string {
  return `[[${id}]](${explorerDomain}/${type}/${id})`;
}

export function formatIconPath(icon: string): string {
  if (!icon) return icon;
  icon = icon.replace(/^\.\.\\\.\.\\/g, '/lu-res/');
  icon = icon.replace(/\\/g, '/');
  icon = icon.replace(/ /g, '%20');
  icon = icon.replace(/(?<=\.)dds/gi, 'png');
  icon = icon.toLowerCase();
  return icon;
}

export function getOption(options: readonly any[], parameter?: string) {
  let value = options.find((option: any) => option.name === parameter)?.value?.toString();
  if (!value) value = options[0].value.toString();
  return value;
}

export interface MessageUpdateData {
  interaction: BaseInteraction | MessageComponentInteraction | ModalSubmitInteraction,
  embeds: Embed[],
  components?: ActionRowBuilder<ButtonBuilder>[],
  page?: number,
  pageSize?: number,
  isPaged?: boolean,
}
const DEFAULT_PAGE_SIZE = 8;

export async function replyOrUpdate(data: MessageUpdateData) {
  const interaction = data.interaction;
  const embeds = data.embeds;
  const components = data.components || [];
  let page = data.page || 0;
  const pageSize = data.pageSize || DEFAULT_PAGE_SIZE;
  const isPaged = data?.isPaged === undefined ? true : data.isPaged;

  if (isPaged) {
    const firstEmbed = embeds[0];
    let parameters = '';
    if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
      page = parseInt(interaction.customId.match(/(?<=[^\/]+\/[^\/]+\/)[^\?]+/gi)?.[0]) || 0;
      parameters = interaction.customId.match(/(?<=\?).*/gi)?.[0]?.replace('&unique', '') || '';
    }

    const initialSize = firstEmbed.fields.length;
    const hasPreviousPage = page > 0;
    const hasNextPage = !!(firstEmbed.fields[(page + 1) * pageSize]);

    firstEmbed.fields = firstEmbed.fields.slice(page * pageSize, (page + 1) * pageSize);
    const slicedSize = firstEmbed.fields.length;
    if (initialSize != slicedSize) firstEmbed.setTitle(`${firstEmbed.data.title} (${page + 1})`);

    const pageButtons = new ActionRowBuilder<ButtonBuilder>();
    if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
      const { cmd, id } = [...interaction.customId.matchAll(/^(?<cmd>[^\/]+)\/(?<id>[^\/]+)\/?(?<page>[^\?]+)?/gi)][0].groups as any;
      pageButtons.addComponents(
        new Button().setCustomId(`${cmd}/${id}/${page - 1}?${parameters}&unique`).setDisabled(!hasPreviousPage).setLabel('Previous Page'),
        new Button().setCustomId(`${cmd}/${id}/${page + 1}?${parameters}&unique`).setDisabled(!hasNextPage).setLabel('Next Page'),
      );
    }
    if (interaction.isChatInputCommand()) {
      const cmd = interaction.commandName;
      const id = getOption(interaction.options?.data || []);
      pageButtons.addComponents(
        new Button().setCustomId(`${cmd}/${id}/${page - 1}?${parameters}&unique`).setDisabled(!hasPreviousPage).setLabel('Previous Page'),
        new Button().setCustomId(`${cmd}/${id}/${page + 1}?${parameters}&unique`).setDisabled(!hasNextPage).setLabel('Next Page'),
      );
    }
    if (!pageButtons.components.every((button) => button.data.disabled)) components.push(pageButtons);
  }

  if (interaction.isMessageComponent()) {
    await interaction.update({ embeds, components });
  }

  if (interaction.isChatInputCommand()) {
    await interaction.reply({ embeds, components });
  }

  if (interaction.isModalSubmit()) {
    let channel = interaction.client.channels.cache.get(interaction.channelId);
    if (!channel) channel = await interaction.client.channels.fetch(interaction.channelId);
    if (channel?.isTextBased?.()) {
      await (channel as TextBasedChannel).send({ embeds, components });
    }
  }
}
