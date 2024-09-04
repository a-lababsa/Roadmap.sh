import { commandMap } from "./Command" 

export async function main(commands: Array<string> = []) {
  if (commands.length === 0) {
    process.stderr.write("Error: No command provided.\n") 
    return 
  }

  const command = commands[0].trim().toLowerCase()
  const cmd = commandMap[command] 

  if (cmd) {
    try {
      await cmd.execute(commands) 
    } catch (err) {
      process.stderr.write(`Error: ${err}\n`) 
    }
  } else {
    process.stderr.write("Error: Unknown command.\n") 
  }
}
