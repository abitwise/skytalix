// fa-measure.mjs — ABC-278 A4: foreign-argv hits over the text record files at a revision, before
// (the ABC-277 pattern, copied below) and after (the pattern of the checkout's records-path-check.js).
// Prints counts and, for each newly hit line, `<file>:<line> <shape> <also-another-class>` only, the
// file path redacted by the classes. Never a line's text.
// Usage (from the repository root): node .grugops/context/se-ABC-278/raw/fa-measure.mjs [rev=main]
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const rev = process.argv[2] ?? "main";
const { classes } = await import(pathToFileURL(resolve("tools/grugops/records-path-check.js")).href);
const list = classes();
const fa = list.find((c) => c.name === "foreign-argv").re;
const others = list.filter((c) => c.name !== "foreign-argv");
const OLD =
  /(?<![A-Za-z0-9._:/=-])\d{2,7} +(?:\/[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+ +\S|[a-z][a-z0-9._+-]* +\/[A-Za-z0-9._+-]+\/[A-Za-z0-9._+-])/;
// The new shapes, one by one, to name which matched (same building blocks as the check).
const PID = String.raw`(?<![A-Za-z0-9._:/=-])`;
const ABS = String.raw`\/[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+`;
const ABS_ARG = String.raw`\/[A-Za-z0-9._+-]+\/[A-Za-z0-9._+-]`;
const CMD = String.raw`[a-z][a-z0-9._+-]*`;
const FLAG = String.raw`--?[A-Za-z0-9][^\s]*`;
const PS_CMD = `(?:${ABS}(?![A-Za-z0-9._+/-])|${CMD} +${ABS_ARG})`;
const SHAPES = {
  c: new RegExp(`${PID}\\d{2,7} +${CMD} +(?:${FLAG} +)+${ABS_ARG}`),
  d: new RegExp(`${PID}\\d{2,7} +${ABS}(?= *$|[\\]\`])`),
  e: new RegExp(`${PID}\\d{1,7} +\\d{1,7} +\\d{1,3} +\\S+ +\\S+ +(?:\\d+-)?\\d+:\\d\\d:\\d\\d +${PS_CMD}`),
  f: new RegExp(`${PID}\\d{1,7} +\\d+\\.\\d +\\d+\\.\\d +\\d+ +\\d+ +\\S+ +\\S+ +\\S+ +\\d+:\\d\\d +${PS_CMD}`),
};
const test = (/** @type {RegExp} */ re, /** @type {string} */ s) => {
  re.lastIndex = 0;
  return re.test(s);
};
const redact = (/** @type {string} */ p) => list.reduce((o, c) => o.replace(new RegExp(c.re.source, "g"), `<${c.name}>`), p);

const files = spawnSync("git", ["ls-tree", "-r", "-z", "--name-only", rev, "--", ".grugops", "plans", "memory-bank"], {
  encoding: "utf8",
  maxBuffer: 1 << 30,
}).stdout.split("\0").filter(Boolean);
const r = spawnSync("git", ["grep", "-I", "-n", "-z", "-E", "[0-9] +", rev, "--", ".grugops", "plans", "memory-bank"], {
  encoding: "utf8",
  maxBuffer: 1 << 30,
});
let before = 0;
let after = 0;
let lost = 0;
const newly = [];
// -z: `<rev>:<path>\0<line>\0<text>\n`
for (const rec of r.stdout.split("\n")) {
  const parts = rec.split("\0");
  if (parts.length < 3) continue;
  const path = (parts[0] ?? "").slice(rev.length + 1);
  const n = parts[1];
  const text = parts.slice(2).join("\0");
  const o = OLD.test(text);
  const a = test(fa, text);
  if (o) before++;
  if (a) after++;
  if (o && !a) lost++;
  if (a && !o) {
    const shape = Object.entries(SHAPES).filter(([, re]) => re.test(text)).map(([k]) => k).join("") || "?";
    const also = others.some((c) => test(c.re, text)) ? "also-other" : "only-argv";
    newly.push(`${redact(path)}:${n} ${shape} ${also}`);
  }
}
console.log(`rev ${rev}: ${files.length} record files; foreign-argv lines before ${before}, after ${after}; newly hit ${newly.length}; no longer hit ${lost}`);
for (const l of newly) console.log(`new ${l}`);
