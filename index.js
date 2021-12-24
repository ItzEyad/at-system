const { Client, Collection } = require('discord.js');
const client = new Client({intents: 32767});
const { Token } = "OTIzNjY0MjAxNDg5MTk5MTM0.YcTTUg.OfDYY2pTl2lw_TmcJNNQ3vVbi-EN";
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

client.commands = new Collection();

['Events', 'Commands'].forEach(handler => {
    require(`../Handlers/${handler}`)(client, PG, Ascii);
});

client.login(Token);