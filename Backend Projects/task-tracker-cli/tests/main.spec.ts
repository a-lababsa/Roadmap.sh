import { main } from "../src/main"
import { commandMap } from "../src/Command"

jest.mock("../src/Command", () => ({
  commandMap: {
    add: { execute: jest.fn() },
    list: { execute: jest.fn() },
    update: { execute: jest.fn() },
    delete: { execute: jest.fn() },
  },
}))

describe("main function", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(process.stdout, "write").mockImplementation(() => true)
    jest.spyOn(process.stderr, "write").mockImplementation(() => true)
  })

  afterEach(() => {
    jest.clearAllMocks();
    (process.stdout.write as jest.Mock).mockRestore();
    (process.stderr.write as jest.Mock).mockRestore()
  })

  test("should display error if no command is provided", async () => {
    await main([])
    expect(process.stderr.write).toHaveBeenCalledWith("Error: No command provided.\n")
  })

  test("should display error if an unknown command is provided", async () => {
    await main(["unknown"])
    expect(process.stderr.write).toHaveBeenCalledWith("Error: Unknown command.\n")
  })

  test("should execute the 'add' command successfully", async () => {
    await main(["add", "New Task"])
    expect(commandMap.add.execute).toHaveBeenCalledWith(["add", "New Task"])
  })

  test("should execute the 'list' command successfully", async () => {
    await main(["list"])
    expect(commandMap.list.execute).toHaveBeenCalledWith(["list"])
  })

  test("should execute the 'update' command successfully", async () => {
    await main(["update", "1", "Updated Task"])
    expect(commandMap.update.execute).toHaveBeenCalledWith(["update", "1", "Updated Task"])
  })

  test("should execute the 'delete' command successfully", async () => {
    await main(["delete", "1"])
    expect(commandMap.delete.execute).toHaveBeenCalledWith(["delete", "1"])
  })

  test("should display error if a command throws an error", async () => {
    const error = new Error("Test error")
    ;(commandMap.add.execute as jest.Mock).mockRejectedValue(error)
    await main(["add", "New Task"])
    expect(process.stderr.write).toHaveBeenCalledWith(`Error: ${error}\n`)
  })
})
