const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test de réponse de commande slash'),

  async execute(interaction) {
    await interaction.reply({ content: "✅ Je fonctionne bien !", ephemeral: true });
  }
};
