const {
    ButtonInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton 
} = require("discord.js");
const DB = require("../../Structures/Schemas/Ticket");
const { PARENTID, EVERYONEID } = require("../../Structures/config.json");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
       if(!interaction.isButton()) return;
       const { guild, member, customId } = interaction;
       if(!["reward", "advertise", "admincomplaint", "adminshr", "partner"].includes(customId)) return;

       const ID = Math.floor(Math.random() * 90000) + 10000;

       await guild.channels.create(`${customId + "-" + ID}`, {
            type: "GUILD_TEXT",
            parent: PARENTID,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: EVERYONEID,
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                }
            ],
       }).then(async(channel) => {
           await DB.create({
            GuildID: guild.id,
            MemberID: member.id,
            TicketID: ID,
            ChannelID: channel.id,
            Closed: false,
            Locked: false,
            Type: customId,
           });

           const embed = new MessageEmbed()
           .setAuthor(`Ticket: ${ID}`,
           guild.iconURL({ dynamic: true })
           )
           .setDescription(
               "Wait until someone answer your ticketa"
            )
            .setFooter("The buttons below are for admins only");
    
            const Buttons = new MessageActionRow();
            Buttons.addComponents(
            new MessageButton()
            .setCustomId("close")
            .setLabel("Save and close the ticket")
            .setStyle("PRIMARY")
            .setEmoji("💾"),
            new MessageButton()
            .setCustomId("lock")
            .setLabel("Close the ticket")
            .setStyle("SECONDARY")
            .setEmoji("🔒"),
            new MessageButton()
            .setCustomId("unlock")
            .setLabel("Reopen the ticket")
            .setStyle("SUCCESS")
            .setEmoji("🔴")
            );
    
            channel.send({
                embeds: [embed],
                components: [Buttons],
                });

            await channel.send({ content: `${member} Ask the <@&912033561350123550> about the problems you have` }).then((m) => {
                setTimeout(() => {
                    m.delete().catch(() => {});
                }, 1 * 100000);
            });  
       });
    },
};
