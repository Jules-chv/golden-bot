const { SlashCommandBuilder } = require('discord.js');
const { guildId, categorieCible, salonsSpecifiques } = require('../config.json');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sonnerie')
    .setDescription('Déclenche manuellement la sonnerie dans les salons vocaux'),

  async execute(interaction) {
    const guild = interaction.client.guilds.cache.get(guildId);

    const categoryChannels = guild.channels.cache.filter(channel =>
      (categorieCible.includes(channel.parentId) || salonsSpecifiques.includes(channel.id)) &&
      channel.type === 2 // Type 2 = GUILD_VOICE
    );

    for (const channel of categoryChannels.values()) {
      if (channel.members.size === 0) continue;

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator
      });

      connection.on(VoiceConnectionStatus.Ready, () => {
        const player = createAudioPlayer();
        const path = require('path');
        const audioPath = type
          ? path.join(__dirname, `../audios/alarme_${type}.mp3`)
          : path.join(__dirname, '../audios/sonnerie.mp3');

const resource = createAudioResource(audioPath);

        player.play(resource);
        connection.subscribe(player);
      });
    }

    await interaction.reply({ content: '✅ Sonnerie lancée dans les salons vocaux.', ephemeral: true });
  }
};
