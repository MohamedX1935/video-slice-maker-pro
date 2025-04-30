
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface RangeSliderProps {
  duration: number;
  onChange: (start: number, end: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ duration, onChange }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(100); // Default initial value
  
  // Initialize only when duration changes, not when onChange is called
  useEffect(() => {
    if (duration > 0) {
      setStartTime(0);
      setEndTime(duration);
      onChange(0, duration);
    }
  }, [duration]); // Removed onChange dependency to prevent reset loops

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

  // Handle start time slider change - only updates local state
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = Number(e.target.value);
    
    // Validation: ensure start time is less than end time
    if (newStartTime >= endTime) {
      return; // Prevent invalid state
    }
    
    // Update only local state, no onChange call here
    setStartTime(newStartTime);
  };

  // Handle end time slider change - only updates local state
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = Number(e.target.value);
    
    // Validation: ensure end time is greater than start time
    if (newEndTime <= startTime) {
      return; // Prevent invalid state
    }
    
    // Update only local state, no onChange call here
    setEndTime(newEndTime);
  };
  
  // Only call onChange when slider is released to prevent resets during dragging
  const handleSliderRelease = () => {
    onChange(startTime, endTime);
  };

  return (
    <div className="w-full my-4 space-y-6">
      <p className="text-sm text-gray-600 mb-2">Sélectionner l'extrait :</p>
      
      {/* Start Time Slider - Controlled with local state only */}
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
          onPointerUp={handleSliderRelease}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
          aria-label="Sélectionner le début de l'extrait"
        />
      </div>
      
      {/* End Time Slider - Controlled with local state only */}
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
          onPointerUp={handleSliderRelease}
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
