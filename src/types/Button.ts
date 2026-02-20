import { ButtonBuilder, ButtonStyle } from 'discord.js';

export class Button extends ButtonBuilder {
  constructor(green?: boolean) {
    super();
    if (green) this.setStyle(ButtonStyle.Success);
    else this.setStyle(ButtonStyle.Primary);
  }
}
