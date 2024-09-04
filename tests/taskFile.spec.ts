import * as fs from "fs/promises";
import { Task } from "../src/taskFile";

jest.mock("fs/promises");

describe("Task management functions", () => {
  let mockWrite: jest.SpyInstance;
  let mockWriteFile: jest.MockedFunction<typeof fs.writeFile>;

  beforeEach(() => {
    Task.taskStruct.tasks = [];
    mockWrite = jest
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true)
    mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("save function", () => {
    it("should write taskStruct to file successfully", async () => {
      mockWriteFile.mockResolvedValue(undefined);

      await Task.save();

      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledWith(
        "tasks.json",
        JSON.stringify(Task.taskStruct)
      );
    });

    it("should throw an error when writing fails", async () => {
      mockWriteFile.mockRejectedValue(
        new Error("Error: task file initialization: Mocked error")
      );

      await expect(Task.save()).rejects.toThrow(
        "Error: task file initialization: Mocked error"
      );
    });
  });

  describe("add function", () => {
    it("should add a new task to taskStruct", async () => {
      mockWriteFile.mockResolvedValue(undefined);
      const description = "New task description";

      await Task.add(description)

      expect(Task.taskStruct.tasks).toHaveLength(1);
      expect(Task.taskStruct.tasks[0].description).toEqual( description );
    });

    it("should throw an error if save fails", async () => {
      mockWriteFile.mockRejectedValue(
        new Error("Error: task file initialization: Mocked error")
      );
      
      const description = "Another task";

      await expect(Task.add(description)).rejects.toThrow("Error: task file initialization: Mocked error");
      expect(Task.taskStruct.tasks).toHaveLength(1);
      expect(Task.taskStruct.tasks[0].description).toEqual( description );
    });

    it("should add two new task to taskStruct", async () => {
      mockWriteFile.mockResolvedValue(undefined);
      
      const taskOne = "task one"
      const taskTwo = "task two"

      await Task.add(taskOne)
      await Task.add(taskTwo)

      expect(Task.taskStruct.tasks).toHaveLength(2)
    })
  });
});
