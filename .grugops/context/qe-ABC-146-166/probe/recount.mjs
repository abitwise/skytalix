import { readFileSync } from "node:fs";
const lines = readFileSync(process.argv[2], "utf8").split("\n");
const games = [], pairs = [];
for (const l of lines) {
  let i = l.indexOf("LADDER GAME {"); if (i >= 0) { games.push(JSON.parse(l.slice(i + 12))); continue; }
  i = l.indexOf("LADDER PAIR {"); if (i >= 0) pairs.push(JSON.parse(l.slice(i + 12)));
}
console.log("GAME", games.length, "PAIR", pairs.length, "order", pairs.map(p => p.pair).join(","));
console.log("modes", [...new Set([...games, ...pairs].map(x => x.mode))]);
console.log("commits", [...new Set(pairs.map(p => p.commit))]);
// game order vs pair order: GAME lines for a pair are printed before its PAIR line
let seq = []; for (const l of lines) { const m = l.match(/LADDER (GAME|PAIR) .*?"pair":"(\dv\d)"/); if (m) seq.push(m[1][0] + m[2]); }
const runs = []; for (const s of seq) { if (!runs.length || runs.at(-1).k !== s) runs.push({ k: s, n: 1 }); else runs.at(-1).n++; }
console.log("sequence", runs.map(r => `${r.k}x${r.n}`).join(" "));
let totalGameWall = 0;
for (const p of pairs) {
  const g = games.filter(x => x.pair === p.pair);
  const s = p.stronger;
  let w = 0, d = 0, l = 0, score = 0; const reasons = {}; let claimed = 0, bad = 0;
  const seeds = new Set(); const sched = [];
  for (const x of g) {
    if (x.result === "draw") { d++; score += 0.5; }
    else if (x.result === "error") bad++;
    else if ((x.result === "white-wins") === (x.white === s)) { w++; score += 1; } else l++;
    reasons[x.reason] = (reasons[x.reason] ?? 0) + 1;
    if (x.reason.endsWith("(claimed)")) claimed++;
    seeds.add(x.seed); sched.push(`${x.seed}:${x.white}-${x.black}`);
    if (![x.white, x.black].includes(s)) bad++;
  }
  // expected schedule
  const weaker = Number(p.pair[0]);
  const exp = []; for (let k = 1; k <= p.games / 2; k++) { exp.push(`${k}:${s}-${weaker}`); exp.push(`${k}:${weaker}-${s}`); }
  const schedOk = JSON.stringify(exp) === JSON.stringify(sched);
  const strongWhite = g.filter(x => x.white === s).length;
  const pct = 100 * score / g.length;
  const met = p.criterion === "A1" ? pct >= 90 : pct > 50;
  const gw = g.reduce((a, x) => a + x.wallS, 0); totalGameWall += gw;
  const dr = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
  console.log(JSON.stringify({ pair: p.pair, n: g.length, wdl: [w, d, l], score: `${score}/${g.length}`, pct, met: met ? "MET" : "RED",
    lineWdl: p.stronger_w_d_l, lineScore: p.score, linePct: p.scorePct, lineVerdict: p.verdict, bar: p.bar,
    wdlEq: JSON.stringify([w,d,l]) === JSON.stringify(p.stronger_w_d_l), scoreEq: `${score}/${g.length}` === p.score,
    pctEq: Number(pct.toFixed(1)) === p.scorePct, verdictEq: (met ? "MET" : "RED") === p.verdict,
    claimed, lineClaimed: p.claimedDraws, reasons, reasonsEq: dr(reasons, p.reasons), errors: bad,
    seeds: `${Math.min(...seeds)}..${Math.max(...seeds)}`, lineSeeds: p.seeds, schedOk, strongWhite,
    gamesField: p.games, step: p.step, sumGameWallS: Number(gw.toFixed(1)), pairWallS: p.wallS, load1: p.load1, digest: p.digest,
    plies: [Math.min(...g.map(x=>x.plies)), Math.max(...g.map(x=>x.plies))] }));
}
console.log("sumGameWall", totalGameWall.toFixed(1), "sumPairWall", pairs.reduce((a, p) => a + p.wallS, 0).toFixed(1));
