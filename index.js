require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { jouerSonnerie } = require('./utils/sonnerie', 'sonnerie');
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

  const guildId = '1361103770221674556';

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
  const salon = client.channels.cache.get(config.salonRappelId);
  if (salon && salon.isTextBased()) {
    salon.send('📢 **Rappel : les cours commencent à 14h00 !** Soyez à l’heure dans vos salles !');
  }
});

  cron.schedule('45 13 * * 6,0', () => {
    const config = require('./config.json');
    const salon = client.channels.cache.get(config.salonRappel);
    if (salon && salon.isTextBased()) {
      salon.send('📣 Il y a cours à 14h00 ! Préparez-vous à rejoindre votre salle.');
    }
  });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ Une erreur est survenue lors de l’exécution de la commande.', ephemeral: true });
  }
});



client.login(process.env.TOKEN);
