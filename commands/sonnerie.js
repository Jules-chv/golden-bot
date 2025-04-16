const { SlashCommandBuilder } = require('discord.js');
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus
} = require('@discordjs/voice');
const path = require('path');
const { guildId, categorieCible, salonsSpecifiques } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sonnerie')
    .setDescription('Déclenche la sonnerie dans les salons vocaux filtrés'),

  async execute(interaction) {
    const guild = interaction.client.guilds.cache.get(guildId);

    // Filtrer les salons vocaux dans les catégories cibles ou spécifiques
    const voiceChannels = guild.channels.cache.filter(channel =>
      channel.type === 2 && // GUILD_VOICE
      (categorieCible.includes(channel.parentId) || salonsSpecifiques.includes(channel.id)) &&
      channel.members.size > 0 // au moins une personne
    );

    for (const channel of voiceChannels.values()) {
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

        player.on('error', (error) => {
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
