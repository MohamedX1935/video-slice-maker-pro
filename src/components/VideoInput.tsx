
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface VideoInputProps {
  onVideoLoad: (videoId: string) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoLoad }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const videoId = extractYoutubeId(url);
    
    if (!videoId) {
      toast.error("URL YouTube invalide. Veuillez entrer une URL valide.");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      onVideoLoad(videoId);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Collez l'URL d'une vidéo YouTube..."
          className="flex-grow"
          aria-label="URL de la vidéo YouTube"
        />
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="bg-brand-blue hover:bg-opacity-80"
        >
          {isLoading ? 'Chargement...' : 'Charger la vidéo'}
        </Button>
      </form>
    </div>
  );
};

export default VideoInput;
