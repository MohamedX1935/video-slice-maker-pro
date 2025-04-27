
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface RangeSliderProps {
  duration: number;
  onChange: (start: number, end: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ duration, onChange }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(duration);
  
  // Update range when duration changes (video loaded)
  useEffect(() => {
    setStartTime(0);
    setEndTime(duration);
    onChange(0, duration);
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

  const handleStartTimeChange = (value: number[]) => {
    const newStartTime = value[0];
    // Ensure start time doesn't exceed end time
    if (newStartTime >= endTime) {
      setStartTime(Math.max(0, endTime - 1));
      onChange(Math.max(0, endTime - 1), endTime);
    } else {
      setStartTime(newStartTime);
      onChange(newStartTime, endTime);
    }
  };

  const handleEndTimeChange = (value: number[]) => {
    const newEndTime = value[0];
    // Ensure end time is not less than start time
    if (newEndTime <= startTime) {
      setEndTime(Math.min(duration, startTime + 1));
      onChange(startTime, Math.min(duration, startTime + 1));
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
        <Slider 
          value={[startTime]} 
          min={0} 
          max={duration} 
          step={1}
          onValueChange={handleStartTimeChange}
          className="start-slider"
          aria-label="Sélectionner le début de l'extrait"
        />
      </div>
      
      {/* End Time Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Fin sélectionnée :</span>
          <span className="text-sm font-mono text-brand-blue">{formatTime(endTime)}</span>
        </div>
        <Slider 
          value={[endTime]} 
          min={0} 
          max={duration} 
          step={1}
          onValueChange={handleEndTimeChange}
          className="end-slider"
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
