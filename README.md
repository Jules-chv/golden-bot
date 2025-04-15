# Golden School - Bot Sonnerie 🔔

Ce bot Discord est conçu pour gérer les sonneries d'un collège RP appelé Golden School. Il fonctionne avec des sonneries automatiques et des alarmes manuelles via des commandes slash.

## ✅ Fonctionnalités

- Sonne toutes les 30 minutes de 14h00 à 18h00
- Se connecte uniquement dans les salons avec des membres présents
- Commande `/alarme` pour lancer une alarme ponctuelle
- Hébergement compatible avec Render + Cron-Job.org
- Protection du token avec `.env` (non publié)

## 🚀 Installation

1. Clone ou télécharge ce projet
2. Installe les dépendances :
   ```
   npm install
   ```
3. Crée un fichier `.env` (non inclus dans le projet) :
   ```
   TOKEN=ton_token_discord
   ```
4. Personnalise `config.json` avec les salons/catégories ciblés
5. Lance le bot :
   ```
   npm start
   ```

## ☁️ Déploiement Render

- Configure le fichier `render.yaml`
- Ajoute la variable d’environnement `TOKEN` sur Render

## ⚠️ Ne publie jamais ton fichier `.env` sur GitHub !