import { commandMap } from "../src/Command" 
import { Task } from "../src/Task" 
import { TaskRepository } from "../src/TaskRepository" 

jest.mock("../src/TaskRepository") 

describe("Command tests", () => {
  beforeEach(() => {
    jest.clearAllMocks() 
    jest.spyOn(process.stdout, "write").mockImplementation(() => true) 
    jest.spyOn(process.stderr, "write").mockImplementation(() => true) 
  }) 

  describe("AddCommand", () => {
    test("should add task successfully", async () => {
      (TaskRepository.create as jest.Mock).mockResolvedValueOnce(1) 
      await commandMap.add.execute(["add", "Test Task"]) 
      expect(TaskRepository.create).toHaveBeenCalledWith("Test Task") 
      expect(process.stdout.write).toHaveBeenCalledWith(
        "Task added successfully (ID: 1)\n"
      ) 
    }) 

    test("should display error if description is missing", async () => {
      await commandMap.add.execute(["add"]) 
      expect(process.stderr.write).toHaveBeenCalledWith(
        "Error: missing description.\n"
      ) 
    }) 
  }) 

  describe("ListCommand", () => {
    test("should list tasks correctly", async () => {
        const task1 = new Task(1, "eat") 
        task1.status = "todo" 
        const task2 = new Task(2, "sleep") 
        task2.status = "done" 
        const tasks: Task[] = [task1, task2];
        (TaskRepository.list as jest.Mock).mockResolvedValue(tasks) 
        await commandMap.list.execute(["list"])
        expect(process.stdout.write).toHaveBeenCalledWith(
          `Task ID: 1\nTask Description: eat\nStatus: todo\n\n`
        ) 
        expect(process.stdout.write).toHaveBeenCalledWith(
          `Task ID: 2\nTask Description: sleep\nStatus: done\n\n`
        ) 
      })

    test("should display 'No tasks to display.' if no tasks are found", async () => {
      (TaskRepository.list as jest.Mock).mockResolvedValue([]) 
      await commandMap.list.execute(["list"]) 
      expect(process.stdout.write).toHaveBeenCalledWith(
        "No tasks to display.\n"
      ) 
    })
  }) 

  describe("UpdateCommand", () => {
    test("should update task successfully", async () => {
      await commandMap.update.execute(["update", "1", "New Description"]) 
      expect(TaskRepository.update).toHaveBeenCalledWith(1, "New Description") 
      expect(process.stdout.write).toHaveBeenCalledWith(
        "Task with ID: 1 updated successfully."
      ) 
    }) 

    test("should display error if ID or description is missing", async () => {
      await commandMap.update.execute(["update"]) 
      expect(process.stderr.write).toHaveBeenCalledWith(
        "Error: missing ID or description.\n"
      ) 
    }) 

    test("should display error if ID is not a number", async () => {
      await commandMap.update.execute([
        "update",
        "not-a-number",
        "New Description",
      ]) 
      expect(process.stderr.write).toHaveBeenCalledWith(
        "Error: ID must be a number.\n"
      ) 
    }) 
  }) 

  describe("DeleteCommand", () => {
    test("should delete task successfully", async () => {
      await commandMap.delete.execute(["delete", "1"]) 
      expect(TaskRepository.delete).toHaveBeenCalledWith(1) 
      expect(process.stdout.write).toHaveBeenCalledWith(
        "Task with ID: 1 deleted successfully."
      ) 
    }) 

    test("should display error if ID is missing", async () => {
      await commandMap.delete.execute(["delete"]) 
      expect(process.stderr.write).toHaveBeenCalledWith("Error: missing ID.\n") 
    }) 

    test("should display error if ID is not a number", async () => {
      await commandMap.delete.execute(["delete", "not-a-number"]) 
      expect(process.stderr.write).toHaveBeenCalledWith(
        "Error: ID must be a number.\n"
      ) 
    }) 
  }) 
}) 
