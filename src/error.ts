import { AutocompleteInteraction, BaseCommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, Modal, ModalSubmitInteraction, TextInputComponent } from "discord.js";
import { logChannelId } from "./config";
import { Button } from "./types/Button";
import { Embed } from "./types/Embed";

const NOT_FOUND_IMAGE_URL = "https://media.discordapp.net/attachments/820782771403751478/986374533630013500/unknown.png";

export function notFound(interaction: BaseCommandInteraction | MessageComponentInteraction | ModalSubmitInteraction): void {
  let embed = new Embed();
  embed.setImage(NOT_FOUND_IMAGE_URL);
  embed.addField("Your search was not found.", "Please use the autocomplete suggestions to be safe :)");
  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
}

export async function error(interaction: BaseCommandInteraction | MessageComponentInteraction, err: any): Promise<void> {

  console.error(err);

  let embed = new Embed();
  embed.setTitle("Error");
  embed.setDescription(`\`\`\`\n${err.toString()}\`\`\``);

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });

  if (interaction.isApplicationCommand()) {
    embed.addField("Command", `\`\`\`\n/${interaction.commandName} ${interaction.options.data.map((o) => `${o.name}:"${o.value}"`).join(" ")}\`\`\``);
  }
  if (interaction.isMessageComponent()) {
    embed.addField("Instruction", `\`\`\`\n${interaction.customId}\`\`\``);
  }

  let logChannel = await interaction.client.channels.fetch(logChannelId);
  if (logChannel.isText()) logChannel.send({
    embeds: [embed]
  });

}