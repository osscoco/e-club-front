#!/bin/bash

# Sortie sur erreur
set -e

echo "📦 Installation des dépendances..."
npm install

echo "🧩 Création du fichier environment.production.ts..."
cat <<EOF > src/environments/environment.production.ts
export const environment = {
  production: ${production:-true},
  apiUrl: '${apiUrl}',
  debug: ${debug:-false}
};
EOF

echo "🛠️ Copie dans environment.ts..."
cp src/environments/environment.production.ts src/environments/environment.ts

echo "🏗️ Build de l'application Angular (production)..."
npm run build:production

echo "🚀 Post-build : ajout du fichier _redirects..."
npm run postbuild

echo "✅ Déploiement production terminé"