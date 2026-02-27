import { useState } from 'react';
import { useGetAllClients, useGetAllProjects, useCreateClient } from '../hooks/useQueries';
import { type Client } from '../backend';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Clients() {
  const { data: clients = [], isLoading } = useGetAllClients();
  const { data: projects = [] } = useGetAllProjects();
  const createClient = useCreateClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleCreate = async (data: { name: string; phone: string; email: string }) => {
    try {
      await createClient.mutateAsync(data);
      toast.success('Client added successfully!');
      setDialogOpen(false);
    } catch {
      toast.error('Failed to add client.');
    }
  };

  // Note: Backend doesn't support updating client info after creation
  // We show the edit dialog but only display current info
  const handleEdit = async (data: { name: string; phone: string; email: string }) => {
    toast.info('Client editing is not yet supported by the backend.');
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-condensed text-3xl font-800 text-foreground uppercase tracking-wide flex items-center gap-3">
            <Users size={28} className="text-primary" />
            Clients
          </h1>
          <p className="text-muted-foreground mt-1">
            {clients.length} client{clients.length !== 1 ? 's' : ''} in your directory
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-700 gap-2"
        >
          <Plus size={16} />
          Add Client
        </Button>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 bg-card rounded" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={48} className="text-muted-foreground mb-4" />
          <h3 className="font-condensed text-xl font-700 text-foreground mb-2">No Clients Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your client directory.
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-700 gap-2"
          >
            <Plus size={16} />
            Add First Client
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map(client => (
            <ClientCard
              key={client.id.toString()}
              client={client}
              projects={projects}
              onEdit={c => setEditingClient(c)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-condensed text-2xl font-700 text-foreground uppercase tracking-wide">
              Add Client
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new client to your directory.
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            onSubmit={handleCreate}
            onCancel={() => setDialogOpen(false)}
            isLoading={createClient.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingClient} onOpenChange={open => !open && setEditingClient(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-condensed text-2xl font-700 text-foreground uppercase tracking-wide">
              Edit Client
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              View client details. Full editing coming soon.
            </DialogDescription>
          </DialogHeader>
          {editingClient && (
            <ClientForm
              initialData={editingClient}
              onSubmit={handleEdit}
              onCancel={() => setEditingClient(null)}
              isLoading={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
