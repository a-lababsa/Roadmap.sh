import { Task } from "./Task"
import { TaskRepository } from "./TaskRepository"

interface Command {
  execute(commands: string[]): Promise<void>
}

class AddCommand implements Command {
  async execute(commands: string[]): Promise<void> {
    if (!commands[1]) {
      process.stderr.write("Error: missing description.\n")
      return
    }
    const taskId = await TaskRepository.create(commands[1])
    process.stdout.write(`Task added successfully (ID: ${taskId})\n`)
  }
}

class ListCommand implements Command {
  async execute(commands: string[]): Promise<void> {
    const status = commands[1]?.trim().toLowerCase()

    let tasksToDisplay = await TaskRepository.list(status)

    if (tasksToDisplay.length > 0) {
      tasksToDisplay.forEach((task) => {
        process.stdout.write(
          `Task ID: ${task.id}\nTask Description: ${task.description}\nStatus: ${task.status}\n\n`
        )
      })
    } else {
      process.stdout.write("No tasks to display.\n")
    }
  }
}

class UpdateCommand implements Command {
  async execute(commands: string[]): Promise<void> {
    if (!commands[1] || !commands[2]) {
      process.stderr.write("Error: missing ID or description.\n")
      return
    }
    const id = Number(commands[1])
    if (isNaN(id)) {
      process.stderr.write("Error: ID must be a number.\n")
      return
    }
    await TaskRepository.update(id, commands[2])
    process.stdout.write(`Task with ID: ${id} updated successfully.`)
  }
}

class DeleteCommand implements Command {
  async execute(commands: string[]): Promise<void> {
    if (!commands[1]) {
      process.stderr.write("Error: missing ID.\n")
      return
    }
    const id = Number(commands[1])
    if (isNaN(id)) {
      process.stderr.write("Error: ID must be a number.\n")
      return
    }
    await TaskRepository.delete(id)
    process.stdout.write(`Task with ID: ${id} deleted successfully.`)
  }
}

class InProgressCommand implements Command {
  async execute(commands: string[]): Promise<void> {
    if (!commands[1]) {
      process.stderr.write("Error: missing ID.\n")
      return
    }
    const id = Number(commands[1])
    if (isNaN(id)) {
      process.stderr.write("Error: ID must be a number.\n")
      return
    }
    await TaskRepository.updateStatus(id, 'in-progress')
  }
  
}

class DoneCommand implements Command {
  async execute(commands: string[]): Promise<void> {
    if (!commands[1]) {
      process.stderr.write("Error: missing ID.\n")
      return
    }
    const id = Number(commands[1])
    if (isNaN(id)) {
      process.stderr.write("Error: ID must be a number.\n")
      return
    }
    await TaskRepository.updateStatus(id, 'done')
  }
}
export const commandMap: Record<string, Command> = {
  add: new AddCommand(),
  list: new ListCommand(),
  update: new UpdateCommand(),
  delete: new DeleteCommand(),
  'mark-in-progress': new InProgressCommand(),
  'mark-done': new DoneCommand(),
}
