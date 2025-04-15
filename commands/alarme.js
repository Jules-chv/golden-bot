const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { jouerAlarme } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarme')
    .setDescription('Déclenche une alarme dans les salles vocales'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Choix de l\'alarme')
      .setDescription('Sélectionne une alarme à déclencher dans toutes les salles vocales.')
      .setColor('Red');

    const menu = new StringSelectMenuBuilder()
      .setCustomId('choix_alarme')
      .setPlaceholder('Choisis une alarme')
      .addOptions([
        { label: 'Incendie', value: 'incendie', emoji: '🔥' },
        { label: 'Intrusion', value: 'intrusion', emoji: '🕵️‍♂️' },
        { label: 'Tsunami', value: 'tsunami', emoji: '🌊' },
        { label: 'Nucléaire', value: 'nucleaire', emoji: '☢️' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};
