#! /usr/bin/env node

import { error } from "console";

console.info("Github Activity");

export class GithubActivity {
  userExist: boolean;
  username: string;

  constructor(args: string[]) {
    const username = args[2];

    if (!username) {
      throw new Error("Username is required as first parameter");
    }
    this.username = username;
    this.userExist = false;
  }

  async init() {
    try {
      // https://api.github.com/users/USERNAME/
      const response = await fetch(
        `https://api.github.com/users/${this.username}/events`
      );

      if (response.status === 200) {
        this.userExist = true;
        console.info(`User found !!!`);
      } else {
        console.info("User not found !!!");
      }
    } catch (error) {
      
      this.userExist = false;
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
