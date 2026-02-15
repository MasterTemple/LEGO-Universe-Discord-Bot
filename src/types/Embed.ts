import { ColorResolvable, EmbedBuilder, EmbedFieldBuilder, APIEmbedField } from 'discord.js';
import { botColor, footerIcon, footerText, LUServerIcon, LUServerName } from '../config';

export class Embed extends EmbedBuilder {
  constructor(embed?: EmbedBuilder) {
    super(embed);
    this.setColor(botColor as ColorResolvable);
    this.setAuthor({
      name: LUServerName,
      iconURL: LUServerIcon,
    });
    this.setFooter({
      text: footerText,
      iconURL: footerIcon,
    });
  }

  addField(name: string, value: string, inline: boolean = false): this {
    return this.addFields({ name, value, inline });
  }

  get fields(): APIEmbedField[] {
    return (this.data.fields || []) as APIEmbedField[];
  }

  set fields(fields: APIEmbedField[]) {
    this.setFields(fields.map((field) => new EmbedFieldBuilder(field)));
  }
}
