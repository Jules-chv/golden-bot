const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const { jouerSonnerie } = require('../utils/sonnerie');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarme')
    .setDescription('Déclenche une alarme dans les salles vocales'),

  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('selection_alarme')
      .setPlaceholder('Choisis une alarme')
      .addOptions([
        { label: 'Incendie 🔥', value: 'incendie' },
        { label: 'Intrusion 🚨', value: 'intrusion' },
        { label: 'Tsunami 🌊', value: 'tsunami' },
        { label: 'Nucléaire ☢️', value: 'nucleaire' },
        { label: 'Sonnerie normale 🔔', value: 'sonnerie' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: '🛑 Choisis une alarme à déclencher :',
      components: [row],
      flags: 64 // équivalent à "ephemeral: true"
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 15000,
      max: 1
    });

    collector.on('collect', async (selectInteraction) => {
      if (selectInteraction.user.id !== interaction.user.id) {
        return selectInteraction.reply({ content: "❌ Tu n'es pas autorisé à faire ça.", ephemeral: true });
      }

      const type = selectInteraction.values[0];
      await selectInteraction.update({
        content: `✅ Alarme **${type}** déclenchée.`,
        components: []
      });

      await jouerSonnerie(interaction.client, type === 'sonnerie' ? null : type);
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: '⏳ Aucun choix effectué.', components: [] });
      }
    });
  }
};
