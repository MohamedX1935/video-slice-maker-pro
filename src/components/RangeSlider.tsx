
import React, { useState, useEffect } from 'react';

interface RangeSliderProps {
  duration: number;
  onChange: (start: number, end: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ duration, onChange }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(100); // Valeur par défaut pour éviter blocage initial
  
  // Update range when duration changes (video loaded)
  useEffect(() => {
    if (duration > 0) {
      setStartTime(0);
      setEndTime(duration);
      onChange(0, duration);
    }
  }, [duration, onChange]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    return [
      h > 0 ? h.toString().padStart(2, '0') : null,
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ]
      .filter(Boolean)
      .join(':');
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = Number(e.target.value);
    
    // Ensure start time doesn't exceed end time
    if (newStartTime >= endTime) {
      const adjustedStartTime = Math.max(0, endTime - 1);
      setStartTime(adjustedStartTime);
      onChange(adjustedStartTime, endTime);
    } else {
      setStartTime(newStartTime);
      onChange(newStartTime, endTime);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = Number(e.target.value);
    
    // Ensure end time is not less than start time
    if (newEndTime <= startTime) {
      const adjustedEndTime = Math.min(duration || 100, startTime + 1);
      setEndTime(adjustedEndTime);
      onChange(startTime, adjustedEndTime);
    } else {
      setEndTime(newEndTime);
      onChange(startTime, newEndTime);
    }
  };

  return (
    <div className="w-full my-4 space-y-6">
      <p className="text-sm text-gray-600 mb-2">Sélectionner l'extrait :</p>
      
      {/* Start Time Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Début sélectionné :</span>
          <span className="text-sm font-mono text-brand-purple">{formatTime(startTime)}</span>
        </div>
        <input 
          type="range" 
          value={startTime} 
          min={0} 
          max={duration || 100} 
          step={1}
          onChange={handleStartTimeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
          aria-label="Sélectionner le début de l'extrait"
        />
      </div>
      
      {/* End Time Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Fin sélectionnée :</span>
          <span className="text-sm font-mono text-brand-blue">{formatTime(endTime)}</span>
        </div>
        <input 
          type="range" 
          value={endTime} 
          min={0} 
          max={duration || 100} 
          step={1}
          onChange={handleEndTimeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
          aria-label="Sélectionner la fin de l'extrait"
        />
      </div>

      <div className="mt-2 px-1">
        <div className="text-xs text-gray-500">
          Durée de l'extrait : <span className="font-semibold">{formatTime(endTime - startTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
