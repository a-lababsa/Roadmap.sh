import * as fs from "fs/promises";

export module Task {
  const FILE_NAME = "tasks.json";

  interface Task {
    id: number;
    description: string;
    status: string; // enum ?
    createdAt: Date;
    updatedAt: Date;
  }

  interface TaskStruct {
    tasks: Task[];
  }

  export let taskStruct: TaskStruct = {
    tasks: [] as Task[],
  };

  export async function save(): Promise<void> {
    try {
      return fs.writeFile(FILE_NAME, JSON.stringify(taskStruct));
    } catch (error) {
      process.stdout.write(`Error: task file initialization: ${error}`);
      throw error;
    }
  }

  export async function initialization() {
    const tasks = await fs.stat(FILE_NAME).then(
      () => {
        // console.log("file existe")
        return fs.readFile(FILE_NAME);
      },
      () => {
        // console.log("file doesn't existe")
        return fs.writeFile(FILE_NAME, JSON.stringify(taskStruct));
      }
    );

    if (tasks instanceof Buffer) {
      taskStruct = JSON.parse(tasks.toString()) as TaskStruct;
    }
  }

  export async function add(description: string): Promise<void> {
    const latestId: number = Math.max(...taskStruct.tasks.map(task => task.id)) | 0;
    taskStruct.tasks.push({
      id: latestId + 1,
      description,
      createdAt: new Date()
    } as Task);
    
    return await save();
  }
}
