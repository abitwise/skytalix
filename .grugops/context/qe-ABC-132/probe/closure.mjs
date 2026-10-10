// QE ABC-132: measure render-seam.ts load closure + per-frame loads; check result-screen.ts / cli.ts absent.
// Usage: node closure.mjs <srcDir>
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
let loaded = [];
registerHooks({ load(url, ctx, next) { loaded.push(url); return next(url, ctx); } });
const seen = () => loaded.filter((u) => u.startsWith("file:")).map((u) => u.slice(u.lastIndexOf("/") + 1).replace(/\?.*$/, ""));
const src = pathToFileURL(process.argv[2].replace(/\/?$/, "/")).href;
const { makeRenderSeam } = await import(new URL("render-seam.ts", src).href);
const closure = [...new Set(seen())].sort();
const { gameStatusOf, newGame, playMove } = await import(new URL("history.ts?fixture", src).href);
const { legalMoves } = await import(new URL("legal.ts", src).href);
const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const games = [newGame(FEN), newGame(FEN)];
for (let i = 0, s = 7; i < 40; i++) { const m = legalMoves(games[1].position); if (!m.length) break; s = (s * 1103515245 + 12345) & 0x7fffffff; playMove(games[1], m[s % m.length]); }
const statuses = games.map((g) => gameStatusOf(g));
const frameSets = {};
for (const mode of ["ascii", "unicode"]) for (const orient of ["white-bottom", "black-bottom"]) {
  const seam = makeRenderSeam(mode, orient);
  loaded = [];
  games.forEach((g, i) => seam(g, statuses[i], i === 1, []));
  for (let t = 0; t < 5; t++) await new Promise((r) => setImmediate(r));
  frameSets[`${mode}/${orient}`] = [...new Set(seen())];
}
loaded = [];
await import(new URL("result-screen.ts?control", src).href);
const control = seen();
console.log(JSON.stringify({ closure, closureSize: closure.length, perFrame: frameSets,
  resultScreenInClosure: closure.includes("result-screen.ts"), cliInClosure: closure.includes("cli.ts"),
  resultScreenPerFrame: Object.values(frameSets).some((s) => s.includes("result-screen.ts")),
  positiveControlSeesResultScreen: control.includes("result-screen.ts") }, null, 1));
