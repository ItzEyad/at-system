const { 
    MessageEmbed, 
    CommandInteraction, 
    MessageActionRow, 
    MessageButton,
    Message,
 } = require("discord.js");
const { OPENTICKET } = require("../../Structures/config.json");

module.exports = {
    name: "ticket",
    description: "Setup your ticket",
    permission: "MANAGE_CHANNELS",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const { guild } = interaction;

        const Embed = new MessageEmbed().setAuthor(
          "AtoMic Tickets ®️",
          guild.iconURL({ dynamic: true })
      )
      .setDescription(
        `
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        تكت روارد「💰」•
        شراء اعلان「💵」•
        شكوي علي اداري「🔴」•
        مسؤولين الادارة「⭐」•
        بارتنر「♾」•
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        `
        )
      .setColor("WHITE");

      const Buttons = new MessageActionRow();
      Buttons.addComponents(
          new MessageButton()
          .setCustomId("reward")
          .setLabel("💰")
          .setStyle("PRIMARY")
          .setEmoji(""),
          new MessageButton()
          .setCustomId("advertise")
          .setLabel("💵")
          .setStyle("PRIMARY")
          .setEmoji(""),
          new MessageButton()
          .setCustomId("admincomplaint")
          .setLabel("🔴")
          .setStyle("PRIMARY")
          .setEmoji(""),
          new MessageButton()
          .setCustomId("adminshr")
          .setLabel("⭐")
          .setStyle("PRIMARY")
          .setEmoji(""),
          new MessageButton()
          .setCustomId("partner")
          .setLabel("♾")
          .setStyle("PRIMARY")
          .setEmoji(""),
      );

      await guild.channels.cache
      .get(OPENTICKET)
      .send({ embeds: [Embed], components: [Buttons] });

      interaction.reply({ content: "Done", ephemeral: true });
    }
}
