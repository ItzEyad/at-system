    const { model, Schema } = require("mongoose");

    module.exports = model("Ticket", new Schema({
        GuildID: String,
        MemberID: String,
        TicketID: String,
        ChannelID: String,
        closed: Boolean,
        Locket: Boolean,
        Type: String,
    }))