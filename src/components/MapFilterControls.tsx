
import React from 'react';
import { Check } from 'lucide-react';
import { regions, categories, historicalPeriods } from '@/services/categoryData';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface MapFilterControlsProps {
  activeRegion: string;
  onRegionChange: (regionId: string) => void;
}

const MapFilterControls: React.FC<MapFilterControlsProps> = ({ 
  activeRegion, 
  onRegionChange
}) => {
  return (
    <div className="py-4">
      <h3 className="font-display text-lg font-medium mb-6">Filter Map</h3>
      
      {/* Regions */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-3">Region</h4>
        <RadioGroup 
          defaultValue={activeRegion} 
          onValueChange={onRegionChange}
        >
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All of Saudi Arabia</Label>
          </div>
          
          {regions.map((region) => (
            <div key={region.id} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={region.id} id={region.id} />
              <Label htmlFor={region.id} className="cursor-pointer">
                {region.name}
                <span className="text-xs text-muted-foreground ml-1 arabic">({region.nameArabic})</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Tour Types */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-3">Tour Types</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border border-desert/20 flex items-center gap-1",
                "hover:bg-desert/10 transition-colors",
                // Simulating selected state for UI preview
                category.id === 'historical' ? "bg-desert text-white hover:bg-desert-dark" : ""
              )}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Historical Periods */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-3">Historical Periods</h4>
        <div className="flex flex-wrap gap-2">
          {historicalPeriods.map((period) => (
            <button
              key={period.id}
              className="px-3 py-1.5 rounded-full text-sm border border-desert/20 hover:bg-desert/10 transition-colors"
            >
              {period.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Additional Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-premium">Show Premium Tours</Label>
          <Switch id="show-premium" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-free">Show Free Tours</Label>
          <Switch id="show-free" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-downloaded">Downloaded Only</Label>
          <Switch id="show-downloaded" />
        </div>
      </div>
    </div>
  );
};

export default MapFilterControls;
