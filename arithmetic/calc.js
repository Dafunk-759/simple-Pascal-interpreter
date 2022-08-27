const version = Number(process.argv[2])
const Interpreter = require("./calc" + version);

main();
async function main() {
  process.stdout.write("calc> ");
  for await (let raw of process.stdin) {
    let line = raw.toString();
    if (line !== "\n" && line.length > 0) {
      let interpreter = new Interpreter(line);
      try {
        console.log(interpreter.expr());
      } catch (err) {
        console.error(err);
      }
    }
    process.stdout.write("calc> ");
  }
}
