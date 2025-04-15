require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { jouerSonnerie } = require('./utils/sonnerie');
const cron = require('node-cron');

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

client.once('ready', async () => {
  console.log(`🟢 Connecté en tant que ${client.user.tag}`);

  const guildId = '1267913236221792367';

  const data = [
    {
      name: 'alarme',
      description: 'Déclencher une alarme dans les salles vocales',
      options: [
        {
          name: 'type',
          description: 'Type d\'alarme à déclencher',
          type: 3,
          required: true,
          choices: [
            { name: 'Incendie', value: 'incendie' },
            { name: 'Intrusion', value: 'intrusion' },
            { name: 'Tsunami', value: 'tsunami' },
            { name: 'Nucléaire', value: 'nucleaire' }
          ]
        }
      ]
    },
    {
      name: 'sonnerie',
      description: 'Déclenche manuellement la sonnerie (réservé)',
      default_member_permissions: '0'
    }
  ];

  try {
    await client.guilds.cache.get(guildId).commands.set(data);
    console.log('Commandes enregistrées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des commandes :', error);
  }

  cron.schedule('0,30 14-17,18 * * *', () => jouerSonnerie(client));

  cron.schedule('45 13 * * 6,0', () => {
    const config = require('./config.json');
    const salon = client.channels.cache.get(config.salonRappel);
    if (salon && salon.isTextBased()) {
      salon.send('📣 Il y a cours à 14h00 ! Préparez-vous à rejoindre votre salle.');
    }
  });
});

client.on('interactionCreate', async interaction => {
  if (interaction.isStringSelectMenu() && interaction.customId === 'choix_alarme') {
    const alarme = interaction.values[0];
    await interaction.update({ content: `🚨 Alarme **${alarme}** déclenchée !`, components: [], embeds: [] });
    const { jouerAlarme } = require('./utils/sonnerie');
    await jouerAlarme(client, alarme);
  }
});


client.login(process.env.TOKEN);
