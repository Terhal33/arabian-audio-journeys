
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppState } from '@/contexts/AppStateContext';
import TourFormModal from '@/components/admin/TourFormModal';

interface Tour {
  id: string;
  title: string;
  region: string;
  duration: number;
  description: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

const AdminTours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const { showMessage } = useAppState();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tours:', error);
        showMessage('Failed to load tours', 'error');
        return;
      }

      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      showMessage('Failed to load tours', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tour: Tour) => {
    if (!confirm(`Are you sure you want to delete "${tour.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tour.id);

      if (error) {
        console.error('Error deleting tour:', error);
        showMessage('Failed to delete tour', 'error');
        return;
      }

      showMessage('Tour deleted successfully', 'success');
      fetchTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      showMessage('Failed to delete tour', 'error');
    }
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTour(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTour(null);
    fetchTours();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-desert border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-desert-dark mb-2">
            Manage Tours
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your audio tours
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-desert hover:bg-desert-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add New Tour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tours</CardTitle>
          <CardDescription>
            Manage your collection of audio tours
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tours.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No tours yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first audio tour to get started.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Tour
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tours.map((tour) => (
                <div key={tour.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{tour.title}</h3>
                      <Badge variant={tour.published ? 'default' : 'secondary'}>
                        {tour.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{tour.region}</span>
                      <span className="mx-2">•</span>
                      <span>{tour.duration} minutes</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {tour.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(tour)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(tour)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <TourFormModal
          tour={editingTour}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminTours;
