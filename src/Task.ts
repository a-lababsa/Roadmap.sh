export class Task implements Task {
  readonly id: number
  description: string
  status: string
  createdAt: Date
  updatedAt!: Date

  constructor(id: number, description: string) {
    this.id = id
    this.description = description
    this.status = "todo"
    this.createdAt = new Date()
  }

  setDescription(description: string): void {
    this.description = description
    this.updatedAt = new Date()
  }

  static hydrate(data: Partial<Task>): Task {
    if (typeof data.createdAt === "string") {
      data.createdAt = new Date(data.createdAt)
    }
    if (data.updatedAt && typeof data.updatedAt === "string") {
      data.updatedAt = new Date(data.updatedAt)
    }

    const task = new Task(data.id!, data.description!)
    Object.assign(task, data)
    return task
  }
}

export interface Task {
  readonly id: number
  description: string
  status: string
  createdAt: Date
  updatedAt: Date
}
