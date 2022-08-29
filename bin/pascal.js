const path = require("path");
const fs = require("fs/promises");
const pkg = require("../package.json");
const { Command } = require("commander");
const program = new Command();
const pascal = require("../pascal/Pascal");

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .argument("[sources...]", "sourcefiles")
  .action(async (str, options) => {
    await main(str, options);
  });

program.parse();

async function main(files, options) {
  if (files.length > 0) {
    let source;
    try {
      source = await Promise.all(
        files
          .map((fp) => path.join(process.cwd(), fp))
          .map((p) => fs.readFile(p, "utf-8"))
      );
    } catch (err) {
      console.error("Read file fail.");
      console.error(err.message);
      return;
    }

    source.forEach((code) => {
      try {
        new pascal.Interpreter(code).eval();
      } catch (err) {
        console.error(err);
      }
    });
  } else {
    await repl();
  }
}

async function repl() {
  process.stdout.write("pascal> ");
  for await (let raw of process.stdin) {
    let line = raw.toString();
    if (line !== "\n" && line.length > 0) {
      try {
        console.log(new pascal.Interpreter(line).eval());
      } catch (err) {
        console.error(err);
      }
    }
    process.stdout.write("pascal> ");
  }
}
