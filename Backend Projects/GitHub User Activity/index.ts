console.info("Github Activity")

export class GithubActivity {
    username: string

    constructor(args: string[]) {
        const username = args[2]

        if (!username) {
            throw new Error('Username is required as first parameter') 
        }
        this.username = username
    }
}