const { SlashCommandBuilder } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarme')
    .setDescription('Déclenche une alarme dans les salles vocales'),

  async execute(interaction, client) {
    try {
      // Réponse initiale
      await interaction.reply({
        content: '🚨 Alarme déclenchée !',
        ephemeral: true, // Message visible uniquement pour l'utilisateur
      });

      // Appel de la fonction de sonnerie
      await jouerSonnerie(client);
    } catch (error) {
      console.error("Erreur lors de l'exécution de /alarme : ", error);
      await interaction.reply({ content: 'Une erreur s\'est produite.', ephemeral: true });
    }
  }
};
