import { GithubActivity } from "..";

describe("Github-activity", () => {
  it("should have username as first parameter ", () => {
    const args = process.argv;

    expect(() => {
      new GithubActivity(args);
    }).toThrow("Username is required as first parameter");
  });

  it("should accept valid username", () => {
    const args = ["node", "script.js", "alex"];
    const cli = new GithubActivity(args);
    expect(cli.username).toBe("alex");
  });
});
