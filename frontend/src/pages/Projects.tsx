import { useState } from 'react';
import { useGetAllProjects, useGetAllClients, useCreateProject, useUpdateProjectStatus } from '../hooks/useQueries';
import { type Project, ProjectStatus } from '../backend';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderKanban, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Projects() {
  const { data: projects = [], isLoading } = useGetAllProjects();
  const { data: clients = [] } = useGetAllClients();
  const createProject = useCreateProject();
  const updateStatus = useUpdateProjectStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const clientMap = new Map(clients.map(c => [c.id.toString(), c.name]));

  const filteredProjects = projects.filter(p => {
    if (statusFilter === 'all') return true;
    return (p.status as string) === statusFilter;
  });

  const handleCreate = async (data: {
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    budget: string;
    clientId: string;
  }) => {
    try {
      await createProject.mutateAsync({
        name: data.name,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: BigInt(data.budget || '0'),
        clientId: BigInt(data.clientId || '0'),
      });
      toast.success('Project created successfully!');
      setDialogOpen(false);
    } catch {
      toast.error('Failed to create project.');
    }
  };

  const handleEdit = async (data: {
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    budget: string;
    clientId: string;
  }) => {
    if (!editingProject) return;
    try {
      await updateStatus.mutateAsync({
        projectId: editingProject.id,
        status: data.status,
      });
      toast.success('Project status updated!');
      setEditingProject(null);
    } catch {
      toast.error('Failed to update project.');
    }
  };

  const filterButtons = [
    { value: 'all', label: 'All' },
    { value: ProjectStatus.planning, label: 'Planning' },
    { value: ProjectStatus.inProgress, label: 'In Progress' },
    { value: ProjectStatus.completed, label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-condensed text-3xl font-800 text-foreground uppercase tracking-wide flex items-center gap-3">
            <FolderKanban size={28} className="text-primary" />
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            {projects.length} total project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-700 gap-2"
        >
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterButtons.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-4 py-1.5 rounded text-sm font-600 transition-all ${
              statusFilter === value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-52 bg-card rounded" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle size={48} className="text-muted-foreground mb-4" />
          <h3 className="font-condensed text-xl font-700 text-foreground mb-2">No Projects Found</h3>
          <p className="text-muted-foreground mb-4">
            {statusFilter === 'all' ? 'Get started by creating your first project.' : `No projects with status "${statusFilter}".`}
          </p>
          {statusFilter === 'all' && (
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-700 gap-2"
            >
              <Plus size={16} />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id.toString()}
              project={project}
              clientName={clientMap.get(project.clientId.toString())}
              onEdit={p => setEditingProject(p)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-condensed text-2xl font-700 text-foreground uppercase tracking-wide">
              New Project
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the details to create a new construction project.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            clients={clients}
            onSubmit={handleCreate}
            onCancel={() => setDialogOpen(false)}
            isLoading={createProject.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProject} onOpenChange={open => !open && setEditingProject(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-condensed text-2xl font-700 text-foreground uppercase tracking-wide">
              Edit Project
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the project status. Other fields are read-only after creation.
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              initialData={editingProject}
              clients={clients}
              onSubmit={handleEdit}
              onCancel={() => setEditingProject(null)}
              isLoading={updateStatus.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
