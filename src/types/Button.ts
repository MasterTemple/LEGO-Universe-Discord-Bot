import { MessageButton, MessageEmbed } from "discord.js"
import { botColor, botIcon, botName, } from "../config";

export class Button extends MessageButton {
  constructor(button?: Button) {
    super(button);
    this.setStyle("PRIMARY")
  }
}