module.exports = { startSession }

const { default: axios } = require('axios');
const { Client, EmbedBuilder, Colors, roleMention } = require('discord.js');
const { reportSessionChannelID, refRoleID } = require('../config.json');

async function startSession(client, platform, userName, userId, description) {
    if (platform == 'lichess') {
        const embed = new EmbedBuilder()
            .setColor(Colors.Grey)
            .setTitle('İnceleme Oturumu')
            .setURL(`https://lichess.org/@/${userId}`)
            .setFields(
                { name: 'Kullanıcı', value: userName },
                { name: 'Hesap Linki', value: `https://lichess.org/@/${userId}` },
            )
            .setDescription(description)
            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

        const message = await client.channels.cache.get(reportSessionChannelID).send({
            content: `${roleMention(refRoleID)}`,
            embeds: [embed],
            fetchReply: true
        });
        message.react('👍');
        message.react('👎');
    } else {
        const embed = new EmbedBuilder()
            .setColor(Colors.Grey)
            .setTitle('İnceleme Oturumu')
            .setURL(`https://www.chess.com/member/${userId}`)
            .setFields(
                { name: 'Kullanıcı', value: userName },
                { name: 'Hesap Linki', value: `https://www.chess.com/member/${userId}` },
            )
            .setDescription(description)
            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

        const message = await client.channels.cache.get(reportSessionChannelID).send({
            content: `${roleMention(refRoleID)}`,
            embeds: [embed],
            fetchReply: true
        });
        message.react('👍');
        message.react('👎');
    }
}