
// This file would be used on the server side, not in the client-side Vite app
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Set up temp directory for processing files
const tempDir = path.join(os.tmpdir(), 'slicetube');

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

app.post('/api/clip', async (req, res) => {
  try {
    const { videoId, startTime, endTime } = req.body;

    // Validate input
    if (!videoId || typeof videoId !== 'string') {
      return res.status(400).json({ error: 'Invalid videoId' });
    }
    
    if (typeof startTime !== 'number' || typeof endTime !== 'number') {
      return res.status(400).json({ error: 'Invalid time range' });
    }
    
    if (startTime < 0 || endTime <= startTime) {
      return res.status(400).json({ error: 'Invalid time range values' });
    }
    
    // Generate unique file names to prevent collisions
    const sessionId = uuidv4();
    const inputPath = path.join(tempDir, `${sessionId}-input.mp4`);
    const outputPath = path.join(tempDir, `${sessionId}-output.mp4`);
    
    // Download video using yt-dlp
    await downloadVideo(videoId, inputPath);
    
    // Cut video using ffmpeg
    await cutVideo(inputPath, outputPath, startTime, endTime);
    
    // Check if the output file exists and has content
    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
      throw new Error('Failed to generate video clip');
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="slicetube-${videoId}-${Math.floor(startTime)}-${Math.floor(endTime)}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');
    
    // Stream the file to the client
    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);
    
    // Clean up temporary files after sending
    fileStream.on('end', () => {
      // Wait a bit to ensure file is fully sent before deleting
      setTimeout(() => {
        try {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        } catch (err) {
          // Silently fail on cleanup errors
          console.error('Error cleaning up temp files:', err);
        }
      }, 1000);
    });
    
  } catch (error) {
    console.error('Error processing video:', error);
    return res.status(500).json({ error: 'Failed to process video clip' });
  }
});

// Function to download YouTube video
function downloadVideo(videoId, outputPath) {
  return new Promise((resolve, reject) => {
    // Using yt-dlp to download the video
    const ytDlp = spawn('yt-dlp', [
      `https://www.youtube.com/watch?v=${videoId}`,
      '-f', 'mp4',
      '-o', outputPath
    ]);
    
    let errorOutput = '';
    
    ytDlp.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    ytDlp.on('error', (error) => {
      reject(new Error(`Failed to start yt-dlp: ${error.message}`));
    });
    
    ytDlp.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`yt-dlp exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// Function to cut video with ffmpeg
function cutVideo(inputPath, outputPath, startTime, endTime) {
  return new Promise((resolve, reject) => {
    // Using ffmpeg to cut the video
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-c', 'copy',  // Use copy codec for faster processing
      '-y',  // Overwrite output file
      outputPath
    ]);
    
    let errorOutput = '';
    
    ffmpeg.stderr.on('data', (data) => {
      // ffmpeg writes to stderr by default, but it's not necessarily an error
      errorOutput += data.toString();
    });
    
    ffmpeg.on('error', (error) => {
      reject(new Error(`Failed to start ffmpeg: ${error.message}`));
    });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
