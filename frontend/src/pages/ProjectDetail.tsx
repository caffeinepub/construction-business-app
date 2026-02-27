import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  useGetProject,
  useGetProjectTasks,
  useCreateTask,
  useUpdateTaskStatus,
} from '../hooks/useQueries';
import { useGetAllClients } from '../hooks/useQueries';
import { type Task, TaskStatus, ProjectStatus } from '../backend';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Plus, ClipboardList, DollarSign, Calendar, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; className: string }> = {
  [ProjectStatus.planning]: { label: 'Planning', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  [ProjectStatus.inProgress]: { label: 'In Progress', className: 'bg-primary/20 text-primary border-primary/30' },
  [ProjectStatus.completed]: { label: 'Completed', className: 'bg-green-500/20 text-green-300 border-green-500/30' },
};

export default function ProjectDetail() {
  const { id } = useParams({ from: '/projects/$id' });
  const navigate = useNavigate();
  const projectId = BigInt(id);

  const { data: project, isLoading: projectLoading } = useGetProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useGetProjectTasks(project?.taskIds ?? []);
  const { data: clients = [] } = useGetAllClients();
  const createTask = useCreateTask();
  const updateTaskStatus = useUpdateTaskStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const clientName = clients.find(c => c.id === project?.clientId)?.name;

  const handleCreateTask = async (data: {
    title: string;
    assignee: string;
    dueDate: string;
    status: TaskStatus;
  }) => {
    try {
      await createTask.mutateAsync({
        projectId,
        title: data.title,
        assignee: data.assignee,
        dueDate: data.dueDate,
        status: data.status,
      });
      toast.success('Task added!');
      setDialogOpen(false);
    } catch {
      toast.error('Failed to add task.');
    }
  };

  const handleToggleDone = async (task: Task) => {
    const taskIdStr = task.id.toString();
    setUpdatingTaskId(taskIdStr);
    try {
      const newStatus = task.status === TaskStatus.done ? TaskStatus.toDo : TaskStatus.done;
      await updateTaskStatus.mutateAsync({ taskId: task.id, status: newStatus });
    } catch {
      toast.error('Failed to update task.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const tasksByStatus = {
    toDo: tasks.filter(t => t.status === TaskStatus.toDo),
    inProgress: tasks.filter(t => t.status === TaskStatus.inProgress),
    done: tasks.filter(t => t.status === TaskStatus.done),
  };

  const isLoading = projectLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-card" />
        <Skeleton className="h-32 bg-card rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 bg-card rounded" />)}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-condensed text-xl font-700 text-foreground mb-2">Project Not Found</h3>
        <Button onClick={() => navigate({ to: '/projects' })} variant="outline" className="mt-4">
          <ArrowLeft size={16} className="mr-2" /> Back to Projects
        </Button>
      </div>
    );
  }

  const status = statusConfig[project.status as string] ?? { label: 'Unknown', className: '' };
  const formatBudget = (budget: bigint) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(budget));

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/projects' })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-600"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="card-industrial rounded-lg p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-condensed text-3xl font-800 text-foreground uppercase tracking-wide">
                {project.name}
              </h1>
              <span className={`text-xs font-600 px-2.5 py-1 rounded border ${status.className}`}>
                {status.label}
              </span>
            </div>
            {project.description && (
              <p className="text-muted-foreground text-sm max-w-2xl">{project.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-border">
          {clientName && (
            <div className="flex items-center gap-2">
              <User size={15} className="text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="text-sm font-600 text-foreground">{clientName}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-600 text-foreground">{project.startDate || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">End Date</p>
              <p className="text-sm font-600 text-foreground">{project.endDate || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={15} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-600 text-foreground">{formatBudget(project.budget)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-condensed text-2xl font-700 text-foreground uppercase tracking-wide flex items-center gap-2">
            <ClipboardList size={22} className="text-primary" />
            Tasks
            <span className="text-base text-muted-foreground font-500 normal-case tracking-normal">
              ({tasks.length})
            </span>
          </h2>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-700 gap-2"
            size="sm"
          >
            <Plus size={15} />
            Add Task
          </Button>
        </div>

        {tasksLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 bg-card rounded" />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center card-industrial rounded-lg">
            <ClipboardList size={40} className="text-muted-foreground mb-3" />
            <h3 className="font-condensed text-lg font-700 text-foreground mb-1">No Tasks Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Add tasks to track work on this project.</p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-700 gap-2"
              size="sm"
            >
              <Plus size={15} />
              Add First Task
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* To Do */}
            {tasksByStatus.toDo.length > 0 && (
              <div>
                <h3 className="text-xs font-700 text-muted-foreground uppercase tracking-widest mb-2 px-1">
                  To Do ({tasksByStatus.toDo.length})
                </h3>
                <div className="space-y-2">
                  {tasksByStatus.toDo.map(task => (
                    <TaskItem
                      key={task.id.toString()}
                      task={task}
                      onToggleDone={handleToggleDone}
                      isUpdating={updatingTaskId === task.id.toString()}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* In Progress */}
            {tasksByStatus.inProgress.length > 0 && (
              <div>
                <h3 className="text-xs font-700 text-muted-foreground uppercase tracking-widest mb-2 px-1">
                  In Progress ({tasksByStatus.inProgress.length})
                </h3>
                <div className="space-y-2">
                  {tasksByStatus.inProgress.map(task => (
                    <TaskItem
                      key={task.id.toString()}
                      task={task}
                      onToggleDone={handleToggleDone}
                      isUpdating={updatingTaskId === task.id.toString()}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Done */}
            {tasksByStatus.done.length > 0 && (
              <div>
                <h3 className="text-xs font-700 text-muted-foreground uppercase tracking-widest mb-2 px-1">
                  Done ({tasksByStatus.done.length})
                </h3>
                <div className="space-y-2">
                  {tasksByStatus.done.map(task => (
                    <TaskItem
                      key={task.id.toString()}
                      task={task}
                      onToggleDone={handleToggleDone}
                      isUpdating={updatingTaskId === task.id.toString()}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-condensed text-2xl font-700 text-foreground uppercase tracking-wide">
              Add Task
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new task to <span className="text-foreground font-600">{project.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setDialogOpen(false)}
            isLoading={createTask.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
