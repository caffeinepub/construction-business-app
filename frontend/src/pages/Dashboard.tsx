import { useMemo } from 'react';
import { useGetAllProjects } from '../hooks/useQueries';
import { useGetAllClients } from '../hooks/useQueries';
import { ProjectStatus, TaskStatus } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjects();
  const { data: clients = [], isLoading: clientsLoading } = useGetAllClients();

  const metrics = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === ProjectStatus.inProgress).length;
    const completed = projects.filter(p => p.status === ProjectStatus.completed).length;
    const planning = projects.filter(p => p.status === ProjectStatus.planning).length;
    return { total, active, completed, planning };
  }, [projects]);

  // Collect all tasks across projects for upcoming tasks
  const upcomingProjects = useMemo(() => {
    return [...projects]
      .filter(p => p.status !== ProjectStatus.completed)
      .sort((a, b) => {
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return a.endDate.localeCompare(b.endDate);
      })
      .slice(0, 5);
  }, [projects]);

  const isLoading = projectsLoading || clientsLoading;

  const statCards = [
    {
      label: 'Total Projects',
      value: metrics.total,
      icon: FolderKanban,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'In Progress',
      value: metrics.active,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Completed',
      value: metrics.completed,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Clients',
      value: clients.length,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x300.png"
          alt="Construction site banner"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent flex items-center px-8">
          <div>
            <h1 className="font-condensed text-4xl font-800 text-foreground uppercase tracking-wide">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Here's your construction business overview
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card-industrial rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-600 text-muted-foreground uppercase tracking-wide">{label}</span>
              <div className={`w-9 h-9 rounded ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 bg-secondary" />
            ) : (
              <div className={`font-condensed text-4xl font-800 ${color}`}>{value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="card-industrial rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-condensed text-xl font-700 text-foreground uppercase tracking-wide">
              Active Projects
            </h2>
            <button
              onClick={() => navigate({ to: '/projects' })}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-600 transition-colors"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 bg-secondary rounded" />)}
            </div>
          ) : upcomingProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle size={32} className="text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">No active projects yet.</p>
              <button
                onClick={() => navigate({ to: '/projects' })}
                className="mt-2 text-primary text-sm hover:underline font-600"
              >
                Create your first project →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingProjects.map(project => {
                const statusColors: Record<string, string> = {
                  [ProjectStatus.planning]: 'bg-blue-500/20 text-blue-300',
                  [ProjectStatus.inProgress]: 'bg-primary/20 text-primary',
                  [ProjectStatus.completed]: 'bg-green-500/20 text-green-300',
                };
                const statusLabels: Record<string, string> = {
                  [ProjectStatus.planning]: 'Planning',
                  [ProjectStatus.inProgress]: 'In Progress',
                  [ProjectStatus.completed]: 'Completed',
                };
                return (
                  <button
                    key={project.id.toString()}
                    onClick={() => navigate({ to: '/projects/$id', params: { id: project.id.toString() } })}
                    className="w-full flex items-center justify-between p-3 rounded bg-secondary/50 hover:bg-secondary transition-colors text-left group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-600 text-foreground truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {project.taskIds.length} task{project.taskIds.length !== 1 ? 's' : ''}
                        {project.endDate ? ` · Due ${project.endDate}` : ''}
                      </p>
                    </div>
                    <span className={`ml-3 text-xs font-600 px-2 py-0.5 rounded flex-shrink-0 ${statusColors[project.status as string] ?? ''}`}>
                      {statusLabels[project.status as string] ?? ''}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Clients */}
        <div className="card-industrial rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-condensed text-xl font-700 text-foreground uppercase tracking-wide">
              Recent Clients
            </h2>
            <button
              onClick={() => navigate({ to: '/clients' })}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-600 transition-colors"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 bg-secondary rounded" />)}
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users size={32} className="text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">No clients added yet.</p>
              <button
                onClick={() => navigate({ to: '/clients' })}
                className="mt-2 text-primary text-sm hover:underline font-600"
              >
                Add your first client →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.slice(0, 5).map(client => {
                const clientProjectCount = projects.filter(p => p.clientId === client.id).length;
                return (
                  <div
                    key={client.id.toString()}
                    className="flex items-center gap-3 p-3 rounded bg-secondary/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-condensed font-700 text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-foreground truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email || client.phone || 'No contact info'}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {clientProjectCount} proj.
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="card-industrial rounded-lg p-5">
        <h2 className="font-condensed text-xl font-700 text-foreground uppercase tracking-wide mb-4">
          Project Status Overview
        </h2>
        {isLoading ? (
          <Skeleton className="h-6 bg-secondary rounded-full" />
        ) : metrics.total === 0 ? (
          <p className="text-muted-foreground text-sm">No projects to display.</p>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Planning', count: metrics.planning, color: 'bg-blue-500', total: metrics.total },
              { label: 'In Progress', count: metrics.active, color: 'bg-primary', total: metrics.total },
              { label: 'Completed', count: metrics.completed, color: 'bg-green-500', total: metrics.total },
            ].map(({ label, count, color, total }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs font-600 text-muted-foreground w-24 flex-shrink-0">{label}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs font-700 text-foreground w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
