import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Task } from "../models/Task";
import useAuthStore from "./useAuthStore";

interface TaskState {
  tasks: Task[];
  getTasks: () => Promise<void>;
  createTask: (task: any) => Promise<void>;
  updateTask: (task: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  assignTask: (taskId: string, userIds: string[]) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

const useTaskStore = create<TaskState>()(
  immer((set) => ({
    tasks: [],
    getTasks: async () => {
      const token = useAuthStore.getState().token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tasks = await response.json();
      set({ tasks });
    },
    createTask: async (task: any) => {
      const token = useAuthStore.getState().token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      const createdTask = await response.json();
      set((state) => {
        state.tasks.push(createdTask);
      });
    },
    updateTask: async (task) => {
      const token = useAuthStore.getState().token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      const updatedTask = await response.json();
      set((state) => {
        const index = state.tasks.findIndex((t: Task) => t._id === updatedTask._id);
        if (index !== -1) state.tasks[index] = updatedTask;
      });
    },
    deleteTask: async (id) => {
      const token = useAuthStore.getState().token;
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => {
        state.tasks = state.tasks.filter((t: Task) => t._id !== id);
      });
    },
    assignTask: async (taskId, userIds) => {
      const token = useAuthStore.getState().token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignees: userIds }),
      });
      const updatedTask = await response.json();
      set((state) => {
        const index = state.tasks.findIndex((t: Task) => t._id === updatedTask._id);
        if (index !== -1) state.tasks[index] = updatedTask;
      });
    },
    completeTask: async (id) => {
      const token = useAuthStore.getState().token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: true }),
      });
      const updatedTask = await response.json();
      set((state) => {
        const index = state.tasks.findIndex((t: Task) => t._id === updatedTask._id);
        if (index !== -1) state.tasks[index] = updatedTask;
      });
    },
  }))
);

export default useTaskStore;
