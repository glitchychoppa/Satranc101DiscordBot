const { SlashCommandBuilder } = require("discord.js");
const { lichess_token, tournamentPermRoleID, lichessTeamID } = require("../config.json");
const axios = require("axios");
const schedule = require('node-schedule');
const ann = require('../functions/announcement');
const GetResults = require('../functions/getresults');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("turnuvakur")
    .setDescription("Turnuva kurar.")

    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          "Turnuva adı."
        )
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("clocktime")
        .setDescription("Başlangiç süresi.")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("clockincrement")
        .setDescription("Hamle başina artiş.")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("minutes")
        .setDescription("Turnuva süresi.")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("waitminutes")
        .setDescription(
          "Turnuvaya kalan dakikalar.")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("startdate")
        .setDescription(
          "MM/DD/YYYY hh:mm:ss"
        )
    )

    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription(
          "Açiklama"
        )
    ),

  execute(interaction, client) {

    //Kullanıcının yetkisi, gerekli rol ile kontrol ediliyor.
    if (interaction.member.roles.cache.has(tournamentPermRoleID)) {
      var informationMessage;

      //API'a gönderilecek parametreler ekleniyor.
      const params = new URLSearchParams();
      params.append("conditions.teamMember.teamId", lichessTeamID); //Turnuvanın hangi takımda yapılacağı giriliyor.
      params.append("name", interaction.options.getString("name")); //Turnuvanın adı giriliyor.
      params.append("clockTime", interaction.options.getString("clocktime")); //Maçların tempoları (sayaç) giriliyor.
      params.append("clockIncrement", interaction.options.getString("clockincrement")); //Hamle başına süre artışı giriliyor.
      params.append("minutes", interaction.options.getString("minutes")); //Turnuvanın toplam süresi giriliyor.
      params.append('conditions.nbRatedGame.nb', 5); //Turnuvaya katılmak için gereken minimum puanlı oyun giriliyor.

      //startDate veya waitMinutes yöntemi seçiliyor.
      if (interaction.options.getString("startdate") == null) {
        params.append("waitMinutes", interaction.options.getString("waitminutes"));

      } else {

        var myDate = interaction.options.getString("startdate");
        //Sunucunun yerel saati utc olduğu için türkiye saatine göre girilebilmesi adına 3 saat çıkarıyoruz.
        var datum = (Date.parse(myDate) - (1000 * 60 * 60 * 3));
        params.append("startDate", datum);
      }

      params.append("rated", false); //Sunucu içi turnuvalar puansız olarak ayarlanıyor.

      //Açıklama kısmı yazılıyor.
      const descStr = '[Discord Sunucumuz](https://discord.gg/jkr529f4mE)\n[Instagram Sayfamız](https://www.instagram.com/satranc.101)\n';
      params.append("description",
        interaction.options.getString("description") != null ? descStr + interaction.options.getString("description") : descStr);

      //API'a post isteği gönderiliyor ve yanıt ile bilgilendirme mesajı hazırlanıyor.
      axios.post("https://lichess.org/api/tournament", params, { headers: { Authorization: "Bearer " + lichess_token } })
        .then(function (response) {
          informationMessage =
            "Turnuva Kuruldu!\nTurnuva Adı: " +
            response.data.fullName +
            "\nBağlantı: https://lichess.org/tournament/" +
            response.data.id +
            "\nBaşlangıç: " +
            new Date(Date.parse(response.data.startsAt)).toLocaleString('tr-TR') +
            "\nSüre: " +
            response.data.minutes +
            "\nTempo: " +
            response.data.clock.limit / 60 +
            "+" +
            response.data.clock.increment;

          interaction.reply(informationMessage);

          if (response.data.secondsToStart <= (30 * 60)) {
            ann.announceTourney(response.data.id);
          } else {
            // date1 = duyuru tarihi
            const date1 = new Date(Date.parse(response.data.startsAt));
            date1.setSeconds(date1.getSeconds() - (30 * 60));
            console.log(`announcement date: ${date1}`)
            const job1 = schedule.scheduleJob(date1, function () {
              ann.announceTourney(response.data.id);
            });
          }

          // date2 = sonuçların açıklanma tarihi
          const date2 = new Date(Date.parse(response.data.startsAt));
          date2.setMinutes(date2.getMinutes() + response.data.minutes + 1);

          console.log(`min: ${response.data.minutes}`);
          console.log(`result announcement date: ${date2}`)
          const job2 = schedule.scheduleJob(date2, function () {
            GetResults.getresults(response.data.id);
          });

        }).catch(function (e) {
          console.log(`Could not create tournament. Error: ${e}, Details:`);
          try {
            console.log(e.response.data);
          } catch (error) {
            interaction.reply("Turnuva oluşturulamadı. Lütfen daha sonra tekrar deneyin");
          }
        })
    } else {
      interaction.reply("Turnuva kurulamadı, gerekli yetkiye sahip değilsiniz");
    }
  },
};