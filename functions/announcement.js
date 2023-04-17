module.exports = { announceTourney };
const { pmall } = require("./pmall");

const { default: axios } = require('axios');
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, time } = require('discord.js');
const { discord_token, announcementChannelID, tournamentPermRoleID } = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(discord_token);

function announceTourney(link) {

    if (link?.split('/')[3] == 'tournament') {

        axios.get('https://lichess.org/api/tournament/' + link.split('/')[4])
            .then(function (response) {

                try {
                    const hours = parseInt(hourFunc(response.data.secondsToStart));
                    const minutes = parseInt(minutesFunc(response.data.secondsToStart));
                    var str1;

                    if (hours == 0) {
                        if (minutes == 0) {
                            str1 = ' AZ SONRA '
                        }
                        else {
                            str1 = minutes + ' Dakika Sonra';
                        }
                    }
                    else {
                        if (minutes == 0) {
                            str1 = hours + ' Saat Sonra'
                        }
                        else {
                            str1 = hours + ' Saat ' + minutes + ' Dakika Sonra';
                        }
                    }

                    const announceEmbed = new EmbedBuilder()
                        .setColor(0x1feb10)
                        .setTitle('Turnuvamız ' + str1 + ' Başlıyor!')
                        .setURL('https://lichess.org/tournament/' + response.data.id)
                        .setDescription('Turnuva Adı: ' + response.data.fullName
                            + '\nTurnuva Linki: https://lichess.org/tournament/' + response.data.id
                            + '\nTempo: ' + response.data.clock.limit / 60 + '+' + response.data.clock.increment)
                        .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png')
                    client.channels.cache.get(announcementChannelID).send({ content: '@ev', embeds: [announceEmbed] });

                    //pmall('Turnuvamız ' + str1 + ' Başlıyor!\nhttps://lichess.org/tournament/' + response.data.id);


                } catch (error) {
                    client.channels.cache.get(announcementChannelID).send(`<@${tournamentPermRoleID}> duyuru yapılamadı, manuel yapın.`);
                }

            }).catch(function (error) {
                client.channels.cache.get(announcementChannelID).send('Turnuva bulunamadı:\n\`' + link + '\`');
            });

    } else if (link?.split('/')[3] == 'swiss') {

        axios.get('https://lichess.org/api/swiss/' + link.split('/')[4])
            .then(function (response) {

                try {

                    const milliseconds = new Date(response.data.startsAt).getTime() - Date.now();
                    const hours = parseInt(hourFunc(Math.floor(milliseconds / 1000)));
                    const minutes = parseInt(minutesFunc(Math.floor(milliseconds / 1000)));
                    var str1;

                    if (hours == 0) {
                        if (minutes == 0) {
                            str1 = ' AZ SONRA '
                        }
                        else {
                            str1 = minutes + ' Dakika Sonra';
                        }
                    }
                    else {
                        if (minutes == 0) {
                            str1 = hours + ' Saat Sonra'
                        }
                        else {
                            str1 = hours + ' Saat ' + minutes + ' Dakika Sonra';
                        }
                    }

                    try {
                        const announceEmbed = new EmbedBuilder()
                            .setColor(0x1feb10)

                            .setTitle('İsviçre Turnuvamız ' + str1 + ' Başlıyor!')
                            .setURL('https://lichess.org/swiss/' + response.data.id)
                            .setDescription(`Turnuva adı: ${response.data.name}`
                                + '\nTurnuva Linki: https://lichess.org/swiss/' + response.data.id
                                + '\nTempo: ' + response.data.clock.limit / 60 + '+' + response.data.clock.increment)
                            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                        client.channels.cache.get(announcementChannelID).send({ content: '@ev', embeds: [announceEmbed] });
                    } catch (error) {
                        client.channels.cache.get(announcementChannelID)
                        .send({ content: `@everyone İsviçre Turnuvamız ${str1} Başlıyor!\nhttps://lichess.org/swiss/${response.data.id}` });
                    }

                    //pmall('Turnuvamız ' + str1 + ' Başlıyor!\nhttps://lichess.org/tournament/' + response.data.id);

                } catch (error) {
                    client.channels.cache.get(announcementChannelID).send(`<@${tournamentPermRoleID}> duyuru yapılamadı, manuel yapın.`);
                }

            }).catch(function (error) {
                client.channels.cache.get(announcementChannelID).send('Turnuva bulunamadı:\n\`' + link + '\`');
            });

    } else {
        client.channels.cache.get(announcementChannelID).send('Turnuva bulunamadı:\n\`' + link + '\`');
    }
}

function hourFunc(seconds) {
    const result = new Date(seconds * 1000).toISOString().slice(11, 17);
    return result.slice(0, 2);
}

function minutesFunc(seconds) {
    const result = new Date(seconds * 1000).toISOString().slice(11, 17);
    return result.slice(3, 5);
}