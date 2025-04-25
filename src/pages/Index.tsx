
import React, { useState } from 'react';
import Header from '@/components/Header';
import VideoInput from '@/components/VideoInput';
import VideoPlayer from '@/components/VideoPlayer';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleVideoLoad = (id: string) => {
    setVideoId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {!videoId ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-6">
                Créez des extraits de vidéos YouTube en quelques clics
              </h2>
              <div className="mb-8">
                <VideoInput onVideoLoad={handleVideoLoad} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-brand-purple text-xl font-bold mb-2">1. Collez l'URL</div>
                  <p className="text-gray-600">Insérez l'URL d'une vidéo YouTube que vous souhaitez découper</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-brand-purple text-xl font-bold mb-2">2. Sélectionnez l'extrait</div>
                  <p className="text-gray-600">Définissez les points de début et de fin avec précision</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-brand-purple text-xl font-bold mb-2">3. Téléchargez</div>
                  <p className="text-gray-600">Téléchargez votre extrait au format MP4 en un clic</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <VideoPlayer videoId={videoId} />
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setVideoId(null)}
                  className="text-gray-600 hover:text-brand-blue underline"
                >
                  Sélectionner une autre vidéo
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            © 2025 SliceTube — Votre découpeur YouTube instantané
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
