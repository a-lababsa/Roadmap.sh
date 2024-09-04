import { main } from "../src/main"

describe("CLI main function", () => {
    let mockWrite: jest.SpyInstance

    beforeEach(() => {
        mockWrite = jest.spyOn(process.stdout, "write").mockImplementation(() => true)
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    test("should write error message when no command is provided", () => {
        main()
        
        expect(mockWrite).toHaveBeenCalledWith("Error: No command provided.\n");
    })

    test("should write error message for unknown command", () => {
        main(["unknown"])
        
        expect(mockWrite).toHaveBeenCalledWith("Error: Unknown command.\n")
    })
})