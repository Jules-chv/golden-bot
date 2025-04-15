const { SlashCommandBuilder } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarme')
    .setDescription('Déclenche une alarme dans les salles vocales')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type d\'alarme à déclencher')
        .setRequired(true)
        .addChoices(
          { name: 'Incendie', value: 'incendie' },
          { name: 'Intrusion', value: 'intrusion' },
          { name: 'Tsunami', value: 'tsunami' },
          { name: 'Nucléaire', value: 'nucleaire' },
        )
    ),

  async execute(interaction) {
    const type = interaction.options.getString('type');

    try {
      await interaction.reply({
        content: `🚨 Alarme **${type}** déclenchée !`,
        ephemeral: true,
      });

      await jouerSonnerie(interaction.client, type);
    } catch (error) {
      console.error("Erreur lors de l'exécution de /alarme : ", error);

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
