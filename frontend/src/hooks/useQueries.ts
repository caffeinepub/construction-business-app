import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ProjectStatus, TaskStatus, type Project, type Task, type Client } from '../backend';

// ─── Projects ────────────────────────────────────────────────────────────────

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProject(projectId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Project>({
    queryKey: ['project', projectId?.toString()],
    queryFn: async () => {
      if (!actor || projectId === null) throw new Error('No actor or projectId');
      return actor.getProject(projectId);
    },
    enabled: !!actor && !isFetching && projectId !== null,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      status: ProjectStatus;
      startDate: string;
      endDate: string;
      budget: bigint;
      clientId: bigint;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createProject(
        data.name,
        data.description,
        data.status,
        data.startDate,
        data.endDate,
        data.budget,
        data.clientId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProjectStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { projectId: bigint; status: ProjectStatus }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateProjectStatus(data.projectId, data.status);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId.toString()] });
    },
  });
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function useGetTask(taskId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Task>({
    queryKey: ['task', taskId?.toString()],
    queryFn: async () => {
      if (!actor || taskId === null) throw new Error('No actor or taskId');
      return actor.getTask(taskId);
    },
    enabled: !!actor && !isFetching && taskId !== null,
  });
}

export function useGetProjectTasks(taskIds: bigint[]) {
  const { actor, isFetching } = useActor();
  return useQuery<Task[]>({
    queryKey: ['tasks', taskIds.map(id => id.toString()).join(',')],
    queryFn: async () => {
      if (!actor) return [];
      const taskPromises = taskIds.map(id => actor.getTask(id));
      return Promise.all(taskPromises);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      projectId: bigint;
      title: string;
      assignee: string;
      dueDate: string;
      status: TaskStatus;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.createTask(data.projectId, data.title, data.assignee, data.dueDate, data.status);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { taskId: bigint; status: TaskStatus }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateTaskStatus(data.taskId, data.status);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export function useGetAllClients() {
  const { actor, isFetching } = useActor();
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClient(clientId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Client>({
    queryKey: ['client', clientId?.toString()],
    queryFn: async () => {
      if (!actor || clientId === null) throw new Error('No actor or clientId');
      return actor.getClient(clientId);
    },
    enabled: !!actor && !isFetching && clientId !== null,
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; phone: string; email: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.createClient(data.name, data.phone, data.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
