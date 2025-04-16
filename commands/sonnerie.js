const { SlashCommandBuilder } = require('discord.js');
const {
  guildId,
  categorieCible,
  salonsSpecifiques
} = require('../config.json');
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus
} = require('@discordjs/voice');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sonnerie')
    .setDescription('Déclenche manuellement la sonnerie dans les salons vocaux'),

  async execute(interaction) {
    const guild = interaction.client.guilds.cache.get(guildId);

    const voiceChannels = guild.channels.cache.filter(channel =>
      (categorieCible.includes(channel.parentId) || salonsSpecifiques.includes(channel.id)) &&
      channel.type === 2 // GUILD_VOICE
    );

    for (const channel of voiceChannels.values()) {
      if (channel.members.size === 0) continue;

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 5000);
        console.log(`🔊 Connecté à ${channel.name}`);

        const player = createAudioPlayer();
        const audioPath = path.join(__dirname, '../audios/sonnerie.mp3');
        const resource = createAudioResource(audioPath);

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
          console.log(`▶️ Lecture en cours dans ${channel.name}`);
        });

        player.on(AudioPlayerStatus.Idle, () => {
          console.log(`⏹️ Audio terminé dans ${channel.name}, déconnexion...`);
          connection.destroy();
        });

        player.on('error', error => {
          console.error(`❌ Erreur audio dans ${channel.name} :`, error);
          connection.destroy();
        });
      } catch (error) {
        console.error(`❌ Erreur dans ${channel.name} :`, error);
        connection.destroy();
      }
    }

    await interaction.reply({
      content: '✅ Sonnerie lancée dans les salons vocaux.',
      ephemeral: true
    });
  }
};
