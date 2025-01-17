module.exports = { getresults };

const { default: axios } = require('axios');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { discord_token, announcementChannelID, dbConnectionString, mongoDB, mongoCol, tournamentPermRoleID } = require('../config.json');
const MongoClient = require("mongodb").MongoClient;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(discord_token);

//sonucunu istediğimiz turnuvanın id'sini parametre olarak alıyoruz.
function getresults(link) {

  if (link?.split('/')[3] == 'tournament') {
    //axios ile lichess api'ına erişerek turnuva sonuçlarını içeren bir nd-json objesi alıyoruz.
    axios.get('https://lichess.org/api/tournament/' + link.split('/')[4] + '/results')
      .then(function (response) {

        //nd-json objesini, üzerinde işlem yapabilmemizin kolaylaşması için json dizisine çeviriyoruz.
        var json = "[" + response.data.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
        var jsondata = JSON.parse(json);

        (async function () {

          /*turnuvada ilk üçe giren lichess hesaplarının id'lerini kendi veri tabanımızda aratarak herhangi bir discord hesabına bağlı olup
          olmadıklarını inceliyoruz. Bu kontroller sonucunda da duyuru yapılırken lichess veya discord hesabı olarak duyurulmalarına
          karar veriyoruz.*/
          checkFirst = false;
          try {
            const client = new MongoClient(dbConnectionString);
            var result1 = await client.db(mongoDB).collection(mongoCol).findOne({ lichessID: jsondata[0].username.toLowerCase() });
            if (result1 != null) {
              checkFirst = true;
              if (result1?.tournamentPoints == null) {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[0].username.toLowerCase() }, { $set: { tournamentPoints: 3 } });
              }
              else {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[0].username.toLowerCase() }, { $set: { tournamentPoints: result1.tournamentPoints + 3 } });
              }
            }
            else {
              checkFirst = false;
            }
            await client.close();
          }
          finally { }

          checkSecond = false;
          try {
            const client = new MongoClient(dbConnectionString);
            var result2 = await client.db(mongoDB).collection(mongoCol).findOne({ lichessID: jsondata[1].username.toLowerCase() });
            if (result2 != null) {
              checkSecond = true;
              if (result2?.tournamentPoints === null) {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[1].username.toLowerCase() }, { $set: { tournamentPoints: 2 } });
              }
              else {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[1].username.toLowerCase() }, { $set: { tournamentPoints: result2.tournamentPoints + 2 } });
              }
            }
            else {
              checkSecond = false;
            }
            await client.close();
          }
          finally { }

          checkThird = false;
          try {
            const client = new MongoClient(dbConnectionString);
            var result3 = await client.db(mongoDB).collection(mongoCol).findOne({ lichessID: jsondata[2].username.toLowerCase() });
            if (result3 != null) {
              checkThird = true;
              if (result3?.tournamentPoints == null) {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[2].username.toLowerCase() }, { $set: { tournamentPoints: 1 } });
              }
              else {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[2].username.toLowerCase() }, { $set: { tournamentPoints: result3.tournamentPoints + 1 } });
              }
            }
            else {
              checkThird = false;
            }
            await client.close();
          }
          finally { }

          //sonuçların olduğu mesaj oluşturuluyor
          const resultsEmbed = new EmbedBuilder()
            .setColor(0xf9d505)
            .setTitle('🎉 Turnuvamız bitti! Katılan herkese teşekkür ederiz. 🎉')
            .setURL('https://lichess.org/tournament/' + link.split('/')[4])
            .setDescription(`**🏆Kazananlar🏆**`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png')
            .addFields(
              { name: `🥇Birinci`, value: (checkFirst ? '<@' + result1.discordID + `> - ${jsondata[0].username}` : 'https://lichess.org/@/' + jsondata[0].username) }
            )
            .addFields(
              { name: `🥈İkinci`, value: (checkSecond ? '<@' + result2.discordID + `> - ${jsondata[1].username}` : 'https://lichess.org/@/' + jsondata[1].username) }
            )
            .addFields(
              { name: `🥉Üçüncü`, value: (checkThird ? '<@' + result3.discordID + `> - ${jsondata[2].username}` : 'https://lichess.org/@/' + jsondata[2].username) }
            )
            .addFields(
              { name: `Turnuva Linki`, value: 'https://lichess.org/tournament/' + link.split('/')[4] }
            )

          client.channels.cache.get(announcementChannelID).send({ embeds: [resultsEmbed] });

        })();
      })
      .catch(function (error) {
        client.channels.cache.get(announcementChannelID).send(`<@${tournamentPermRoleID}> sonuçlar atılamadı, manuel atın.`);
      });
  } else if (link?.split('/')[3] == 'swiss') {

    //axios ile lichess api'ına erişerek turnuva sonuçlarını içeren bir nd-json objesi alıyoruz.
    axios.get('https://lichess.org/api/swiss/' + link.split('/')[4] + '/results')
      .then(function (response) {

        //nd-json objesini, üzerinde işlem yapabilmemizin kolaylaşması için json dizisine çeviriyoruz.
        var json = "[" + response.data.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
        var jsondata = JSON.parse(json);

        (async function () {

          /*turnuvada ilk üçe giren lichess hesaplarının id'lerini kendi veri tabanımızda aratarak herhangi bir discord hesabına bağlı olup
          olmadıklarını inceliyoruz. Bu kontroller sonucunda da duyuru yapılırken lichess veya discord hesabı olarak duyurulmalarına
          karar veriyoruz.*/
          checkFirst = false;
          try {
            const client = new MongoClient(dbConnectionString);
            var result1 = await client.db(mongoDB).collection(mongoCol).findOne({ lichessID: jsondata[0].username.toLowerCase() });
            if (result1 != null) {
              checkFirst = true;
              if (result1?.tournamentPoints == null) {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[0].username.toLowerCase() }, { $set: { tournamentPoints: 3 } });
              }
              else {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[0].username.toLowerCase() }, { $set: { tournamentPoints: result1.tournamentPoints + 3 } });
              }
            }
            else {
              checkFirst = false;
            }
            await client.close();
          }
          finally { }

          checkSecond = false;
          try {
            const client = new MongoClient(dbConnectionString);
            var result2 = await client.db(mongoDB).collection(mongoCol).findOne({ lichessID: jsondata[1].username.toLowerCase() });
            if (result2 != null) {
              checkSecond = true;
              if (result2?.tournamentPoints === null) {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[1].username.toLowerCase() }, { $set: { tournamentPoints: 2 } });
              }
              else {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[1].username.toLowerCase() }, { $set: { tournamentPoints: result2.tournamentPoints + 2 } });
              }
            }
            else {
              checkSecond = false;
            }
            await client.close();
          }
          finally { }

          checkThird = false;
          try {
            const client = new MongoClient(dbConnectionString);
            var result3 = await client.db(mongoDB).collection(mongoCol).findOne({ lichessID: jsondata[2].username.toLowerCase() });
            if (result3 != null) {
              checkThird = true;
              if (result3?.tournamentPoints == null) {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[2].username.toLowerCase() }, { $set: { tournamentPoints: 1 } });
              }
              else {
                const addon = await client.db(mongoDB).collection(mongoCol)
                  .updateOne({ lichessID: jsondata[2].username.toLowerCase() }, { $set: { tournamentPoints: result3.tournamentPoints + 1 } });
              }
            }
            else {
              checkThird = false;
            }
            await client.close();
          }
          finally { }

          //sonuçların olduğu mesaj oluşturuluyor
          const resultsEmbed = new EmbedBuilder()
            .setColor(0xf9d505)
            .setTitle('🎉 Turnuvamız bitti! Katılan herkese teşekkür ederiz. 🎉')
            .setURL('https://lichess.org/swiss/' + link.split('/')[4])
            .setDescription(`**🏆Kazananlar🏆**`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1065015635299537028/1066379362414379100/Satranc101Logo_1.png')
            .addFields(
              { name: `🥇Birinci`, value: (checkFirst ? '<@' + result1.discordID + `> - ${jsondata[0].username}` : 'https://lichess.org/@/' + jsondata[0].username) }
            )
            .addFields(
              { name: `🥈İkinci`, value: (checkSecond ? '<@' + result2.discordID + `> - ${jsondata[1].username}` : 'https://lichess.org/@/' + jsondata[1].username) }
            )
            .addFields(
              { name: `🥉Üçüncü`, value: (checkThird ? '<@' + result3.discordID + `> - ${jsondata[2].username}` : 'https://lichess.org/@/' + jsondata[2].username) }
            )
            .addFields(
              { name: `Turnuva Linki`, value: 'https://lichess.org/swiss/' + link.split('/')[4] }
            )

          client.channels.cache.get(announcementChannelID).send({ embeds: [resultsEmbed] });

        })();
      })
      .catch(function (error) {
        client.channels.cache.get(announcementChannelID).send(`<@${tournamentPermRoleID}> sonuçlar atılamadı, manuel atın.`);
      });
  } else {

  }
}