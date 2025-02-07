#! /usr/bin/env node

console.info("Github Activity");

export class GithubActivity {
  userExist: boolean;
  username: string;

  constructor(args: string[]) {
    const username = args[2];

    if (!username) {
      throw new Error("Please provide a GitHub username.");
    }
    this.username = username;
    this.userExist = false;
  }

  async init():Promise<void> {
    try {
      const response = await fetch(
        `https://api.github.com/users/${this.username}/events`
      );

      if (response.status === 200) {
        this.userExist = true;
        console.info(`User found !!!`);
      } else {
        console.info("User not found !!!");
      }

      if (!response.ok) {
        if(response.status === 404){
          throw new Error("User not found. Please check the username");
       }
       else{
          throw new Error(`Error fetching data ${response.status}`);
       }  
      }

    } catch (error) {
      this.userExist = false;
      if (error instanceof Error) {
        console.warn(error.message);
      } else {
        console.error(error);
      }
    }
  }
}

try {
  const cli = new GithubActivity(process.argv);
  cli.init();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.warn(error.message);
  } else {
    console.error(error);
  }
}
