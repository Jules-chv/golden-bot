const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
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

      const player = createAudioPlayer();
      const fileName = 'sonnerie.mp3';
      const audioPath = path.join(__dirname, '../audios', fileName);

      const resource = createAudioResource(audioPath);
      player.play(resource);
      connection.subscribe(player);
    } catch (error) {
      console.error(`Erreur sur le salon ${channel.name} :`, error);
    }
  }
}

module.exports = { jouerSonnerie };
