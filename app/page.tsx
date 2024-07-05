"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TaskBoard from "@/components/dashboard/task-board";
import useAuthStore from "@/src/stores/useAuthStore";
import useTaskStore from "@/src/stores/useTaskStore.bak";

function Dashboard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { tasks, getTasks } = useTaskStore();
  const [ emulatedTasks, setEmulatedTasks ] = useState(tasks);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      getTasks();
    }
  }, [token, router, getTasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      setEmulatedTasks(tasks);
    }
  }, [tasks]);

  const columns = useMemo(() => ["To Do", "In Progress", "Done"], []);

  const taskCounts = useMemo(
    () => ({
      "To Do": tasks.filter((task) => task.status === "To Do").length,
      "In Progress": tasks.filter((task) => task.status === "In Progress").length,
      Done: tasks.filter((task) => task.status === "Done").length,
    }),
    [tasks]
  );

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>
      <TaskBoard tasks={emulatedTasks} columns={columns} taskCounts={taskCounts} />
    </div>
  );
}

export default Dashboard;
