import { MessageEmbed } from "discord.js"
import { botColor, botIcon, botName, } from "../config";

export class Embed extends MessageEmbed {
  constructor(embed?: MessageEmbed) {
    super(embed);
    this.setColor(botColor);
    this.setAuthor({
      name: botName,
      iconURL: botIcon
    })
  }
}