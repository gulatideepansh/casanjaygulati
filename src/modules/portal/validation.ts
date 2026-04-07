import { z } from "zod";

export const taskPriorityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const taskStatusValues = ["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED"] as const;

export const createTaskSchema = z.object({
  assignedToUserId: z.string().trim().min(1, "Assigned user is required."),
  title: z.string().trim().min(3, "Task title is required.").max(120, "Task title is too long."),
  description: z
    .string()
    .trim()
    .min(10, "Task description must be at least 10 characters long.")
    .max(1200, "Task description is too long."),
  priority: z.enum(taskPriorityValues),
  dueDate: z.string().trim().min(1, "Due date is required.")
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().trim().min(1, "Task is required."),
  status: z.enum(taskStatusValues)
});
