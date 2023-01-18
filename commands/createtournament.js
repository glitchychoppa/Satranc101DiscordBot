const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const {lichess_token} = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createtournament')
		.setDescription('creates a tournament')

        .addStringOption(option =>
            option.setName('name')
                .setDescription('The tournament name. Leave empty to get a random Grandmaster name')
                .setRequired(true))

        .addNumberOption(option => 
            option.setName('clockTime')
                .setDescription('Clock initial time in minutes')
                .setRequired(true))

        .addIntegerOption(option =>
            option.setName('clockIncrement')
                .setDescription('Clock increment in seconds')
                .setRequired(true))

        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('How long the tournament lasts, in minutes')
                .setRequired(true))

        .addIntegerOption(option =>
            option.setName('waitMinutes')
            .setDescription('How long to wait before starting the tournament, from now, in minutes'))

        .addIntegerOption(option =>
            option.setName('startDate')
            .setDescription('Timestamp (in milliseconds) to start the tournament at a given date and time. Overrides the waitMinutes setting'))

        .addStringOption(option =>
            option.setName('description')
            .setDescription('Anything you want to tell players about the tournament')),

	async execute(interaction) {

        const params = new URLSearchParams();

        params.append('teambBattleByTeam','taskn-satranc');
        params.append('name',interaction.options.getString('name'));
        params.append('clockTime',interaction.options.getString('clockTime'));
        params.append('clockIncrement',interaction.options.getString('clockIncrement'));
        params.append('minutes',interaction.options.getString('minutes'));
        params.append('description', interaction.options.getString('description'));

        axios.post("https://lichess.org/api/tournament", params, {headers: {Authorization: 'Bearer ' + lichess_token}});

		await interaction.reply('Tournament Created : ' + interaction.options.getString('name'));
	},
};