import { MessageEmbed } from "discord.js"
import { botColor, LUServerIcon, LUServerName, } from "../config";

export class Embed extends MessageEmbed {
  constructor(embed?: MessageEmbed) {
    super(embed);
    this.setColor(botColor);
    this.setAuthor({
      name: LUServerName,
      iconURL: LUServerIcon
    })
  }
}