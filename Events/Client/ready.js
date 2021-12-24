const { Client } = require("discord.js")
const mongoose = require("mongoose");
const { Database } = require("../..//Structures/config.json");
module.exports = {
    name: "ready",
    once: true,
    /**
     * @parm {Client} client
     */
    execute(client) {
        console.log("TICKET SYSTEM IS ON")
        client.user.setActivity("ATOMIC | TICKET", {type: "STREAMING"});

        if(!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The bot is now connected to the Database!")
        }).catch((err) => {
            console.log(err)
        })
    }
}