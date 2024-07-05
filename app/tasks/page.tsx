"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskList from "@/components/tasks/task-list";
import useAuthStore from "@/src/stores/useAuthStore";
import useTaskStore from "@/src/stores/useTaskStore";

export default function Tasks() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { tasks, getTasks } = useTaskStore();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      getTasks();
    }
  }, [token, router, getTasks]);

  return (
    <div className="flex flex-col h-screen p-6 bg-slate-900 text-white">
      <TaskList tasks={tasks} />
    </div>
  );
}
