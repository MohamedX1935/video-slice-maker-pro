
# SliceTube Backend Setup

This file contains instructions for setting up the backend server for SliceTube that handles video downloading and cutting.

## Prerequisites

You need to have the following installed on your system:
- Node.js (v14+)
- `yt-dlp` command line tool
- `ffmpeg` command line tool
- npm or yarn

## Installation

1. **Install backend dependencies:**
```bash
npm install express cors uuid
```

2. **Ensure yt-dlp is installed:**
```bash
# On macOS
brew install yt-dlp

# On Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

3. **Ensure ffmpeg is installed:**
```bash
# On macOS
brew install ffmpeg

# On Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg
```

## Running the Server

1. Copy the `src/api/clip.js` file to a directory where you want to run the server
2. Start the server:
```bash
node clip.js
```

The server will start on port 3001 by default (or the port specified in the PORT environment variable).

## Connecting the Frontend

Update the VideoPlayer component to use the real API instead of the YouTube fallback:

```tsx
// In VideoPlayer.tsx
const handleDownload = async () => {
  setIsProcessing(true);
  toast.info("Préparation de l'extrait vidéo...");
  
  try {
    const response = await fetch('http://localhost:3001/api/clip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        startTime: clipStart,
        endTime: clipEnd
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors du téléchargement: ${response.status}`);
    }
    
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slicetube-${videoId}-${Math.floor(clipStart)}-${Math.floor(clipEnd)}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Téléchargement terminé avec succès!");
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    toast.error(`Échec du téléchargement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  } finally {
    setIsProcessing(false);
  }
};
```

This will connect your frontend to the Node.js backend server for video processing.
