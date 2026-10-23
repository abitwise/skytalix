// Fault injection for pgn-file.ts only: write fails EFBIG, then the cleanup unlink fails EACCES.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
const [W, scratch] = process.argv.slice(2);
const fake = `import * as fs from "node:fs";
export * from "node:fs";
const err = (code) => Object.assign(new Error(code + " injected"), { code });
export function writeFileSync(target, ...rest) { if (typeof target === "number") throw err("EFBIG"); return fs.writeFileSync(target, ...rest); }
export function unlinkSync() { throw err("EACCES"); }`;
const hook = `data:text/javascript,${encodeURIComponent(`import { registerHooks } from "node:module";
registerHooks({ resolve(specifier, context, next) {
  if (specifier === "node:fs" && context.parentURL && context.parentURL.endsWith("/src/pgn-file.ts"))
    return { url: "data:text/javascript," + encodeURIComponent(${JSON.stringify(fake)}), shortCircuit: true };
  return next(specifier, context); } });`)}`;
const cwd = mkdtempSync(join(scratch, "unlinkfault-"));
const r = spawnSync(process.execPath, ["--import", hook, join(W, "src/cli.ts"), "--colour", "white", "--difficulty", "1"], { cwd, input: "resign\n", encoding: "utf8", env: { PATH: process.env.PATH } });
console.log("exit", r.status);
console.log("stdout tail", JSON.stringify(r.stdout.split("\n").slice(-4)));
console.log("stderr", JSON.stringify(r.stderr));
console.log("games/", existsSync(join(cwd, "games")) ? readdirSync(join(cwd, "games")) : null);
rmSync(cwd, { recursive: true, force: true });
