import { ApiTodo, TaskItem } from "@/types/api-todo";

interface TodosApiResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}

export function formatApiTodoToTask(raw: ApiTodo): TaskItem {
  return {
    id: raw.id,
    title: raw.todo, // Mapping properti 'todo' -> 'title'
    completed: raw.completed,
    userId: raw.userId,
    source: "dummyjson-api",
  };
}

export async function getTasks(params?: {
  limit?: number;
  skip?: number;
}): Promise<{
  tasks: TaskItem[];
  total: number;
  limit: number;
  skip: number;
}> {
  const { limit = 15, skip = 0 } = params || {};

  try {
    const response = await fetch(
      `https://dummyjson.com/todos?limit=${limit}&skip=${skip}`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      throw new Error(`Gagal memuat data (${response.status})`);
    }

    const data: TodosApiResponse = await response.json();
    const tasks = data.todos.map(formatApiTodoToTask);

    return {
      tasks,
      total: data.total,
      limit: data.limit,
      skip: data.skip,
    };
  } catch (error) {
    console.error("[lib/tasks.ts] Error mengambil tasks dari API:", error);
    throw error;
  }
}

export async function getTaskById(
  id: number | string,
): Promise<TaskItem | null> {
  try {
    const response = await fetch(`https://dummyjson.com/todos/${id}`);

    if (!response.ok) {
      throw new Error(`Gagal memuat task (${response.status})`);
    }

    const raw: ApiTodo = await response.json();
    return formatApiTodoToTask(raw);
  } catch (error) {
    console.error(`[lib/tasks.ts] Error mengambil task ID ${id}:`, error);
    return null;
  }
}

export function getTaskStats(tasks: TaskItem[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionPercentage,
  };
}
