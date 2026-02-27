import { useState, useEffect } from 'react';
import { type Client } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ClientFormData {
  name: string;
  phone: string;
  email: string;
}

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ClientForm({ initialData, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [form, setForm] = useState<ClientFormData>({ name: '', phone: '', email: '' });

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name, phone: initialData.phone, email: initialData.email });
    } else {
      setForm({ name: '', phone: '', email: '' });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fieldClass = "bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Client Name *</Label>
        <Input
          className={fieldClass}
          placeholder="e.g. Acme Construction LLC"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Phone</Label>
        <Input
          type="tel"
          className={fieldClass}
          placeholder="e.g. (555) 123-4567"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-600 text-foreground">Email</Label>
        <Input
          type="email"
          className={fieldClass}
          placeholder="e.g. contact@acme.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || !form.name.trim()}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-700"
        >
          {isLoading && <Loader2 size={15} className="mr-2 animate-spin" />}
          {initialData ? 'Update Client' : 'Add Client'}
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
