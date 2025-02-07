#! /usr/bin/env node

const API_BASE_URL = 'https://api.github.com';

/**
 * Class to handle GitHub user activity
 */
export class GithubActivity {
  private username: string;

  constructor(args: string[]) {
    const username = args[2];
    if (!username) {
      throw new Error("Please provide a GitHub username.");
    }
    this.username = username;
  }

  /**
   * Initialize and fetch user events
   * @returns Promise<void>
   */
  async init(): Promise<void> {
    const events = await this.fetchUserEvents();
    this.displayEvents(events);
  }

  private async fetchUserEvents(): Promise<any[]> {
    const response = await fetch(
      `${API_BASE_URL}/users/${this.username}/events`
    );

    if (!response.ok) {
      if(response.status === 404) {
        throw new Error("User not found. Please check the username");
      }
      throw new Error(`Error fetching data: ${response.status}`);
    }

    return response.json();
  }

  private displayEvents(events: any[]): void {
    console.info(`Recent activity for ${this.username}:`);
    events.forEach(event => {
      console.info(`- ${event.type} at ${event.created_at}`);
    });
  }
}

async function main() {
  try {
    const cli = new GithubActivity(process.argv);
    await cli.init();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn(error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

main();