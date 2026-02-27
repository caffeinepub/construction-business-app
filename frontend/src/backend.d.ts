import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: bigint;
    status: TaskStatus;
    assignee: string;
    title: string;
    dueDate: string;
    projectId: bigint;
}
export interface Client {
    id: bigint;
    name: string;
    email: string;
    phone: string;
    projectIds: Array<bigint>;
}
export interface Project {
    id: bigint;
    status: ProjectStatus;
    clientId: bigint;
    taskIds: Array<bigint>;
    endDate: string;
    name: string;
    description: string;
    budget: bigint;
    startDate: string;
}
export enum ProjectStatus {
    completed = "completed",
    inProgress = "inProgress",
    planning = "planning"
}
export enum TaskStatus {
    done = "done",
    toDo = "toDo",
    inProgress = "inProgress"
}
export interface backendInterface {
    createClient(name: string, phone: string, email: string): Promise<bigint>;
    createProject(name: string, description: string, status: ProjectStatus, startDate: string, endDate: string, budget: bigint, clientId: bigint): Promise<bigint>;
    createTask(projectId: bigint, title: string, assignee: string, dueDate: string, status: TaskStatus): Promise<bigint>;
    getAllClients(): Promise<Array<Client>>;
    getAllProjects(): Promise<Array<Project>>;
    getClient(clientId: bigint): Promise<Client>;
    getProject(projectId: bigint): Promise<Project>;
    getTask(taskId: bigint): Promise<Task>;
    updateProjectStatus(projectId: bigint, newStatus: ProjectStatus): Promise<void>;
    updateTaskStatus(taskId: bigint, newStatus: TaskStatus): Promise<void>;
}
