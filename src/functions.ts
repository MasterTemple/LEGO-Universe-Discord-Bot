import { BaseCommandInteraction, CacheType, CommandInteractionOption, MessageActionRow, MessageComponentInteraction, MessageEmbed, ModalSubmitInteraction } from "discord.js";
import { explorerDomain } from "./config";
import { Button } from "./types/Button";
import { Embed } from "./types/Embed";

export function textToChunks(input: string, size: number = 1024): string[] {
  if (input.at(-1) !== "\n") input += "\n";
  let fields: string[] = [];
  let indexes = [...input.matchAll(/\n/g)].map(({ index }) => index);
  let breakIndexes = [];
  let previousIndex = 0;
  let previousStartIndex = 0;
  let n = 1;
  if (input.length > size) {

    for (let index of indexes) {
      if (index - previousStartIndex >= size && previousIndex - previousStartIndex < size) {
        n++;
        breakIndexes.push([previousStartIndex, previousIndex]);
        previousStartIndex = previousIndex;
      }
      previousIndex = index;
    }
    breakIndexes.push([previousStartIndex, indexes.at(-1)]);

    let groups = [];
    for (let [breakStartIndex, breakIndex] of breakIndexes) {
      groups.push(input.slice(breakStartIndex, breakIndex));
    }
    if (breakIndexes.length > 0) groups.push(input.slice(breakIndexes.at(-1)[1], input.length));

    groups.forEach((e) =>
      fields.push(e)
    );
    let lastField = fields.at(-1);
    if (lastField == "\n" || lastField == "") fields.pop();
    lastField = fields.at(-1);
    if (lastField == "\n" || lastField == "") fields.pop();

    return fields;
  } else {
    return [input];
  }
}
type urlType = "objects" | "missions" | "objects/loot/table" | "activity";

export function bracketURL(id: number, type: urlType = "objects"): string {
  return `[[${id}]](${explorerDomain}/${type}/${id})`;
}

export function formatIconPath(icon: string): string {
  if (!icon) return icon;
  icon = icon.replace(/^\.\.\\\.\.\\/g, "/lu-res/");
  icon = icon.replace(/\\/g, "/");
  icon = icon.replace(/ /g, "%20");
  icon = icon.replace(/(?<=\.)dds/gi, "png");
  icon = icon.toLowerCase();
  return icon;
}

export function getOption(options: readonly CommandInteractionOption<CacheType>[], parameter?: string) {
  let value = options.find((option) => option.name === parameter)?.value?.toString();
  if (!value) value = options[0].value.toString();
  return value;
}

export interface MessageUpdateData {
  interaction: BaseCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
  embeds: Embed[] | MessageEmbed[],
  components?: MessageActionRow[],
  page?: number,
  pageSize?: number,
  isPaged?: boolean,
}
const DEFAULT_PAGE_SIZE = 8;

export async function replyOrUpdate(data: MessageUpdateData) {

  let interaction = data.interaction;
  let embeds = data.embeds;
  let components = data.components || [];
  let page = data.page || 0;
  let pageSize = data.pageSize || DEFAULT_PAGE_SIZE;
  let isPaged = data?.isPaged === undefined ? true : data.isPaged;

  // put fields into pages
  if (isPaged) {
    let firstEmbed = embeds[0];
    let parameters = "";
    if (interaction.isMessageComponent()) {
      page = parseInt(interaction.customId.match(/(?<=[^\/]+\/[^\/]+\/)[^\?]+/gi)?.[0]) || 0;
      parameters = interaction.customId.match(/\?.*/gi)?.[0];
    }

    let initialSize = firstEmbed.fields.length;
    let hasPreviousPage = page > 0;
    let hasNextPage = !!(firstEmbed.fields[(page + 1) * pageSize]);

    firstEmbed.fields = firstEmbed.fields.slice(page * pageSize, (page + 1) * pageSize);
    let slicedSize = firstEmbed.fields.length;
    if (initialSize != slicedSize) firstEmbed.setTitle(`${firstEmbed.title} (${page + 1})`);

    let pageButtons = new MessageActionRow();
    if (interaction.isMessageComponent()) {
      let { cmd, id } = [...interaction.customId.matchAll(/^(?<cmd>[^\/]+)\/(?<id>[^\/]+)\/?(?<page>[^\?]+)?/gi)][0].groups;

      pageButtons.addComponents(
        new Button().setCustomId(`${cmd}/${id}/${page - 1}${parameters}`).setDisabled(!hasPreviousPage).setLabel("Previous Page"),
        new Button().setCustomId(`${cmd}/${id}/${page + 1}${parameters}`).setDisabled(!hasNextPage).setLabel("Next Page"),
      );
    }
    if (interaction.isApplicationCommand()) {
      let cmd = interaction.commandName;
      let id = getOption(interaction.options?.data || []);
      pageButtons.addComponents(
        new Button().setCustomId(`${cmd}/${id}/${page - 1}${parameters}`).setDisabled(!hasPreviousPage).setLabel("Previous Page"),
        new Button().setCustomId(`${cmd}/${id}/${page + 1}${parameters}`).setDisabled(!hasNextPage).setLabel("Next Page"),
      );
    }
    if (!pageButtons.components.every((button) => button.disabled)) components.push(pageButtons);
  }

  if (interaction.isMessageComponent()) {
    await interaction.update({
      embeds: embeds,
      components: components
    });
  }

  if (interaction.isApplicationCommand()) {
    await interaction.reply({
      embeds: embeds,
      components: components
    });
  }

  if (interaction.isModalSubmit()) {
    let channel = interaction.client.channels.cache.get(interaction.channelId);
    if (!channel) channel = await interaction.client.channels.fetch(interaction.channelId);
    if (channel.isText()) {
      await channel.send({
        embeds: embeds,
        components: components
      });
    }
  }
}
