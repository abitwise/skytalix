// Usage: node summarize.mjs plants-base.out.txt plants-head.out.txt  -> one row per plant
import { readFileSync } from "node:fs";
const parse = (f) => { const rows = new Map(); let cur;
  for (const l of readFileSync(f, "utf8").split("\n")) {
    const m = l.match(/^== (.*?)(   load1 ([\d.]+).*|  ABORTED.*)$/);
    if (m) { cur = { name: m[1], load1: m[3] ?? "-", res: m[2].includes("ABORTED") ? "ABORTED" : "", why: [], lines: [] }; rows.set(cur.name, cur); continue; }
    if (!cur) continue;
    const t = l.match(/^ +Tests +(.*)/); if (t) cur.res = /failed/.test(t[1]) ? `RED ${t[1].replace(/ passed.*/, "").replace(/\s+/g, " ")}` : `GREEN ${t[1].match(/\d+ passed/)[0]}`;
    const a = l.match(/AssertionError: (child_process specifier|calls that resolve)/); if (a) cur.why.push(a[1].startsWith("child") ? "(i)" : "(ii)");
    const x = l.match(/AssertionError: (?!child_process|calls)(.{0,90})/); if (x) cur.why.push(`OTHER:${x[1]}`);
    const e = l.match(/^\s*(?:Error|TypeError|ReferenceError|SyntaxError): (.{0,90})/); if (e) cur.why.push(`ERR:${e[1]}`);
    const ln = l.match(/❯ src\/cli\.test\.ts:(\d+)/); if (ln) cur.lines.push(ln[1]);
    const n = l.match(/^\s+× (.*)/); if (n && !/N8-LANE — this file spawns/.test(n[1])) cur.why.push(`ROW:${n[1].slice(0, 60)}`);
  } return rows; };
const [b, h] = process.argv.slice(2).map(parse);
for (const [name, r] of h) { const br = b.get(name);
  console.log(`${name.padEnd(68).slice(0, 68)} | base ${(br?.res ?? "?").padEnd(16)} ${(br?.why ?? []).join(",").padEnd(6)} | head ${r.res.padEnd(16)} ${r.why.join(",")} ${r.lines.join("/")} | load1 ${r.load1}`); }
