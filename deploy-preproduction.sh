#!/bin/bash

# Sortie sur erreur
set -e

echo "📦 Installation des dépendances..."
npm install

echo "🧩 Création du fichier environment.preproduction.ts..."
cat <<EOF > src/environments/environment.preproduction.ts
export const environment = {
  production: ${production:-false},
  apiUrl: '${apiUrl}',
  debug: ${debug:-false}
};
EOF

echo "🛠️ Copie dans environment.ts..."
cp src/environments/environment.preproduction.ts src/environments/environment.ts

echo "🏗️ Build de l'application Angular (preproduction)..."
npm run build:preproduction

echo "🚀 Post-build : ajout du fichier _redirects..."
npm run postbuild

echo "✅ Déploiement preproduction terminé"