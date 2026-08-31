"use client";

import React, { useState } from "react";
import { TaskItem } from "@/types/api-todo";

interface ApiTodoListProps {
  initialTasks: TaskItem[];
}

export default function ApiTodoList({ initialTasks }: ApiTodoListProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  const handleToggleTask = async (id: number, currentCompleted: boolean) => {
    const targetStatus = !currentCompleted;

    // 1. Optimistic Update di State Lokal
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: targetStatus } : t)),
    );

    // 2. Simulasi Update ke DummyJSON langsung via fetch (tanpa service layer)
    try {
      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: targetStatus }),
      });
    } catch (err) {
      console.warn(
        "Simulasi update ke API DummyJSON gagal (fallback state):",
        err,
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Daftar Tugas</h2>
        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
          {tasks.length} item
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-400 text-sm">Tidak ada tugas.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id, task.completed)}
              className={`group flex items-start sm:items-center justify-between p-4 rounded-xl border
                transition-all cursor-pointer select-none ${
                  task.completed
                    ? "bg-green-50 border-green-200 hover:border-green-300"
                    : "bg-white border-gray-200 hover:border-blue-300"
                }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 pr-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="mt-0.5 sm:mt-0 h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
                />
                <div>
                  <p
                    className={`text-xs md:text-sm font-medium leading-relaxed transition-all ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800 group-hover:text-blue-700"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] text-gray-400 sm:hidden mt-1">
                    ID #{task.id} • User #{task.userId}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                  ID: #{task.id}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                  User: {task.userId}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    task.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.completed ? "Selesai" : "Pending"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
