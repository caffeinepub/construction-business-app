import { useState } from 'react';
import { TaskStatus } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface TaskFormData {
  title: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TaskForm({ onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>({
    title: '',
    assignee: '',
    dueDate: '',
    status: TaskStatus.toDo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fieldClass = "bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Task Title *</Label>
        <Input
          className={fieldClass}
          placeholder="e.g. Pour foundation concrete"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Assignee</Label>
        <Input
          className={fieldClass}
          placeholder="e.g. John Smith"
          value={form.assignee}
          onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-600 text-foreground">Due Date</Label>
          <Input
            type="date"
            className={fieldClass}
            value={form.dueDate}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-600 text-foreground">Status</Label>
          <Select
            value={form.status}
            onValueChange={val => setForm(f => ({ ...f, status: val as TaskStatus }))}
          >
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value={TaskStatus.toDo}>To Do</SelectItem>
              <SelectItem value={TaskStatus.inProgress}>In Progress</SelectItem>
              <SelectItem value={TaskStatus.done}>Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || !form.title.trim()}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-700"
        >
          {isLoading && <Loader2 size={15} className="mr-2 animate-spin" />}
          Add Task
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-border text-foreground hover:bg-secondary"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
