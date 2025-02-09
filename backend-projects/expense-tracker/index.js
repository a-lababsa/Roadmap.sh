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
      await fs.writeFile(FILE_NAME, JSON.stringify([], null, 2));
      return [];
    }

    const data = await fs.readFile(FILE_NAME, { encoding: "utf-8" });
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to load expenses: ${error.message}`);
  }
}

async function saveExpenses(expensesToSave) {
  try {
    await fs.writeFile(FILE_NAME, JSON.stringify(expensesToSave, null, 2));
  } catch (error) {
    throw new Error(`Failed to save expenses: ${error.message}`);
  }
}

function generateId(currentExpenses) {
  if (currentExpenses.length === 0) return 1;
  const maxId = Math.max(...currentExpenses.map(e => e.id));
  return maxId + 1;
}

program
  .name("expense-tracker")
  .description("Expense tracker to manage your finances")
  .version("0.0.1");

program
  .command("add")
  .description("add an expense with a description and amount")
  .requiredOption("-d, --description <STRING>", "Expense description")
  .requiredOption("-a, --amount <NUMBER>", "Expense amount")
  .action(async (args) => {
    try {
      const amount = parseFloat(args.amount);
      if (isNaN(amount)) {
        throw new Error("Amount must be a valid number.");
      }

      expenses = await loadExpenses();
      const newExpense = {
        id: generateId(expenses),
        description: args.description,
        amount: amount,
        date: new Date().toLocaleDateString(),
      };

      expenses.push(newExpense);
      await saveExpenses(expenses);
      console.info(`Expense added successfully (ID: ${newExpense.id})`);
    } catch (error) {
      console.error("Error adding expense:", error.message);
      process.exit(1);
    }
  });

program
  .command("update")
  .description("update an expense")
  .requiredOption("-i, --id <NUMBER>", "expense identifier")
  .option("-d, --description <STRING>", "Expense description")
  .option("-a, --amount <NUMBER>", "Expense amount")
  .action(async (args) => {
    try {
      const id = parseInt(args.id);
      if (isNaN(id)) {
        throw new Error("ID must be a valid number.");
      }

      expenses = await loadExpenses();
      const index = expenses.findIndex(e => e.id === id);
      
      if (index === -1) {
        throw new Error(`No expense found with ID: ${id}`);
      }

      if (args.amount) {
        const amount = parseFloat(args.amount);
        if (isNaN(amount)) {
          throw new Error("Amount must be a valid number.");
        }
        expenses[index].amount = amount;
      }

      if (args.description) {
        expenses[index].description = args.description;
      }
      
      await saveExpenses(expenses);
      console.info(`Expense ${id} updated successfully`);
    } catch (error) {
      console.error("Error updating expense:", error.message);
      process.exit(1);
    }
  });

program
  .command("delete")
  .description("delete an expense")
  .requiredOption("-i, --id <NUMBER>", "expense identifier")
  .action(async (args) => {
    try {
      const id = parseInt(args.id);
      if (isNaN(id)) {
        throw new Error("ID must be a valid number.");
      }

      expenses = await loadExpenses();
      const initialLength = expenses.length;
      expenses = expenses.filter((e) => e.id !== id);
      
      if (expenses.length === initialLength) {
        throw new Error(`No expense found with ID: ${id}`);
      }

      await saveExpenses(expenses);
      console.info(`Expense ${id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting expense:", error.message);
      process.exit(1);
    }
  });

program
  .command("list")
  .description("view all expenses")
  .action(async () => {
    try {
      expenses = await loadExpenses();
      if (expenses.length === 0) {
        console.info("No expenses found");
        return;
      }

      console.info("\nID  DATE           DESCRIPTION      AMOUNT");
      console.info("--  ----           -----------      ------");
      expenses.forEach((e) => {
        console.info(
          `${e.id.toString().padEnd(4)} ${e.date.padEnd(14)} ${e.description.padEnd(15)} $${e.amount.toFixed(2)}`
        );
      });
      console.info(""); // Empty line for better readability
    } catch (error) {
      console.error("Error listing expenses:", error.message);
      process.exit(1);
    }
  });

program
  .command("summary")
  .description("view a summary of all expenses")
  .action(async () => {
    try {
      expenses = await loadExpenses();
      const totalExpense = expenses.reduce(
        (acc, current) => acc + current.amount,
        0
      );
      console.info(`\nTotal expenses: $${totalExpense.toFixed(2)}\n`);
    } catch (error) {
      console.error("Error calculating summary:", error.message);
      process.exit(1);
    }
  });

program.parse();