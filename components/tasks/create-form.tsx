import { useState, useEffect } from "react";
import { Task } from "@/src/models/Task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import useTaskStore from "@/src/stores/useTaskStore";
import { User } from "@/src/models/User";
import useAuthStore from "@/src/stores/useAuthStore";

interface CreateFormProps {
  task: Task | null;
  onClose: () => void;
  users: User[];
}

export default function CreateForm({ task, onClose, users }: CreateFormProps) {
  const { createTask, updateTask } = useTaskStore();
  const [assignees, setAssignees] = useState<string[]>();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<Task>({
    _id: "",
    title: "",
    description: "",
    status: "To Do",
    isCompleted: false,
    assignees: [],
    dueDate: new Date(),
  });

  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      userId: user?._id,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      isCompleted: formData.isCompleted,
      dueDate: date,
      assignees: assignees,
    };
    createTask(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Create Task</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className="text-white">
            Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, title: val.target.value }));
            }}
            placeholder="Title"
            className="mb-4 text-black"
          />

          <label htmlFor="description" className="text-white">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, description: val.target.value }));
            }}
            placeholder="Description"
            className="mb-4 text-black"
          />

          <label htmlFor="assignees" className="text-white">
            Assignees
          </label>
          <MultipleSelector
            onChange={(val) => {
              if (val) {
                setAssignees(val.map((v) => v.value));
              }
            }}
            defaultOptions={users.map((user) => ({ label: user.name, value: user._id }))}
            placeholder="Select Users"
            className="bg-white"
          />

          <label htmlFor="status" className="text-white">
            Status
          </label>
          <Select
            onValueChange={(val) => {
              setFormData((prev) => ({ ...prev, status: val }));
            }}
          >
            <SelectTrigger className="text-black">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>

          <label htmlFor="due_date" className="text-white my-2">
            Due Date
          </label>
          <div className="my-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[280px] justify-start text-left text-black font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 ">
                <Calendar className="" mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2 py-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
