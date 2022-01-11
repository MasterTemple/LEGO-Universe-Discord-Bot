import {CommandInteraction, CommandInteractionOption, MessageEmbed} from 'discord.js';
import {CDClient} from '../cdclient';
import { Item } from '../types/Item';
import {SlashCommand} from '../types/SlashCommand';

export default {
  name: 'item',
  description: 'Get information about an item',
  options: [
    {
      name: 'item',
      description: 'An item in LEGO Universe.',
      type: 'STRING',
      required: true,
      autocomplete: true
    }],
  run: async function(
      interaction: CommandInteraction,
      options: readonly CommandInteractionOption[],
      cdclient: CDClient) {
    console.log('/item');
    const itemId = parseInt(options.find((option) => option.name === 'item').value.toString())
    const item = new Item(cdclient, itemId);
    await item.create()
    // console.log(item);

    let embed = new MessageEmbed().setTitle(`${item.name} [${item.id}]`)
    embed.setURL(item.getURL());
    embed.addField("Rarity", `Tier ${item.itemComponent.rarity}`, true)
    embed.addField("Equip Location(s)", item.itemComponent.equipLocations.join(", "), true)
    embed.addField("Proxies", item.itemComponent.proxyItems.map(({name, id}) => `${name} [[${id}]](${item.getURL(id)})`).join(", ") || "None", true)
    embed.addField("Armor", item.stats.armor.toString(), true)
    embed.addField("Health", item.stats.health.toString(), true)
    embed.addField("Imagination", item.stats.imagination.toString(), true)
    embed.addField("Cost", item.itemComponent.buyPrice.toString(), true)
    embed.addField("Stack Size", item.itemComponent.stackSize.toString(), true)
    embed.addField("Level Requirement", item.itemComponent.levelRequirement.toString(), true)

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
} as SlashCommand;
