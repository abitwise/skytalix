import { readFileSync } from "node:fs";
const parse = (f) => readFileSync(f, "utf8").split("\n").filter((l) => /^LADDER (GAME|PAIR|A5) /.test(l)).map((l) => {
  const [, kind, json] = l.match(/^LADDER (\w+) (.*)$/); const o = JSON.parse(json);
  delete o.wallS; delete o.load1; delete o.commit; return `${kind} ${JSON.stringify(o)}`; });
const a = parse(process.argv[2]), b = parse(process.argv[3]);
console.log(`lines ${a.length} vs ${b.length}; equal (minus wall/load1/commit): ${JSON.stringify(a) === JSON.stringify(b)}`);
a.forEach((l, i) => { if (l !== b[i]) console.log(`DIFF ${i}\n  ${l}\n  ${b[i]}`); });
const games = b.filter((l) => l.startsWith("GAME ")).map((l) => JSON.parse(l.slice(5)));
console.log(`games ${games.length}; errors ${games.filter((g) => g.result === "error").length}; max plies ${Math.max(...games.map((g) => g.plies))}; claimed ${games.filter((g) => g.reason.endsWith("(claimed)")).length}; fivefold/75 ${games.filter((g) => /fivefold|seventy-five/.test(g.reason)).length}`);
const tally = {}; for (const g of games) tally[g.reason] = (tally[g.reason] ?? 0) + 1; console.log(tally);
for (const l of b.filter((l) => l.startsWith("PAIR "))) { const p = JSON.parse(l.slice(5)); console.log(p.pair, p.games, p.score, p.claimedDraws, p.digest, p.mode, p.step); }
