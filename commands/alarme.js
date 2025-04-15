const { SlashCommandBuilder } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarme')
    .setDescription('Déclenche une alarme dans les salles vocales'),

  async execute(interaction, client) {
    await interaction.reply({
      content: '🚨 Alarme déclenchée !',
      flags: 64 // Message éphémère moderne (visible seulement par l'utilisateur)
    });

    try {
      await jouerSonnerie(client); // Déclenche la vraie alarme après avoir répondu
    } catch (error) {
      console.error(error);
    }
  }
};
