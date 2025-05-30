
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAppState } from '@/contexts/AppStateContext';

interface Tour {
  id: string;
  title: string;
  region: string;
  duration: number;
  description: string;
  image_url: string;
  published: boolean;
}

interface TourFormModalProps {
  tour: Tour | null;
  onClose: () => void;
}

const TourFormModal: React.FC<TourFormModalProps> = ({ tour, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    region: '',
    duration: 30,
    description: '',
    image_url: '',
    published: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useAppState();

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title,
        region: tour.region,
        duration: tour.duration,
        description: tour.description || '',
        image_url: tour.image_url || '',
        published: tour.published,
      });
    }
  }, [tour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (tour) {
        // Update existing tour
        const { error } = await supabase
          .from('tours')
          .update(formData)
          .eq('id', tour.id);

        if (error) {
          console.error('Error updating tour:', error);
          showMessage('Failed to update tour', 'error');
          return;
        }

        showMessage('Tour updated successfully', 'success');
      } else {
        // Create new tour
        const { error } = await supabase
          .from('tours')
          .insert([formData]);

        if (error) {
          console.error('Error creating tour:', error);
          showMessage('Failed to create tour', 'error');
          return;
        }

        showMessage('Tour created successfully', 'success');
      }

      onClose();
    } catch (error) {
      console.error('Error saving tour:', error);
      showMessage('Failed to save tour', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tour ? 'Edit Tour' : 'Add New Tour'}
          </DialogTitle>
          <DialogDescription>
            {tour ? 'Update tour information' : 'Create a new audio tour'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter tour title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              placeholder="e.g., Riyadh, Jeddah, AlUla"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
              placeholder="30"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the tour experience..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleChange('published', checked)}
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-desert hover:bg-desert-dark"
            >
              {isLoading ? 'Saving...' : (tour ? 'Update Tour' : 'Create Tour')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TourFormModal;
