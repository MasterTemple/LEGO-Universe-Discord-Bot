import { replyOrUpdate } from '../functions';
import { Embed } from '../types/Embed';
import { SlashCommand } from '../types/SlashCommand';

export default {
  name: 'reload',
  description: 'Reload the data from the cdclient.sqlite and locale.xml!',
  options: [],
  run: async function (
    interaction,
    options,
    cdclient) {

    // if (adminRoles.length > 0) {

    //   const id = interaction.user.id;
    //   console.log({ id });

    //   const member = interaction.guild.members.cache.find((v, k) => k === id);
    //   console.log({ member });
    //   for (let adminRole of adminRoles) {

    //     // const roles = await interaction.guild.roles.fetch();
    //     const role = member.roles.cache.has(adminRole.toString());
    //     // const role = roles.get(adminRole.toString());
    //     console.log(role);

    //   }

    //   // if(roles.find((role) => role))
    // }

    await cdclient.reload();
    await cdclient.locale.reload();

    const embed = new Embed();
    embed.setTitle(`Reload Successful!`);

    await replyOrUpdate({
      interaction: interaction,
      embeds: [embed],
      isPaged: false,
      components: [],
    });
  },
} as SlashCommand;
