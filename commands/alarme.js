const { SlashCommandBuilder } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarme')
    .setDescription('Déclenche une alarme dans les salles vocales'),

  async execute(interaction) {
    try {
      await interaction.reply({
        content: '🚨 Alarme déclenchée !',
        ephemeral: true,
      });

      await jouerSonnerie(interaction.client);
    } catch (error) {
      console.error("Erreur lors de l'exécution de /alarme : ", error);

      // Utilise followUp si la réponse a déjà été envoyée
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: '❌ Une erreur s’est produite en déclenchant l’alarme.',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: '❌ Une erreur s’est produite en déclenchant l’alarme.',
          ephemeral: true,
        });
      }
    }
  }
};
