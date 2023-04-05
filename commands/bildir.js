const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

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

        axios.get(`https://lichess.org/game/export/${interaction.options.getString('id')}`, config)
            .then(response => {

                const kullaniciAdi = interaction.options.getString('taraf') == 'beyaz'
                    ? response.data.players.white.user.name : response.data.players.black.user.name;

                const embed = new EmbedBuilder()
                    .setColor(0x2cee1a)
                    .setTitle('Şikayetiniz Hakemlere İletildi')
                    .setURL(`https://lichess.org/${interaction.options.getString('id')}`)
                    .setFields(
                        { name: 'Kullanıcı', value: kullaniciAdi },
                        { name: 'Hesap Linki', value: 'https://lichess.org/@/' + response.data.players.white.user.id },
                        { name: 'Oyun Linki', value: 'https://lichess.org/' + interaction.options.getString('id') },
                    )
                    .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                const message = interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

            })
            .catch(error => {
                const invalidAccount = new EmbedBuilder()
                    .setColor(0xec0505)
                    .setTitle('Geçersiz ID')
                    .setDescription(`Geçersiz URL:\nhttps://lichess.org/${interaction.options.getString('id')}`)
                    .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png');

                interaction.reply({ 
                    embeds: [invalidAccount],
                    ephemeral: true
                });
            });
    }
}