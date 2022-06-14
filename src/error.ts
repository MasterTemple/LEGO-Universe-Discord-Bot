import { AutocompleteInteraction, BaseCommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, Modal, TextInputComponent } from "discord.js";
import { logChannelId } from "./config";
import { Button } from "./types/Button";
import { Embed } from "./types/Embed";

const NOT_FOUND_IMAGE_URL = "https://media.discordapp.net/attachments/820782771403751478/986374533630013500/unknown.png";

export function notFound(interaction: BaseCommandInteraction | MessageComponentInteraction): void {
  let embed = new Embed();
  embed.setImage(NOT_FOUND_IMAGE_URL);
  embed.addField("Your search was not found.", "Please use the autocomplete suggestions to be safe :)");
  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
}

export async function error(interaction: BaseCommandInteraction | MessageComponentInteraction, err: any): Promise<void> {
  let embed = new Embed();
  embed.setTitle("Error");
  embed.setDescription(`\`\`\`\n${err.toString()}\`\`\``);
  // let reportButton = new MessageActionRow().addComponents(
  //   new MessageButton().setStyle("DANGER").setLabel("Report").setCustomId("modal/report")
  // );

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
    // components: [reportButton]
  });
  if (interaction.isApplicationCommand()) {
    embed.addField("Command", `\`\`\`\n/${interaction.commandName} ${interaction.options.data.map((o) => `${o.name}:"${o.value}"`).join(" ")}\`\`\``);
    // embed.addField("Options", `\`\`\`json\n${JSON.stringify(interaction.options.data, null, 2)}\`\`\``);
  }
  if (interaction.isMessageComponent()) {
    embed.addField("Instruction", interaction.customId);
  }

  let logChannel = await interaction.client.channels.fetch(logChannelId);
  if (logChannel.isText()) logChannel.send({
    embeds: [embed]
  });

}