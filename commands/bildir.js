const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { startSession } = require('../functions/report');
const { dbConnectionString, mongoDB, mongoCol } = require('../config.json');
const MongoClient = require("mongodb").MongoClient;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bildir')
        //.setDescription('Hile olduğunu düşündüğünüz oyunlari atabilirsiniz.')
        .setDescription('hile')
        .addSubcommand(subcommand => subcommand
            .setName('lichess')
            .setDescription('Lichess kullanıcısını bildir.')
            .addStringOption(option => option
                .setName('id')
                .setDescription('Şüpheli hesabın kullanici adi.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('aciklama')
                .setDescription('Oyunun linkini yapıştırın ve sorununuzu açıklayın.')
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('chess_com')
            .setDescription('Chess.com kullanıcısını bildir.')
            .addStringOption(option => option
                .setName('id')
                .setDescription('Süpheli hesabin kullanici adi.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('aciklama')
                .setDescription('Oyunun linkini yapistirin ve sorununuzu aciklayin.')
                .setRequired(true))),
    async execute(interaction, client) {

        switch (interaction.options.getSubcommand()) {
            case 'lichess':

                //lichess api ile kullanıcının lichess hesabının biyografi (açıklama) bölümüne erişiyoruz.
                axios.get('https://lichess.org/api/user/' + interaction.options.getString('id').toLowerCase())
                    .then(function (response) {
                        const mongoClient = new MongoClient(dbConnectionString);

                        (async () => {
                            try {
                                const result = await mongoClient.db(mongoDB).collection(mongoCol).findOne({ lichessID: response.data.id })

                                const embed = new EmbedBuilder()
                                    .setColor(0x2cee1a)
                                    .setTitle('Şikayetiniz Hakemlere İletildi')
                                    .setURL('https://lichess.org/@/' + response.data.id)
                                    .setFields(
                                        { name: 'Kullanıcı', value: `<@${result.discordID}> - ${response.data.username}` },
                                        { name: 'Hesap Linki', value: 'https://lichess.org/@/' + response.data.id },
                                    )
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                                const message = interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                                await startSession(client, interaction.options.getSubcommand(), `<@${result.discordID}> - ${response.data.username}`, response.data.id, interaction.options.getString('aciklama'));
                                console.log(`${interaction.user.tag} - ${interaction.user.id} bir oyun bildirdi.`)

                            } catch (error) {
                                const embed = new EmbedBuilder()
                                    .setColor(0x2cee1a)
                                    .setTitle('Şikayetiniz Hakemlere İletildi')
                                    .setURL('https://lichess.org/@/' + response.data.id)
                                    .setFields(
                                        { name: 'Kullanıcı', value: `${response.data.username}` },
                                        { name: 'Hesap Linki', value: 'https://lichess.org/@/' + response.data.id },
                                    )
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                                const message = interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                                await startSession(client, interaction.options.getSubcommand(), response.data.username, response.data.id, interaction.options.getString('aciklama'));
                                console.log(`${interaction.user.tag} - ${interaction.user.id} bir oyun bildirdi.`);
                            }
                        })();
                    })
                    .catch(error => {
                        const invalidAccount = new EmbedBuilder()
                            .setColor(0xec0505)
                            .setTitle('Hesap Bulunamadı.')
                            .setDescription(`\`${interaction.options.getString('id')}\` adında bir lichess.org hesabı bulunamadı.`)
                            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                        interaction.reply({ embeds: [invalidAccount], ephemeral: true });
                    });
                break;
            case 'chess_com':
                axios.get('https://api.chess.com/pub/player/' + interaction.options.getString('id'))
                    .then(function (response) {
                        const mongoClient = new MongoClient(dbConnectionString);

                        (async () => {
                            try {
                                const result = await mongoClient.db(mongoDB).collection(mongoCol).findOne({ chesscomID: response.data.username })

                                const embed = new EmbedBuilder()
                                    .setColor(0x2cee1a)
                                    .setTitle('Şikayetiniz Hakemlere İletildi')
                                    .setURL('https://www.chess.com/member/' + response.data.username)
                                    .setFields(
                                        { name: 'Kullanıcı', value: `<@${result.discordID}> - ${response.data.username}` },
                                        { name: 'Hesap Linki', value: 'https://www.chess.com/member/' + response.data.username },
                                    )
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                                const message = interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                                await startSession(client, interaction.options.getSubcommand(), `<@${result.discordID}> - ${response.data.username}`, response.data.username, interaction.options.getString('aciklama'));
                                console.log(`${interaction.user.tag} - ${interaction.user.id} bir oyun bildirdi.`)

                            } catch (error) {
                                const embed = new EmbedBuilder()
                                    .setColor(0x2cee1a)
                                    .setTitle('Şikayetiniz Hakemlere İletildi')
                                    .setURL('https://www.chess.com/member/' + response.data.username)
                                    .setFields(
                                        { name: 'Kullanıcı', value: `${response.data.username}` },
                                        { name: 'Hesap Linki', value: 'https://www.chess.com/member/' + response.data.username },
                                    )
                                    .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                                const message = interaction.reply({
                                    embeds: [embed],
                                    ephemeral: true
                                });

                                await startSession(client, interaction.options.getSubcommand(), response.data.username, response.data.username, interaction.options.getString('aciklama'));
                                console.log(`${interaction.user.tag} - ${interaction.user.id} bir oyun bildirdi.`);
                            }
                        })();
                    })
                    .catch(error => {
                        const invalidAccount = new EmbedBuilder()
                            .setColor(0xec0505)
                            .setTitle('Hesap Bulunamadı.')
                            .setDescription(`\`${interaction.options.getString('id')}\` adında bir chess.com hesabı bulunamadı.`)
                            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                        interaction.reply({ embeds: [invalidAccount] });
                    });
                break;

            default:
                break;
        }
    }
}