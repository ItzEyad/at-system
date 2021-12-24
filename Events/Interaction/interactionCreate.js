const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports ={
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interactio 
     * @param {Client} client 
     */
    async execute(interactio, client) {
        if(interactio.isCommand()) {
            const command = client.commands.get (interactio.commandName);
            if(!command) return interactio.reply({embeds: [
                new MessageEmbed() 
                .setColor("RED")
                .setDescription("❌ An error occured while running the command")
            ]}) && client.commands.delete(interactio.commandName);

            command.execute(interactio, client)
        }
    }
}