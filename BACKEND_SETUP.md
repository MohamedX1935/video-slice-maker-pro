
# SliceTube Backend Setup

Ce fichier contient les instructions pour configurer le serveur backend de SliceTube qui gère le téléchargement et la découpe de vidéos.

## Prérequis

Vous devez avoir les outils suivants installés sur votre système :
- Node.js (v14+)
- `yt-dlp` outil en ligne de commande
- `ffmpeg` outil en ligne de commande
- npm ou yarn

## Installation

1. **Installer les dépendances backend :**
```bash
npm install express cors uuid fs-extra
```

2. **S'assurer que yt-dlp est installé :**
```bash
# Sur macOS
brew install yt-dlp

# Sur Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Sur Windows
# Téléchargez depuis https://github.com/yt-dlp/yt-dlp/releases et ajoutez-le à votre PATH
```

3. **S'assurer que ffmpeg est installé :**
```bash
# Sur macOS
brew install ffmpeg

# Sur Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# Sur Windows
# Téléchargez depuis https://ffmpeg.org/download.html et ajoutez-le à votre PATH
```

4. **Créer un dossier pour les fichiers temporaires :**
```bash
mkdir temp
```

5. **Ajouter le dossier temp/ au .gitignore :**
```bash
echo "temp/" >> .gitignore
```

## Démarrer le Serveur

1. Copiez le fichier `src/api/clip.js` dans un répertoire où vous souhaitez exécuter le serveur
2. Démarrez le serveur :
```bash
node clip.js
```

Le serveur démarrera sur le port 3001 par défaut (ou le port spécifié dans la variable d'environnement PORT).

## Connecter le Frontend

Le composant VideoPlayer de l'application React est déjà configuré pour :
1. Essayer de se connecter au backend à `http://localhost:3001/api/clip`
2. Utiliser un lien YouTube comme solution de secours si le backend n'est pas disponible

Si vous souhaitez utiliser un hôte ou un port différent pour votre backend, mettez à jour la variable `apiUrl` dans `src/components/VideoPlayer.tsx`.
