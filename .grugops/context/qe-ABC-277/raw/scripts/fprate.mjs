import { spawnSync } from "node:child_process";
const { classes } = await import(process.argv[2]);
const fa = classes().filter((c) => c.name === "foreign-argv");
const homeCls = classes().filter((c) => c.name === "home-path" || c.name === "home-slug" || c.name === "scratch-path");
const r = spawnSync("git", ["grep", "-I", "-n", "-E", "[0-9]{2,7} +", "main", "--", ".grugops", "plans", "memory-bank"], { encoding: "utf8", maxBuffer: 1 << 30 });
let lines = 0, alsoHome = 0; const files = new Set();
for (const l of r.stdout.split("\n")) {
  const m = /^main:([^:]+):\d+:(.*)$/.exec(l); if (!m) continue;
  fa[0].re.lastIndex = 0;
  if (fa[0].re.test(m[2])) { lines++; files.add(m[1]); if (homeCls.some((c) => { c.re.lastIndex = 0; return c.re.test(m[2]); })) alsoHome++; }
}
console.log(`foreign-argv over main text records: ${lines} lines in ${files.size} files; ${alsoHome} of those lines also hit home/slug/scratch`);
