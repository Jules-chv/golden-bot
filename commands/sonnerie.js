const { SlashCommandBuilder } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sonnerie')
    .setDescription('Déclenche la sonnerie dans les salles vocales'),

  async execute(interaction, client) {
    // On répond D'ABORD à Discord
    await interaction.reply({ content: '🔔 Sonnerie en cours !', ephemeral: true });

    // Puis on joue la sonnerie
    try {
      await jouerSonnerie(client);
    } catch (err) {
      console.error(err);
    }
  }
};
