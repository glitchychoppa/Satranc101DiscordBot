const { SlashCommandBuilder } = require('discord.js');
const { announceTourney } = require('../functions/announcement');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manuelduyuru')
        .setDescription('Manuel duyuru.')
        .addStringOption(option => option
            .setName('link')
            .setDescription('Turnuvanın linki.')),
    async execute(interaction, client) {
        announceTourney(interaction.options.getString('link'));
        interaction.reply({
            content:'Komut Çalıştırıldı',
            ephemeral: true
        });
    }
}