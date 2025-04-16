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

    const voiceChannels = guild.channels.cache.filter(channel =>
      channel.type === 2 && // GUILD_VOICE
      (categorieCible.includes(channel.parentId) || salonsSpecifiques.includes(channel.id)) &&
      channel.members.size > 0 // Au moins un membre
    );

    if (voiceChannels.size === 0) {
      return interaction.reply({
        content: '⚠️ Aucun salon vocal filtré avec des membres connectés.',
        ephemeral: true
      });
    }

    for (const channel of voiceChannels.values()) {
      try {
        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 5000);
        console.log(`🔊 Connecté à ${channel.name}`);

        const player = createAudioPlayer();
        const audioPath = path.join(__dirname, '../audios/sonnerie.mp3');
        const resource = createAudioResource(audioPath);

        connection.subscribe(player);
        player.play(resource);

        player.once(AudioPlayerStatus.Idle, () => {
          console.log(`⏹️ Audio terminé dans ${channel.name}, déconnexion...`);
          connection.destroy();
        });

        player.on('error', error => {
          console.error(`❌ Erreur audio dans ${channel.name} :`, error);
          connection.destroy();
        });

      } catch (error) {
        console.error(`❌ Erreur dans ${channel.name} :`, error);
      }
    }

    await interaction.reply({
      content: `✅ Sonnerie lancée dans ${voiceChannels.size} salon(s) vocal(aux).`,
      ephemeral: true
    });
  }
};
