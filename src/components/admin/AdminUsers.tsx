
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-desert-dark mb-2">
          Manage Users
        </h1>
        <p className="text-muted-foreground">
          View and manage user accounts and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Monitor and manage user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">User Management Coming Soon</h3>
            <p className="text-muted-foreground">
              Advanced user management features will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
