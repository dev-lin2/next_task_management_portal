import { Task } from "@/src/models/Task";
import { Badge } from "../ui/badge";
import { differenceInDays, isValid, parseISO } from "date-fns";

interface TaskBoardProps {
  tasks: Task[];
  columns: string[];
  taskCounts: {
    "To Do": number;
    "In Progress": number;
    Done: number;
  };
}

export default function TaskBoard({ tasks, columns, taskCounts }: TaskBoardProps): JSX.Element {
  const getDateBadge = (dueDate: string | undefined, isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <Badge variant="default" className="bg-green-500">
          Completed
        </Badge>
      );
    }

    if (!dueDate) {
      return null;
    }

    const today = new Date();
    const dueDateObj = parseISO(dueDate);

    if (!isValid(dueDateObj)) {
      console.error(`Invalid date: ${dueDate}`);
      return null;
    }

    const daysDiff = differenceInDays(dueDateObj, today);

    if (daysDiff >= 0) {
      return (
        <Badge variant="default" className="bg-purple-500">
          {daysDiff === 0 ? "Due today" : `${daysDiff} day${daysDiff !== 1 ? "s" : ""} left`}
        </Badge>
      );
    } else {
      const overdueDays = Math.abs(daysDiff);
      return (
        <Badge variant="default" className="bg-red-500">
          {overdueDays} day{overdueDays !== 1 ? "s" : ""} overdue
        </Badge>
      );
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-white">Task Board</h1>
      <div className="flex flex-1 gap-6 overflow-x-auto">
        {columns.map((column) => (
          <div key={column} className="flex-1 min-w-[300px] bg-slate-800 rounded-lg p-4 overflow-y-scroll">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
              {column}
              <Badge variant="outline" className="ml-2 text-white bg-green-600">
                {taskCounts[column as keyof typeof taskCounts]}
              </Badge>
            </h2>
            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <div key={task._id} className="bg-slate-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-white">{task.title}</h3>
                    <p className="text-sm text-slate-300 mb-4">{task.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {task.assignees.map((user) => (
                        <Badge key={user._id} variant="secondary" className="text-xs">
                          {user.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-end">{getDateBadge(task.dueDate.toString(), task.isCompleted)}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
