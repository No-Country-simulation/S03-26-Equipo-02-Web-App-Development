export const API_URL = import.meta.env.VITE_API_URL || "https://s03-26-equipo-02-web-app-development.onrender.com";

export interface TaskPayload {
  contactId: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  expirationDate: string | Date;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  priority?: "high" | "medium" | "low";
  expirationDate?: string | Date;
  complete?: boolean;
}

export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Error fetching tasks");
  return res.json();
};

export const createTask = async (data: TaskPayload) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating task");
  return res.json();
};

export const updateTask = async (taskId: string, data: TaskUpdatePayload) => {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error updating task");
  return res.json();
};

export const deleteTask = async (taskId: string) => {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting task");
  return true;
};
