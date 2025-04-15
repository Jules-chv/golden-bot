const { guildId, categorieCible, salonsSpecifiques } = require('../config.json');
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, VoiceConnectionStatus, joinVoiceChannel } = require('@discordjs/voice');

async function jouerAudioDansSalons(client) {
  const guild = client.guilds.cache.get(guildId);  // Récupère le serveur
  const categoryChannels = guild.channels.cache.filter(channel => 
    (categorieCible.includes(channel.parentId) || salonsSpecifiques.includes(channel.id)) && channel.type === 'GUILD_VOICE'
  );

  // Récupérer tous les salons vocaux dans les catégories cibles ou salons spécifiques
  categoryChannels.forEach(async (channel) => {
    if (channel.type === 'GUILD_VOICE') {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      // Assure-toi de jouer l'audio ou de faire une action ici
      connection.on(VoiceConnectionStatus.Ready, () => {
        const player = createAudioPlayer();
        const resource = createAudioResource('chemin_vers_audio.mp3'); // Remplace par le chemin de ton audio

        player.play(resource);
        connection.subscribe(player);
      });

      // Envoi un message de confirmation (facultatif)
      console.log(`🔔 La sonnerie a été jouée dans le salon : ${channel.name}`);
    }
  });
}

module.exports = { jouerAudioDansSalons };
