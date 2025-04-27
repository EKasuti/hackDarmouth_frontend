
export interface ProjectResource{
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}
export interface ProjectMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url: string;
    specialities: string;
}

export interface Timeline {
    id: string;
    title: string;
    description: string;
    startDate: Date | null;
    deadline: Date | null;
    assignees: [],
    priority: number;
    createdAt: Date;
    updatedAt: Date;
    status: 'todo' | 'in-progress' | 'done';
}

export interface ProjectTask {
    id: string;
    title: string;
    description: string;
    startDate: Date | null;
    deadline: Date | null;
    assignees: ProjectMember[],
    priority: number;
    timeline: boolean;
    createdAt: Date;
    updatedAt: Date;
    status: 'todo' | 'in-progress' | 'done';
}
export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    status: string;
    timeline: Timeline[];
    members: ProjectMember[];
    resources: ProjectResource[];
    tasks: ProjectTask[];
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}