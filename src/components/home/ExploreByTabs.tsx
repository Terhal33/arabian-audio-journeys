
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoriesSection from '@/components/CategoriesSection';
import { Category } from '@/services/categoryData';

interface ExploreByTabsProps {
  categories: Category[];
  regions: Category[];
  selectedCategory: string;
  selectedRegion: string;
  onSelectCategory: (id: string) => void;
  onSelectRegion: (id: string) => void;
  isLoading: boolean;
}

const ExploreByTabs = ({
  categories,
  regions,
  selectedCategory,
  selectedRegion,
  onSelectCategory,
  onSelectRegion,
  isLoading
}: ExploreByTabsProps) => {
  return (
    <div className="mb-8">
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>
        <TabsContent value="themes" className="animate-fade-in">
          <CategoriesSection 
            title="Explore by Theme"
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="regions" className="animate-fade-in">
          <CategoriesSection 
            title="Explore by Region"
            categories={regions}
            selectedCategory={selectedRegion}
            onSelectCategory={onSelectRegion}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExploreByTabs;
