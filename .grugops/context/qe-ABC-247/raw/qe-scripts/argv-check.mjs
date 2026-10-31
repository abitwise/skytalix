// qe-ABC-247 A1 (d): per argv of an rpair dry-run print, the token count and placement per engine group.
// usage: node argv-check.mjs <dry-run print>
import { readFileSync } from "node:fs";
const TOKEN = "option.Skill Level=6";
const blocks = [];
for (const line of readFileSync(process.argv[2], "utf8").split("\n")) {
  if (line.endsWith("cutechess-cli argv:")) blocks.push({ header: line, argv: [] });
  else if (line.startsWith("  ") && blocks.length > 0) blocks.at(-1).argv.push(line.slice(2));
}
let bad = 0;
for (const { header, argv } of blocks) {
  const groups = [];
  argv.forEach((a, i) => { if (a === "-engine") groups.push({ at: i, items: [] }); else if (a.startsWith("-") && groups.length) groups.at(-1).closed = true; else if (groups.length && !groups.at(-1).closed) groups.at(-1).items.push(a); });
  const names = groups.map((g) => g.items.find((x) => x.startsWith("name=")));
  const sky = groups.find((g) => g.items.includes("name=skytalix"));
  const sf = groups.find((g) => g.items.includes("name=stockfish"));
  const total = argv.filter((a) => a.includes("Skill Level")).length;
  const inSky = sky.items.filter((a) => a === TOKEN).length;
  const inSf = sf.items.filter((a) => a.includes("Skill Level")).length;
  const after = sky.items[sky.items.indexOf(TOKEN) - 1];
  const ok = total === 1 && inSky === 1 && inSf === 0 && after === "restart=on" && names.join(",") === "name=skytalix,name=stockfish";
  if (!ok) bad++;
  console.log(`${ok ? "ok " : "BAD"} ${header} | groups ${names.join(",")} | Skill Level total ${total}, skytalix ${inSky}, stockfish ${inSf}, before-token '${after}'`);
}
console.log(`argvs ${blocks.length}, bad ${bad}`);
