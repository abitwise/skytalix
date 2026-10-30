// qe-ABC-230 redaction (ADR-0049 d4 pattern): every path to redact is computed at run time, so this file carries none.
// usage: node redact.mjs <srcFile> <dstFile> <worktree> <scratch>   (CUTECHESS_CLI, STOCKFISH from the environment)
// Then scans dst for leaks; exit 2 on a leak.
import { readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir, hostname, userInfo } from "node:os";
import { dirname } from "node:path";

const [src, dst, wt, scr] = process.argv.slice(2);
const pairs = [
  [scr, "<scratchpad>/qe-230"],
  [wt, "<worktree>"],
  [process.env.CUTECHESS_CLI, "<cutechess-cli>"],
  [process.env.CUTECHESS_CLI && dirname(process.env.CUTECHESS_CLI), "<local build dir>"],
  [process.env.STOCKFISH, "<stockfish>"],
  [realpathSync(process.execPath), "<node>"],
  [process.execPath, "<node>"],
  [scr.split("/").slice(0, 3).join("/"), "<tmp>"],
  [homedir(), "<home>"],
  [hostname(), "<host>"],
  [userInfo().username, "<user>"],
].filter(([k]) => k);
let text = readFileSync(src, "utf8");
for (const [k, v] of pairs) text = text.split(k).join(v);
writeFileSync(dst, text);
// The patterns are joined at run time so that this file itself carries no path-like literal.
const leaks = [["", "home", ""], ["", "tmp", ""], ["", "usr", "local"], [".nvm"], [userInfo().username], [hostname()], ["<tmp>"], ["<home>"]]
  .map((p) => p.join("/"))
  .filter((s) => text.includes(s));
if (leaks.length > 0) {
  console.error(`LEAK in ${dst}: ${leaks.join(", ")}`);
  process.exit(2);
}
