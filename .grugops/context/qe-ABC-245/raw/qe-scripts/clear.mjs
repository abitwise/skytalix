// Block until the host is clear (host.mjs waitClear); print the reading. usage: node clear.mjs <label> <logFile>
import { appendFileSync } from "node:fs";
import { waitClear } from "./host.mjs";
const [label, file] = process.argv.slice(2);
const r = waitClear(label, (s) => appendFileSync(file, `${new Date().toISOString()} ${s}\n`));
console.log(`${new Date().toISOString()} ${label} clear load1=${r.l.toFixed(2)} tctl=${r.t.toFixed(1)}`);
