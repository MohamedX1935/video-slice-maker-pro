
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface RangeSliderProps {
  duration: number;
  onChange: (start: number, end: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ duration, onChange }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(100); // Default initial value to prevent blocking
  
  // Update range ONLY when duration changes (video loaded)
  useEffect(() => {
    if (duration > 0) {
      setStartTime(0);
      setEndTime(duration);
      onChange(0, duration);
    }
  }, [duration, onChange]); // Only depends on duration changing

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

  // Handle start time slider change with proper validation
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = Number(e.target.value);
    
    // Strict validation: ensure start time is less than end time
    if (newStartTime >= endTime) {
      return; // Prevent invalid state
    }
    
    // Update state and notify parent component
    setStartTime(newStartTime);
    onChange(newStartTime, endTime);
  };

  // Handle end time slider change with proper validation
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = Number(e.target.value);
    
    // Strict validation: ensure end time is greater than start time
    if (newEndTime <= startTime) {
      return; // Prevent invalid state
    }
    
    // Update state and notify parent component
    setEndTime(newEndTime);
    onChange(startTime, newEndTime);
  };

  return (
    <div className="w-full my-4 space-y-6">
      <p className="text-sm text-gray-600 mb-2">Sélectionner l'extrait :</p>
      
      {/* Start Time Slider - Fully controlled with onChange */}
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
      
      {/* End Time Slider - Fully controlled with onChange */}
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
