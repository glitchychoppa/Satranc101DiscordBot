const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { startSession } = require('../functions/report');
const { dbConnectionString, mongoDB, mongoCol } = require('../config.json');
const MongoClient = require("mongodb").MongoClient;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bildir')
        .setDescription('Hile olduğunu düşündüğünüz oyunları atabilirsiniz.')
        .addStringOption(option => option
            .setName('taraf')
            .setDescription('Şüpheli taraf.')
            .setRequired(true)
            .setChoices(
                { name: 'Beyaz', value: 'beyaz' },
                { name: 'Siyah', value: 'siyah' }
            ))
        .addStringOption(option => option
            .setName('id')
            .setDescription('Oyun ID\'si.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('açıklama')
            .setDescription('Hakemlere iletmek istediğin mesaj.')),
    async execute(interaction, client) {

        const config = {
            headers: {
                'Accept': 'application/json'
            }
        };

        const gameId = interaction.options.getString('id').slice(0, 8)

        axios.get(`https://lichess.org/game/export/${gameId}`, config)
            .then(response => {

                const userName = interaction.options.getString('taraf') == 'beyaz'
                    ? response.data.players.white.user.name : response.data.players.black.user.name;

                const userId = interaction.options.getString('taraf') == 'beyaz'
                    ? response.data.players.white.user.id : response.data.players.black.user.id;

                const url = `https://lichess.org/${gameId}`;

                const mongoClient = new MongoClient(dbConnectionString);

                (async () => {
                    try {
                        const result = await mongoClient.db(mongoDB).collection(mongoCol).findOne({ lichessID: userId })
    
                        const embed = new EmbedBuilder()
                            .setColor(0x2cee1a)
                            .setTitle('Şikayetiniz Hakemlere İletildi')
                            .setURL(url)
                            .setFields(
                                { name: 'Kullanıcı', value: `<@${result.discordID}> - ${userName}` },
                                { name: 'Hesap Linki', value: 'https://lichess.org/@/' + userId },
                                { name: 'Oyun Linki', value: url },
                            )
                            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
    
                        const message = interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        });
    
                        await startSession(client,`<@${result.discordID}> - ${userName}`, userId, url, interaction.options.getString('açıklama'));
    
                    } catch (error) {
                        const embed = new EmbedBuilder()
                            .setColor(0x2cee1a)
                            .setTitle('Şikayetiniz Hakemlere İletildi')
                            .setURL(url)
                            .setFields(
                                { name: 'Kullanıcı', value: `${userName}` },
                                { name: 'Hesap Linki', value: 'https://lichess.org/@/' + userId },
                                { name: 'Oyun Linki', value: url },
                            )
                            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');
    
                        const message = interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        });
    
                        await startSession(client,`${userName}`, userId, url, interaction.options.getString('açıklama'));
                    }
                }) ();

            })
            .catch(error => {
                const invalidAccount = new EmbedBuilder()
                    .setColor(0xec0505)
                    .setTitle('Geçersiz ID')
                    .setDescription(`Geçersiz URL:\nhttps://lichess.org/${gameId}`)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                interaction.reply({
                    embeds: [invalidAccount],
                    ephemeral: true
                });
            });
    }
}