import { MessageEmbed } from "discord.js"
import { botColor, footerIcon, footerText, LUServerIcon, LUServerName, } from "../config";

export class Embed extends MessageEmbed {
  constructor(embed?: MessageEmbed) {
    super(embed);
    this.setColor(botColor);
    this.setAuthor({
      name: LUServerName,
      iconURL: LUServerIcon
    })
    this.setFooter({
      text: footerText,
      iconURL: footerIcon
    })
  }
}