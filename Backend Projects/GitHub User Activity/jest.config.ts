import { JestConfigWithTsJest } from "ts-jest";

export default {
    testEnvironment: "node",
    moduleDirectories: ['node_modules'],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {}],
      },
    verbose: true
} as JestConfigWithTsJest