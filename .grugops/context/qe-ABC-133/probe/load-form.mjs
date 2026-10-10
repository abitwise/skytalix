// QE ABC-133: CPU of loading `typescript` alone in plain node, by form. Usage: node load-form.mjs <repo> <cjs|esm>
import { createRequire } from "node:module";
const [root, form] = process.argv.slice(2);
const t0 = process.cpuUsage();
const ts = form === "esm" ? (await import(`${root}/node_modules/typescript/lib/typescript.js`)).default : createRequire(`${root}/package.json`)("typescript");
const u = process.cpuUsage(t0);
console.log(`${form} ${ts.version} ${((u.user + u.system) / 1000).toFixed(1)}`);
