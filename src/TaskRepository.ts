import * as fs from "fs/promises"
import { Task } from "./Task"

export interface ITaskStruct {
  tasks: Task[]
}

export class TaskRepository {
  private static readonly FILE_NAME = "tasks.json"
  private static taskStruct: ITaskStruct = { tasks: [] }

  private static async loadTasks(): Promise<void> {
    try {
      try {
        await fs.stat(TaskRepository.FILE_NAME)
      } catch {
        await fs.writeFile(
          TaskRepository.FILE_NAME,
          JSON.stringify(TaskRepository.taskStruct, null, 2)
        )
      }

      const data = await fs.readFile(TaskRepository.FILE_NAME, {
        encoding: "utf8",
      })
      const parsedData = JSON.parse(data)
      TaskRepository.taskStruct.tasks = parsedData.tasks.map((task: object) =>
        Task.hydrate(task)
      )
    } catch (error: any) {
      throw new Error(`Error during initialization: ${error.message}`)
    }
  }

  private static async saveTasks(): Promise<void> {
    try {
      await fs.writeFile(
        TaskRepository.FILE_NAME,
        JSON.stringify(TaskRepository.taskStruct, null, 2)
      )
    } catch (error) {
      throw new Error(`Error saving task file: ${error}`)
    }
  }

  public static async create(description: string): Promise<number> {
    await TaskRepository.loadTasks()
    const taskId =
      Math.max(...TaskRepository.taskStruct.tasks.map((t) => t.id), 0) + 1
    const newTask = new Task(taskId, description)
    TaskRepository.taskStruct.tasks.push(newTask)
    await TaskRepository.saveTasks()
    return taskId
  }

  public static async update(id: number, description: string): Promise<void> {
    await TaskRepository.loadTasks()
    const task = TaskRepository.find(id)
    if (task) {
      task.setDescription(description)
      await TaskRepository.saveTasks()
    } else {
      throw new Error(`Task with ID: ${id} not found`)
    }
  }

  public static async delete(id: number): Promise<void> {
    await TaskRepository.loadTasks()
    const index = TaskRepository.taskStruct.tasks.findIndex((t) => t.id === id)
    if (index !== -1) {
      TaskRepository.taskStruct.tasks.splice(index, 1)
      await TaskRepository.saveTasks()
    } else {
      throw new Error(`Task with ID: ${id} not found`)
    }
  }

  public static async list(status?: string): Promise<Task[]> {
    await TaskRepository.loadTasks()
    const validStatuses = ["todo", "done", "in-progress"]
    if (status && validStatuses.includes(status)) {
      return TaskRepository.taskStruct.tasks.filter((t) => t.status === status)
    } else if (status && !validStatuses.includes(status)) {
      return []
    }
    return TaskRepository.taskStruct.tasks
  }

  private static find(id: number): Task | undefined {
    return TaskRepository.taskStruct.tasks.find((t) => t.id === id)
  }
}
