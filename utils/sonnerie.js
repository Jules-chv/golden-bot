const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus } = require('@discordjs/voice');
const config = require('../config.json');
const path = require('path');

const getSalonsVocauxCibles = (client) => {
  const salons = [];
  client.guilds.cache.forEach(guild => {
    guild.channels.cache.forEach(channel => {
      if (
        (config.categorieCible.includes(channel.parentId) || config.salonsSpecifiques.includes(channel.id)) &&
        channel.type === 2 &&
        channel.members.size > 0
      ) {
        salons.push(channel);
      }
    });
  });
  return salons;
};

const jouerAudioDansSalons = async (client, fichierAudio) => {
  const salons = getSalonsVocauxCibles(client);

  for (const salon of salons) {
    const connection = joinVoiceChannel({
      channelId: salon.id,
      guildId: salon.guild.id,
      adapterCreator: salon.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(path.join(__dirname, '..', 'sounds', 'alarms', fichierAudio));
    connection.subscribe(player);
    player.play(resource);

    await entersState(player, AudioPlayerStatus.Playing, 5000);
    await new Promise(resolve => setTimeout(resolve, 5000));

    connection.destroy();
  }
};

const jouerSonnerie = async (client) => {
  await jouerAudioDansSalons(client, 'sonnerie.mp3');
};

const jouerAlarme = async (client, alarme) => {
  const fichier = `${alarme}.mp3`;
  await jouerAudioDansSalons(client, fichier);
};

module.exports = { jouerSonnerie, jouerAlarme };
