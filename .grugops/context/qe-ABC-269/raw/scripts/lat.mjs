// latency go -> bestmove per engine from cutechess -debug all (ms timestamps first field)
import { readFileSync } from "node:fs";
const L = readFileSync(process.argv[2], "utf8").split("\n"); const go = {}; const lat = {};
for (const l of L) { const m = l.match(/^(\d+) ([<>])(\w+)\(\d+\): (go |bestmove)/); if (!m) continue;
  const [, t, dir, who] = m; if (dir === ">") go[who] = +t; else if (go[who] !== undefined) { (lat[who] ??= []).push(+t - go[who]); delete go[who]; } }
for (const [w, a] of Object.entries(lat)) { a.sort((x, y) => x - y); console.log(w, "moves", a.length, "median", a[a.length >> 1], "max", a[a.length - 1], ">150", a.filter((x) => x > 150).length, ">600", a.filter((x) => x > 600).length); }
