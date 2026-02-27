import { useState, useEffect } from 'react';
import { type Project, ProjectStatus } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Client } from '../backend';
import { Loader2 } from 'lucide-react';

interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: string;
  clientId: string;
}

interface ProjectFormProps {
  initialData?: Project;
  clients: Client[];
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultForm: ProjectFormData = {
  name: '',
  description: '',
  status: ProjectStatus.planning,
  startDate: '',
  endDate: '',
  budget: '',
  clientId: '0',
};

export default function ProjectForm({ initialData, clients, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        status: initialData.status as ProjectStatus,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        budget: initialData.budget.toString(),
        clientId: initialData.clientId.toString(),
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fieldClass = "bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Project Name *</Label>
        <Input
          className={fieldClass}
          placeholder="e.g. Downtown Office Renovation"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Description</Label>
        <Textarea
          className={`${fieldClass} resize-none`}
          placeholder="Project details..."
          rows={3}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-600 text-foreground">Status</Label>
          <Select
            value={form.status}
            onValueChange={val => setForm(f => ({ ...f, status: val as ProjectStatus }))}
          >
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value={ProjectStatus.planning}>Planning</SelectItem>
              <SelectItem value={ProjectStatus.inProgress}>In Progress</SelectItem>
              <SelectItem value={ProjectStatus.completed}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-600 text-foreground">Client</Label>
          <Select
            value={form.clientId}
            onValueChange={val => setForm(f => ({ ...f, clientId: val }))}
          >
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="0">No Client</SelectItem>
              {clients.map(c => (
                <SelectItem key={c.id.toString()} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-600 text-foreground">Start Date</Label>
          <Input
            type="date"
            className={fieldClass}
            value={form.startDate}
            onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-600 text-foreground">End Date</Label>
          <Input
            type="date"
            className={fieldClass}
            value={form.endDate}
            onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Budget (USD)</Label>
        <Input
          type="number"
          min="0"
          className={fieldClass}
          placeholder="e.g. 150000"
          value={form.budget}
          onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || !form.name.trim()}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-700"
        >
          {isLoading && <Loader2 size={15} className="mr-2 animate-spin" />}
          {initialData ? 'Update Project' : 'Create Project'}
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
