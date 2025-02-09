import { Command } from "commander";
import readLine from "readline";
const program = new Command();

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const inRange = (choice, min, max) => choice >= min && choice <= max;

const difficultyMap = {
  1: { name: "Easy", attempts: 10 },
  2: { name: "Medium", attempts: 5 },
  3: { name: "Hard", attempts: 3 },
};

program
  .name("Number Guessing Game")
  .description("Simple number guessing game to test your luck.")
  .version("1.0.0")
  .action(async () => {
    console.info("\nWelcome to the Number Guessing Game!");
    console.info("I'm thinking of a number between 1 and 100.");
    console.info("You have 5 chances to guess the correct number.");

    console.info("\nPlease select the difficulty level:");
    console.info("1. Easy (10 chances)");
    console.info("2. Medium (5 chances)");
    console.info("3. Hard (3 chances)");

    let choice;
    const secretNumber = Math.floor(Math.random() * 100) + 1;
    console.log(secretNumber);
    do {
      choice = await question("\nEnter your choice: ");
      choice = parseInt(choice);

      if (isNaN(choice) || !inRange(choice, 1, 3)) {
        console.info("Please enter a number between 1 and 3");
      }
    } while (isNaN(choice) || !inRange(choice, 1, 3));

    console.info(
      `\nGreat! You have selected the ${difficultyMap[choice].name} difficulty level.`
    );
    console.info("Let's start the game!");

    let attempts = 0;

    let guess;
    do {
      if (attempts === difficultyMap[choice].attempts) {
        console.log(
          `\nGame Over! The number was ${secretNumber}. Better luck next time!`
        );
        process.exit(0);
      }
      attempts++;
      
      guess = await question("\nEnter your guess: ");

      if (isNaN(guess) || !inRange(guess, 1, 100)) {
        console.info("Please enter a valid number between 1 and 100.");
      }

      if (guess > secretNumber) {
        console.log(`\nIncorrect! The number is less than ${guess}.`);
      } else if (guess < secretNumber) {
        console.log(`\nIncorrect! The number is greater than ${guess}.`);
      }
    } while (guess != secretNumber);

    console.log(
      `\nCongratulations! You guessed the correct number in ${attempts} attempts.`
    );
    process.exit(0);
  });

program.parse(process.argv);
