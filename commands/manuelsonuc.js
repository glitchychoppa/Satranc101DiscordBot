const { SlashCommandBuilder } = require('discord.js');
const { getresults } = require('../functions/getresults');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manuelsonuc')
        .setDescription('Manuel duyuru.')
        .addStringOption(option => option
            .setName('link')
            .setDescription('Turnuvanın linki.')),
    async execute(interaction, client) {
        getresults(interaction.options.getString('link'));
        interaction.reply({
            content:'Komut Çalıştırıldı',
            ephemeral: true
        });
    }
}