const { SlashCommandBuilder } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sonnerie')
    .setDescription('Déclenche manuellement la sonnerie dans les salles vocales'),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.sonnerieRoleId)) {
      return interaction.reply({ content: '❌ Tu n’as pas la permission d’utiliser cette commande.', ephemeral: true });
    }

    await interaction.reply({ content: '🔔 Sonnerie déclenchée !', ephemeral: true });
    await jouerSonnerie(interaction.client);
  }
};
