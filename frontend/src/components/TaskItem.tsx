import { type Task, TaskStatus } from '../backend';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, User, Calendar, Loader2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleDone: (task: Task) => void;
  isUpdating?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Circle }> = {
  [TaskStatus.toDo]: { label: 'To Do', color: 'text-muted-foreground', icon: Circle },
  [TaskStatus.inProgress]: { label: 'In Progress', color: 'text-primary', icon: Clock },
  [TaskStatus.done]: { label: 'Done', color: 'text-green-400', icon: CheckCircle2 },
};

export default function TaskItem({ task, onToggleDone, isUpdating }: TaskItemProps) {
  const status = statusConfig[task.status as string] ?? statusConfig[TaskStatus.toDo];
  const StatusIcon = status.icon;
  const isDone = task.status === TaskStatus.done;

  return (
    <div className={`flex items-center gap-4 p-4 rounded border transition-all duration-200 ${
      isDone
        ? 'bg-secondary/30 border-border/50 opacity-70'
        : 'bg-card border-border hover:border-primary/40'
    }`}>
      <button
        onClick={() => onToggleDone(task)}
        disabled={isUpdating}
        className="flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
        title={isDone ? 'Mark as To Do' : 'Mark as Done'}
      >
        {isUpdating ? (
          <Loader2 size={20} className="animate-spin text-primary" />
        ) : (
          <StatusIcon size={20} className={status.color} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-600 ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {task.assignee && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User size={11} />
              {task.assignee}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={11} />
              {task.dueDate}
            </span>
          )}
        </div>
      </div>

      <span className={`text-xs font-600 px-2 py-0.5 rounded ${
        isDone
          ? 'bg-green-500/15 text-green-400'
          : task.status === TaskStatus.inProgress
          ? 'bg-primary/15 text-primary'
          : 'bg-secondary text-muted-foreground'
      }`}>
        {status.label}
      </span>
    </div>
  );
}
