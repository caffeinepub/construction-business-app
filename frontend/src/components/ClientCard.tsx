import { type Client, type Project } from '../backend';
import { Button } from '@/components/ui/button';
import { Mail, Phone, FolderOpen, Pencil } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  projects: Project[];
  onEdit: (client: Client) => void;
}

export default function ClientCard({ client, projects, onEdit }: ClientCardProps) {
  const clientProjects = projects.filter(p => p.clientId === client.id);

  return (
    <div className="card-industrial rounded p-5 hover:border-primary/60 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-condensed font-700 text-lg text-foreground group-hover:text-primary transition-colors">
            {client.name}
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            {clientProjects.length} project{clientProjects.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-condensed font-700 text-lg">
            {client.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={13} className="text-primary flex-shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone size={13} className="text-primary flex-shrink-0" />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      {clientProjects.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <FolderOpen size={12} className="text-primary" />
            <span className="font-600 uppercase tracking-wide">Projects</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {clientProjects.slice(0, 3).map(p => (
              <span key={p.id.toString()} className="text-xs bg-secondary text-foreground px-2 py-0.5 rounded">
                {p.name}
              </span>
            ))}
            {clientProjects.length > 3 && (
              <span className="text-xs text-muted-foreground px-1">+{clientProjects.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-border">
        <Button
          size="sm"
          variant="ghost"
          className="w-full text-xs h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          onClick={() => onEdit(client)}
        >
          <Pencil size={13} className="mr-1.5" />
          Edit Client
        </Button>
      </div>
    </div>
  );
}
