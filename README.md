## 🚀 EClub

Gestion de clubs de tennis dans l'univers du sport

![Licence](https://img.shields.io/badge/Licence-MIT-blue.svg)  
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)  
![Statut](https://img.shields.io/badge/Statut-En%20d%C3%A9veloppement-orange)

## 🧰 Technologies utilisées (Local)

![FrontEnd](https://img.shields.io/badge/Frontend-Angular%20v19-green)
![DaisyUI](https://img.shields.io/badge/CSS-DaisyUI%20v5-green)

## 🧰 Technologies utilisées (Préproduction OnRender)

![FrontEnd](https://img.shields.io/badge/Frontend-Angular%20v19-green)
![DaisyUI](https://img.shields.io/badge/CSS-DaisyUI%20v5-green)

## 📸 Logo

![screenshot](./src/assets/images/logo.png)

## 🔶 Cheat Sheet - Git

#### 🔷 Repos Distant ➡️ Repos Local

```bash
# Clonage du dépôt
git clone https://github.com/nom-utilisateur/nom-projet.git

# Accès au dossier
cd nom-projet

# Création d'une sous branche de la branche "master"
git checkout -b sous-branche-de-master master
```

#### 🔷 Repos Local ➡️ Repos Distant

```bash
# Accès au dossier local fraichement créé
cd nom-projet

# Initialisation du dépôt
git init

# Signature sur le nom du repos local
git config --global user.name "votre prénom et votre nom"

# Affichage du nom de la signature du repos local
git config user.name

# Signature sur le mail du repos local
git config --global user.email "votre email"

# Affichage de l'email de la signature du repos local
git config user.email

# Liaison du repos local vers un repos distant fraichement initialisé
git remote add origin "https://github.com/nom-utilisateur/nom-projet.git"
```

#### 🔷 Suite logique

```bash
# Ajout/Modification/Suppression des fichiers sources 
...

# Affichage des fichiers modifiés 
git status

# Ajout de tous les fichiers modifiés dans la pile temporaire
git add .

# Ajout d'un fichier modifié "file" dans la pile temporaire
git add ./file

# Liaison du message "message" à la pile temporaire
git commit -m "message"

# Envoi de la pile temporaire du repos local vers le repos distant
git push -u origin sous-branche-de-master

# Interface Git (Attente de l'envoi de la pile temporaire vers la branche supérieur "master")
...

# Récupération de la mise à jour de la branche "master"
git checkout master
git pull origin master
```

## 📦 Installation

#### 🔷 Git

- Installation de Git Bash : https://git-scm.com/

#### 🔷 Projet

- Installer Node.js : https://nodejs.org/

```bash
# Installation globale d'Angular CLI
npm install -g @angular/cli

## Vérification de l'installation d'Angular CLI
ng version
```

- Téléchargement de l'IDE Visual Studio Code : https://code.visualstudio.com/

```bash
# Vérification de l'installation de Node.js
node -v
npm -v
```

```bash
# Clone du dépôt
git clone https://github.com/osscoco/rap-connect-front.git
```

```bash
# Installation des dépendances
npm install
```

## 🟩 Variables d'environnements

- Dans le dossier "src/environments/"

```bash
# Accès au dossier
cd ./environments
```

```bash
# Création de ./environments/environment.local.ts
touch environment.local.ts
```

_Contenu de 'environment.local.ts'_

```bash
export const environment = {
    production: false,
    apiUrl: 'https://localhost:5123',
    debug: true
};
```

```bash
# Création de ./environments/environment.preproduction.ts
touch environment.preproduction.ts
```

_Contenu de 'environment.preproduction.ts'_

```bash
export const environment = {
    production: true,
    apiUrl: 'https://rap-connect-back.onrender.com',
    debug: false
};
```

```bash
# Création de ./environments/environment.production.ts
touch environment.production.ts
```

_Contenu de 'environment.production.ts'_

```bash
export const environment = {
    production: true,
    apiUrl: 'https://api-prod.example.com',
    debug: false
};
```

## ⚫ Lancement de l'application web

#### 🔷 Local
```bash
npm run start:local
```
#### 🔷 Préproduction
- Se rendre sur [OnRender](https://onrender.com/)
    - Se connecter
    - Créer un nouveau projet (Static Site) :
        - Linker au repository https://github.com/osscoco/rap-connect-front
        - Name : rap-connect-front
        - Branch Git : master
        - Build Command : $ bash deploy-preproduction.sh
        - Publish Directory : dist/rapconnect/browser
        - Auto-Deploy : On Commit
        - Pr Previews : Off
        - Service Notifications : Use workspace default (Only failure notifications)
        - Preview Environment Notifications : Use account default (Disabled)
        - Environment Variables : 
            - apiUrl : https://rap-connect-back.onrender.com
            - production : true
            - debug : false
        - Redirects/Rewrites : 
            - Source : /*
            - Destination : /index.html
            - Action : Rewrite