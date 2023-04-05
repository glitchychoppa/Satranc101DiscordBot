module.exports = { startSession }

const { default: axios } = require('axios');
const { Client, EmbedBuilder, Colors, GatewayIntentBits } = require('discord.js');
const { discord_token, reportSessionChannelID } = require('../config.json');

const client = new Client({ intents: 32767 });

client.login(discord_token);

async function startSession(userName, userId, url, description) {

    const embed = new EmbedBuilder()
        .setColor(Colors.Grey)
        .setTitle('İnceleme Oturumu')
        .setURL(url)
        .setFields(
            { name: 'Kullanıcı', value: userName },
            { name: 'Hesap Linki', value: `https://lichess.org/@/${userId}` },
            { name: 'Oyun Linki', value: url },
        )
        .setDescription(description)
        .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

    const message = await client.channels.cache.get(reportSessionChannelID).send({
        embeds: [embed],
        fetchReply: true
    });
    message.react('👍');
    message.react('👎');
}