
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  name: string;
  nameArabic?: string;
  icon?: string;
}

interface CategoriesSectionProps {
  title: string;
  categories: Category[];
  onSelectCategory?: (categoryId: string) => void;
  selectedCategory?: string;
  isLoading?: boolean;
}

const CategoriesSection = ({
  title,
  categories,
  onSelectCategory,
  selectedCategory,
  isLoading = false
}: CategoriesSectionProps) => {
  const handleCategoryClick = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  // Create skeleton placeholders for loading state
  const skeletonCategories = Array(5).fill(0).map((_, i) => (
    <div key={`skeleton-${i}`} className="inline-block mr-3">
      <Skeleton className="h-24 w-32 rounded-lg" />
    </div>
  ));

  return (
    <div className="mb-8">
      <h2 className="font-display text-xl font-bold mb-4 text-desert-dark">{title}</h2>
      
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-3 p-1">
          {isLoading ? (
            skeletonCategories
          ) : (
            categories.map((category) => (
              <Card 
                key={category.id}
                className={cn(
                  "inline-block w-32 h-24 cursor-pointer transition-all hover:shadow-md",
                  selectedCategory === category.id 
                    ? "border-desert border-2" 
                    : "border-border hover:border-desert/50"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-3 h-full">
                  {category.icon && (
                    <div className="mb-2 text-desert-dark">{category.icon}</div>
                  )}
                  <p className="text-sm font-medium text-center">{category.name}</p>
                  {category.nameArabic && (
                    <p className="text-xs text-muted-foreground arabic">{category.nameArabic}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoriesSection;
