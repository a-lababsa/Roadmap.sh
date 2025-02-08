import { Command } from "commander";

const program = new Command();

program.name('node-js-cli-with-commander').description('CLI to run expense tracker.').version('0.0.1')

program
  .name("expense-tracker")
  .description("Expense tracker to manage your finances")
  .argument("<add>", "add an expense with a description and amount")
  .option('-d, --description <STRING>', 'Expense description')
  .option('-a, --amount <NUMBER>', 'Expense amount')
  .action((numbers, options) => {
    console.log(numbers, options)
  })

  program.parse()
