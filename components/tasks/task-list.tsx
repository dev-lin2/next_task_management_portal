"use client";
import { useEffect, useState } from "react";
import { Task } from "@/src/models/Task";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import CreateForm from "./create-form";
import { useUsers } from "@/utils/useUsers";
import EditForm from "./edit-form";
import useTaskStore from "@/src/stores/useTaskStore";
import { Input } from "../ui/input";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps): JSX.Element {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const { deleteTask, completeTask } = useTaskStore();

  const { users, getUsers } = useUsers();
  useEffect(() => {
    getUsers();
  }, []);

  const columns: ColumnDef<Task, any>[] = [
    {
      accessorKey: "_id",
      header: "Id",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTask(row.original);
              setIsEditFormOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Implement delete functionality
              confirm("Are you sure you want to delete this task?") && deleteTask(row.original._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={row.original.isCompleted}
            onClick={() => {
              confirm("Do you want to mark this task as completed?") && completeTask(row.original._id);
            }}
          >
            <Check className={row.original.isCompleted ? "bg-green-600 h-4 w-4" : "h-4 w-4"} />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-slate-900 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Tasks</h1>
        <Button onClick={() => setIsCreateFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>
      <div className="w-60 my-4 text-black">
        <Input
          placeholder="Search"
          onChange={(e) => {
            const search = e.target.value;
            setFilteredTasks(tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase())));
          }}
        />
      </div>
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-slate-700">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-300 font-semibold py-3 px-4">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-700 hover:bg-slate-700">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 text-slate-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-300">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isCreateFormOpen && (
        <CreateForm
          users={users}
          task={selectedTask}
          onClose={() => {
            setIsCreateFormOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
      {isEditFormOpen && (
        <EditForm
          users={users}
          task={selectedTask}
          onClose={() => {
            setIsEditFormOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
