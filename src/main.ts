import { Task }  from "../src/taskFile"

export function main(commands: Array<string> = []) {

    if (commands.length === 0) {
        // Please use 'ADD' to add a new task.
        process.stdout.write("Error: No command provided.\n");
        return;
    }

    const command = commands[0].trim().toLocaleLowerCase();
        
    switch (command) {
        case 'add':
            
            if (!commands[1]) {
                process.stdout.write(`Error: missing task description\n`);
                return;
            }
            if (commands[1]) {
                process.stdout.write('Task added successfully\n')
                Task.initialization().then(() => {Task.add(commands[1])})

                
            }
            break;
        default:
            process.stdout.write("Error: Unknown command.\n");
    }
}