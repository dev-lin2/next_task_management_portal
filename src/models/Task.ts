import { User } from "./User";

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    isCompleted: boolean;
    dueDate: Date;
    owner?: User;
    assignees: User[];
}