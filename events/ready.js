const { ActivityType } = require('discord.js');
const { PuzzleSystem } = require('../systems/puzzleSystem/puzzleSystem');
const { puzzleChannelId } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        console.log(`Logged as ${client.user.tag}`);

        // schedule puzzle
        var puzzleSystem = PuzzleSystem.start(client, puzzleChannelId);
		puzzleSystem.schedule();
        //puzzleSystem.startRandomPuzzle();
        

        // rpc (rich presence status)
        client.user.setPresence({ activities: [{ name: 'başlatılıyor...', type: ActivityType.Watching }], status: 'online' });

        setInterval(() => {
            const options = [
                {
                    type: ActivityType.Playing,
                    text: 'satranç',
                    status: 'online'
                },
                {
                    type: ActivityType.Watching,
                    text: 'kka satranç',
                    status: 'online'
                },
                {
                    type: ActivityType.Competing,
                    text: 'Satranç101',
                    status: 'online'
                },
                {
                    type: ActivityType.Listening,
                    text: 'komutları',
                    status: 'online'
                }
            ]
            const index = Math.floor(Math.random() * (options.length));
            client.user.setPresence({
                activities: [{
                    name: options[index].text,
                    type: options[index].type
                }],
                status: options[index].status
            });
        }, 10 * 1000);


    }
}