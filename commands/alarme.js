const { SlashCommandBuilder } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarme')
    .setDescription('Déclencher une alarme dans toutes les salles'),
  
  async execute(interaction, client) {
    await interaction.reply('🚨 Alarme déclenchée !');
    jouerSonnerie(client);
  }
};