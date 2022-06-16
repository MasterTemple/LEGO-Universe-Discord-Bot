import { MessageButton } from "discord.js";

export class Button extends MessageButton {
  constructor(green?: boolean) {
    super();
    if (green) this.setStyle("SUCCESS");
    else this.setStyle("PRIMARY");
  }
}