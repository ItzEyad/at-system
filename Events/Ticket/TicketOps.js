const { ButtonInteraction, MessageEmbed } = require("discord.js");
const { createTranscript } = require('discord-html-transcripts')
const { TRANSCRIPTSID } = require("../../Structures/config.json");
const DB = require("../../Structures/Schemas/Ticket");

module.exports = {
  name: "interactionCreate",
  /**
   * 
   * @param {ButtonInteraction} interaction 
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;
    const { guild, customId, channel, member } = interaction;

    if (!["close", "lock", "unlock"].includes(customId)) return;
    if (!member.permissions.has("MANAGE_CHANNELS"))
      return interaction.reply({ content: "You can't do that :D" })

    const Embed = new MessageEmbed().setColor("WHITE")

    DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
      if (err) throw err;
      if (!docs)
        return interaction.reply({
          content:
            "No Data was found!",
          ephemeral: true,
        });
      switch (customId) {
        case "lock":
          if (docs.Locked === true)
            return interaction.reply({
              content: "The ticket is already locked",
              ephemeral: true,
            });
          await DB.updateOne({ ChannelID: channel.id }, { Locked: true });
          Embed.setDescription("🔒 | This is ticket is now locked");
          channel.permissionOverwrites.edit(docs.MemberID, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false,
          });
          interaction.reply({ embeds: [Embed] });
          break;

        case "unlock":
          if (docs.Locked === false)
            return interaction.reply({
              content: "The ticket is already unlocked",
              ephemeral: true,
            });
          await DB.updateOne({ ChannelID: channel.id }, { Locked: false });
          Embed.setDescription("🔓 | This is ticket is now unlocked");
          channel.permissionOverwrites.edit(docs.MemberID, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
          });
          interaction.reply({ embeds: [Embed] });
          break;

        case "close":
          if (docs.CLosed == true)
            return interaction.reply({
              content:
                "Ticket is already closed, please wait for it to get deleated",
              ephemeral: true,
            });
          const attachment = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${docs.Type} - ${docs.TicketID}.html`
          });
          await DB.updateOne({ ChannelID: channel.id }, { CLosed: true });

          const MEMBER = guild.members.cache.get(docs.MemberID);
          const Message = await guild.channels.cache.get(TRANSCRIPTSID).send({
            embeds: [Embed.setAuthor
              (MEMBER.user.tag, MEMBER.user.displayAvatarURL({ dynamic: true }))
              .setTitle(`Transcript Type: ${docs.Type}\nID: ${docs.TicketID}`),
            ],
            files: [attachment],
          });

          interaction.reply({
            embeds:
              [Embed.setDescription(
                `The transcript is now Saved [CLICK HERE TO CHECK IT](${Message.url})`)]
          })
          setTimeout(() => {
            channel.delete()
          }, 10 * 10000);

          break;
      }
    });
  },
};