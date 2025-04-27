
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download } from 'lucide-react';
import RangeSlider from './RangeSlider';
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [clipStart, setClipStart] = useState(0);
  const [clipEnd, setClipEnd] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const playerRef = useRef<HTMLIFrameElement>(null);
  const playerAPI = useRef<any>(null);
  
  // Initialize YouTube player
  useEffect(() => {
    // Add YouTube API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (playerAPI.current) {
        playerAPI.current.destroy();
      }
    };
  }, [videoId]);

  const initPlayer = () => {
    if (playerAPI.current) {
      playerAPI.current.destroy();
    }

    playerAPI.current = new window.YT.Player(`youtube-player-${videoId}`, {
      videoId: videoId,
      playerVars: {
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      }
    });
  };

  const onPlayerReady = (event: any) => {
    // Get video duration once the player is ready
    const videoDuration = event.target.getDuration();
    setDuration(videoDuration);
    setClipStart(0);
    setClipEnd(videoDuration);
    
    // Set up interval to update current time
    const timeUpdateInterval = setInterval(() => {
      if (playerAPI.current && playerAPI.current.getCurrentTime) {
        const currentTime = playerAPI.current.getCurrentTime();
        setCurrentTime(currentTime);
        
        // Handle preview mode logic
        if (isPreviewMode && currentTime >= clipEnd) {
          playerAPI.current.seekTo(clipStart);
        }
      }
    }, 100);
    
    return () => clearInterval(timeUpdateInterval);
  };

  const onPlayerStateChange = (event: any) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    
    // If video ended, reset to clip start in preview mode
    if (event.data === window.YT.PlayerState.ENDED && isPreviewMode) {
      playerAPI.current.seekTo(clipStart);
      playerAPI.current.playVideo();
    }
  };

  const handlePlayPause = () => {
    if (!playerAPI.current) return;
    
    if (isPlaying) {
      playerAPI.current.pauseVideo();
    } else {
      // If in preview mode, ensure we start at clip start
      if (isPreviewMode) {
        playerAPI.current.seekTo(clipStart);
      }
      playerAPI.current.playVideo();
    }
  };

  const handleRangeChange = (start: number, end: number) => {
    console.log("Range changed:", start, end); // Debug: confirm values are updating
    setClipStart(start);
    setClipEnd(end);
    
    // Seek to the newly selected position when changing the range
    // Only seek to start point when changing the start time
    if (Math.abs(start - clipStart) > 0.5) {
      playerAPI.current?.seekTo(start);
    }
  };

  const togglePreviewMode = () => {
    const newPreviewMode = !isPreviewMode;
    setIsPreviewMode(newPreviewMode);
    
    if (newPreviewMode && playerAPI.current) {
      // Entering preview mode: Seek to clip start
      playerAPI.current.seekTo(clipStart);
      if (isPlaying) {
        playerAPI.current.playVideo();
      }
    }
  };

  const handleDownload = () => {
    setIsProcessing(true);
    
    // Simulate processing time
    toast.info("Préparation de l'extrait vidéo...");
    
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Extrait prêt à télécharger!");
      
      // In a real implementation, we would call the backend to process and download the video
      // For now, we'll simulate a download by opening a new window with the YouTube URL at the specific timestamp
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(clipStart)}`;
      window.open(youtubeUrl, '_blank');
    }, 3000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative aspect-video bg-gray-100 mb-4 rounded-md overflow-hidden">
        <div id={`youtube-player-${videoId}`} className="w-full h-full"></div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={isPreviewMode ? "default" : "outline"}
            onClick={togglePreviewMode}
            className={isPreviewMode ? "bg-brand-purple" : ""}
          >
            {isPreviewMode ? "Quitter la prévisualisation" : "Prévisualiser l'extrait"}
          </Button>
          
          <Button 
            onClick={handleDownload} 
            variant="default" 
            className="bg-brand-blue hover:bg-opacity-80"
            disabled={isProcessing}
          >
            {isProcessing ? (
              "Traitement en cours..."
            ) : (
              <>
                <Download size={18} className="mr-1" />
                Télécharger l'extrait
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-md">
        <RangeSlider duration={duration} onChange={handleRangeChange} />
      </div>
    </div>
  );
};

// Add this to the global window object for TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default VideoPlayer;
