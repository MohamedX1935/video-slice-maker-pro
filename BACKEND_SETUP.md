
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

The VideoPlayer component in the React application is already configured to:
1. Try to connect to the backend at `http://localhost:3001/api/clip`
2. Fall back to a YouTube link if the backend is not available

If you want to use a different host or port for your backend, update the `apiUrl` variable in `src/components/VideoPlayer.tsx`.
