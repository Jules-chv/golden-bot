const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const { guildId, categorieCible, salonsSpecifiques } = require('../config.json');

async function jouerSonnerie(client, type = null) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return console.error("Serveur introuvable");

  const voiceChannels = guild.channels.cache.filter(channel =>
    (categorieCible.includes(channel.parentId) || salonsSpecifiques.includes(channel.id)) &&
    channel.type === 2 && // 2 = GUILD_VOICE
    channel.members.size > 0
  );

  const fileName = type ? `alarme_${type}.mp3` : 'sonnerie.mp3';
  const audioPath = path.join(__dirname, '../audios', fileName);

  if (!fs.existsSync(audioPath)) {
    console.error(`Fichier audio manquant : ${audioPath}`);
    return;
  }

  for (const channel of voiceChannels.values()) {
    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      connection.on(VoiceConnectionStatus.Ready, () => {
        const player = createAudioPlayer();
        const resource = createAudioResource(audioPath);
        player.play(resource);
        connection.subscribe(player);

        // Déconnexion après lecture (env. 10 sec)
        setTimeout(() => connection.destroy(), 10000);
      });
    } catch (error) {
      console.error(`Erreur avec le salon vocal ${channel.name} : `, error);
    }
  }
}

module.exports = { jouerSonnerie };
