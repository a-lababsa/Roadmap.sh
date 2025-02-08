import { Command } from "commander";
import * as fs from "fs/promises";

const program = new Command();

const FILE_NAME = "expenses.json";

let expenses = [];

async function loadExpenses() {
  try {
    try {
      await fs.access(FILE_NAME);
    } catch {
      // File doesn't exist, create it with empty expenses array
      await fs.writeFile(FILE_NAME, JSON.stringify([], null, 2));
      return [];
    }

    const data = await fs.readFile(FILE_NAME, { encoding: "utf-8" });
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to load expenses: ${error.message}`);
  }
}

async function saveExpenses() {
  try {
    await fs.writeFile(FILE_NAME, JSON.stringify(expenses, null, 2));
  } catch (error) {
    throw new Error(`Failed to save expenses: ${error.message}`);
  }
}

program
  .name("node-js-cli-with-commander")
  .description("CLI to run expense tracker.")
  .version("0.0.1");

program
  .name("expense-tracker")
  .description("Expense tracker to manage your finances");

program
  .command("add")
  .description("add an expense with a description and amount")
  .option("-d, --description <STRING>", "Expense description")
  .option("-a, --amount <NUMBER>", "Expense amount")
  .action(async (args) => {
    expenses = await loadExpenses();

    let expene = {};
    if (args.description) {
      expene.description = args.description;
    }
    if (args.amount) {
      expene.amount = args.amount;
    }
    expenses.push(expene)
    await saveExpenses();
  });

program.parse();
