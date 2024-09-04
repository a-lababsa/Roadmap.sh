import { main } from "../src/main";

describe("CLI Add function", () => {
    let mockWrite: jest.SpyInstance;

    beforeEach(() => {
        mockWrite = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test("should write error to stdout when no task description is provided", () => {
        main(["add"]);
        
        expect(mockWrite).toHaveBeenCalledWith("Error: missing task description\n");
    })

    test("should write error to stdout for uppercase command without description", () => {
        main(["ADD"]);
        
        expect(mockWrite).toHaveBeenCalledWith("Error: missing task description\n");
    })

    test("should write error to stdout when task description is empty", () => {
        main(["add", ""])

        expect(mockWrite).toHaveBeenCalledWith("Error: missing task description\n");
    })


    test("should write success", () => {
        main(["add", `"task"`])

        expect(mockWrite).toHaveBeenCalledWith("Task added successfully\n");
    })

    test("should write success", () => {
        main(["add", `"code tracker cli"`])

        expect(mockWrite).toHaveBeenCalledWith("Task added successfully\n");
    })
})