require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus } = require('@discordjs/voice');
const cron = require('node-cron');
const { jouerSonnerie } = require('./utils/sonnerie');

const app = express();
app.get('/', (req, res) => res.send('Bot actif !'));
app.listen(3000, () => console.log('Web server prêt pour Render'));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log(`🟢 Connecté en tant que ${client.user.tag}`);
  cron.schedule('0,30 14-17 * * *', () => jouerSonnerie(client));
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Erreur lors de l\'exécution.', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);