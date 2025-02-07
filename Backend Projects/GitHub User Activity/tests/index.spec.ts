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

  describe("should call github api", () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    const args = ["node", "script.js", "alex"];
    const cli = new GithubActivity(args);

    it("should set userExist to true when user exists", async () => {
      // Arrange
      const activity = new GithubActivity(["node", "script.js", "validUser"]);
      (global.fetch as jest.Mock).mockResolvedValue({ status: 200 });

      // Act
      await activity.init();

      // Assert
      expect(activity.userExist).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/validUser/events"
      );
    });

    it('should set userExist to false when user does not exist', async () => {
      // Arrange
      const activity = new GithubActivity(['node', 'script.js', 'invalidUser']);
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Not found'));
  
      // Act
      await activity.init();
  
      // Assert
      expect(activity.userExist).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/invalidUser/events');
    });
  });
});
