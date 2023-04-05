const { discord_token, dbConnectionString } = require('./config.json');
const { connect } = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFiles = fs.readdirSync(`./handlers`).filter(file => file.endsWith('js'));
for (const file of functionFiles) {
    require(`./handlers/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(discord_token);

(async () => {
    await connect(dbConnectionString).catch(console.error);
})();