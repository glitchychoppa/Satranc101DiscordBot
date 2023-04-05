const { SlashCommandBuilder } = require("discord.js");
const { ChessboardBuilder } = require("../utility/chessboardBuilder")
module.exports = {
    //discord api yardımıyla kullanıcıdan gerekli veriler alınıyor.
    data: new SlashCommandBuilder()
        .setName("fen")
        .setDescription("Generates chess board visual with given FEN string ")
        .addStringOption(option =>
            option.setName("fen")
                .setDescription("FEN string to generate the board with")),
    async execute(interaction, client) {

        try {
        //kullanıcıya iletmek için, ChessboardBuilder sınıfını kullanarak bir görsel oluşturuyoruz.
        let buffer = await ChessboardBuilder.create()
            .setFen(interaction.options.getString("fen"))
            .generateBuffer()

        //ürettiğimiz görseli kullanıcıya iletiyoruz.
        await interaction.reply({ files: [buffer] })
        } catch (error) {
            interaction.reply('Hatalı FEN formatı...');
        }
    }
}