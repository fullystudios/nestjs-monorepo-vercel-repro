#!/usr/bin/env tsx

import { exec } from "node:child_process";
import { promisify } from "node:util";
import { Listr } from "listr2";

const execAsync = promisify(exec);

async function main() {
  const isFresh = process.argv.includes("--fresh");

  const tasks = new Listr([
    {
      title: "Start Docker containers",
      task: async (_, task) => {
        task.output = "Starting postgres and keto...";
        await execAsync("pnpm docker:up", { cwd: process.cwd() });
        task.output = "Docker containers ready";
      },
    },
    {
      title: "Build application",
      task: async (_, task) => {
        task.output = "Compiling TypeScript...";
        await execAsync("pnpm build", { cwd: process.cwd() });
        task.output = "Build completed";
      },
    },
    {
      title: "Seed database",
      task: async (_, task) => {
        const args = isFresh ? "seed:database -- --fresh" : "seed:database";
        task.output = isFresh
          ? "Seeding with fresh database..."
          : "Seeding database...";

        // Run the CLI command and stream output
        const { stdout } = await execAsync(`node dist/src/cli.js ${args}`, {
          cwd: process.cwd(),
        });

        // Show the output from the actual seeding command
        if (stdout) {
          task.output = stdout.trim();
        }
      },
    },
  ]);

  try {
    await tasks.run();
    console.log("\n✓ All tasks completed successfully!\n");
  } catch (error) {
    console.error("\n✗ Error during execution:", error);
    process.exit(1);
  }
}

main();
