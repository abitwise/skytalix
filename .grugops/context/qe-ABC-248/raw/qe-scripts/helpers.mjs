// qe-ABC-248 A4: each named helper's definition (from its `const|function <name>` line to the first line at the
// same indent that closes it) is byte-identical at B and H. usage: node helpers.mjs <B> <H>
import { readFileSync } from "node:fs";
const [B, H] = process.argv.slice(2);
const names = ["talk", "dialogue", "rig", "session220", "virtualClock", "instrument", "probes", "fenOf", "parseInfo"];
const files = ["src/uci-session.test.ts", "src/search.null-move.test.ts"];
const defs = (text) => {
  const lines = text.split("\n"), out = {};
  for (const n of names) {
    const re = new RegExp(`^(\\s*)(export )?(const|let|function|async function) ${n}\\b`);
    const hits = [];
    lines.forEach((l, i) => { const m = re.exec(l); if (m) { const ind = m[1]; let j = i; if (!/[;]\s*$/.test(l)) { j = i + 1; while (j < lines.length && !(lines[j].startsWith(`${ind}}`) || lines[j].startsWith(`${ind})`)) ) j++; } hits.push(lines.slice(i, j + 1).join("\n")); } });
    if (hits.length) out[n] = hits;
  }
  return out;
};
for (const f of files) {
  const b = defs(readFileSync(`${B}/${f}`, "utf8")), h = defs(readFileSync(`${H}/${f}`, "utf8"));
  for (const n of new Set([...Object.keys(b), ...Object.keys(h)])) {
    const same = JSON.stringify(b[n]) === JSON.stringify(h[n]);
    console.log(`${f} ${n}: defs B ${b[n]?.length ?? 0} H ${h[n]?.length ?? 0} lines ${b[n]?.map((d) => d.split("\n").length).join("+")} ${same ? "BYTE-IDENTICAL" : "DIFFERS"}`);
  }
}
for (const n of names) { const where = files.filter((f) => readFileSync(`${H}/${f}`, "utf8").match(new RegExp(`(const|let|function) ${n}\\b`))); if (!where.length) console.log(`${n}: not defined in either test file (imported or production)`); }
