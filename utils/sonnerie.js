const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');
const { guildId, categorieCible, salonsSpecifiques } = require('../config.json');

async function jouerSonnerie(client, type = null) {
  const guild = client.guilds.cache.get(guildId);

  const voiceChannels = guild.channels.cache.filter(channel =>
    (categorieCible.includes(channel.parentId) || salonsSpecifiques.includes(channel.id)) &&
    channel.type === 2 // GUILD_VOICE
  );

  for (const channel of voiceChannels.values()) {
    if (channel.members.size === 0) continue;

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 5000);
      console.log(`🔊 Connecté à ${channel.name}`);

      const player = createAudioPlayer();
      const audioPath = path.join(__dirname, '../audios', 'sonnerie.mp3');
      const resource = createAudioResource(audioPath);
      
      player.play(resource);
      connection.subscribe(player);

      // Log de l'état du player
      player.on('stateChange', (oldState, newState) => {
        console.log(`🎛️ Player: ${oldState.status} -> ${newState.status}`);
      });

      // Quand le player est idle (fin de lecture), on déconnecte
      player.on(AudioPlayerStatus.Idle, () => {
        console.log(`⏹️ Audio terminé dans ${channel.name}, déconnexion...`);
        connection.destroy(); // Déconnexion après la lecture de l'audio
      });

      // Gestion des erreurs du player
      player.on('error', (error) => {
        console.error(`❌ Erreur dans le salon ${channel.name}:`, error);
        connection.destroy();
      });

    } catch (error) {
      console.error(`❌ Erreur sur le salon ${channel.name} :`, error);
      connection.destroy();
    }
  }
}

module.exports = { jouerSonnerie };
