const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sonnerie')
    .setDescription('Déclenche la sonnerie dans les salles vocales'),

  async execute(interaction, client) {
    const member = interaction.member;
    const role = member.roles.cache.some(r => r.id === '1361681844093063360');

    if (!role) {
      return interaction.reply({
        content: "Tu n'as pas l'autorisation de déclencher la sonnerie.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: '🔔 Sonnerie déclenchée !',
      ephemeral: true,
    });

    try {
      await jouerSonnerie(client); // Assure-toi que cette fonction est bien définie et importée
    } catch (error) {
      console.error("Erreur lors de l'exécution de /sonnerie : ", error);
      await interaction.followUp({
        content: 'Une erreur s\'est produite.',
        ephemeral: true,
      });
    }
  },
};