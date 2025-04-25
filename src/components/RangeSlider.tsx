
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface RangeSliderProps {
  duration: number;
  onChange: (start: number, end: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ duration, onChange }) => {
  const [range, setRange] = useState<[number, number]>([0, duration]);
  
  // Update range when duration changes (video loaded)
  useEffect(() => {
    setRange([0, duration]);
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

  const handleRangeChange = (values: number[]) => {
    const [start, end] = values as [number, number];
    setRange([start, end]);
    onChange(start, end);
  };

  return (
    <div className="w-full my-4">
      <div className="mb-2">
        <p className="text-sm text-gray-600 mb-1">Sélectionner l'extrait :</p>
        <div className="flex justify-between">
          <span className="text-sm font-mono">{formatTime(range[0])}</span>
          <span className="text-sm font-mono">{formatTime(range[1])}</span>
        </div>
      </div>
      <Slider 
        defaultValue={[0, duration]} 
        min={0} 
        max={duration} 
        step={1}
        value={range}
        onValueChange={handleRangeChange}
        className="clip-slider-track"
      />
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-600">Début</span>
        <span className="text-sm text-gray-600">Fin</span>
      </div>
    </div>
  );
};

export default RangeSlider;
