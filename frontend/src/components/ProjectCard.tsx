import { type Project, ProjectStatus } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Eye, Pencil } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface ProjectCardProps {
  project: Project;
  clientName?: string;
  onEdit: (project: Project) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  [ProjectStatus.planning]: { label: 'Planning', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  [ProjectStatus.inProgress]: { label: 'In Progress', className: 'bg-primary/20 text-primary border-primary/30' },
  [ProjectStatus.completed]: { label: 'Completed', className: 'bg-green-500/20 text-green-300 border-green-500/30' },
};

export default function ProjectCard({ project, clientName, onEdit }: ProjectCardProps) {
  const navigate = useNavigate();
  const status = statusConfig[project.status as string] ?? { label: 'Unknown', className: '' };

  const formatBudget = (budget: bigint) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(budget));
  };

  return (
    <div className="card-industrial rounded p-5 hover:border-primary/60 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-condensed font-700 text-lg text-foreground truncate group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          {clientName && (
            <p className="text-xs text-muted-foreground mt-0.5">{clientName}</p>
          )}
        </div>
        <span className={`ml-3 text-xs font-600 px-2 py-1 rounded border ${status.className}`}>
          {status.label}
        </span>
      </div>

      {project.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={13} className="text-primary flex-shrink-0" />
          <span>{project.startDate || '—'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={13} className="text-muted-foreground flex-shrink-0" />
          <span>{project.endDate || '—'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-foreground font-600 col-span-2">
          <DollarSign size={13} className="text-primary flex-shrink-0" />
          <span>{formatBudget(project.budget)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 text-xs h-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={() => navigate({ to: '/projects/$id', params: { id: project.id.toString() } })}
        >
          <Eye size={13} className="mr-1.5" />
          View Tasks
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 text-xs h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          onClick={() => onEdit(project)}
        >
          <Pencil size={13} className="mr-1.5" />
          Edit
        </Button>
      </div>
    </div>
  );
}
