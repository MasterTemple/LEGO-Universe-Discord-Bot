import { MessageButton, MessageEmbed } from "discord.js"

export class Button extends MessageButton {
  constructor(button?: Button) {
    super(button);
    this.setStyle("PRIMARY")
  }
}