import { registerHooks } from "node:module";
let loaded = [];
registerHooks({ load(url, context, nextLoad) { loaded.push(url); return nextLoad(url, context); } });
const seen = () => loaded.filter((u) => u.startsWith("file:")).map((u) => u.slice(u.lastIndexOf("/") + 1).replace(/\?.*$/, ""));
const [root] = process.argv.slice(2);
const mod = await import(root);
const closure = seen();
let frames = null;
if (mod.makeRenderSeam) {
  const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const { gameStatusOf, newGame, playMove } = await import(new URL("history.ts?fixture", root).href);
  const { legalMoves } = await import(new URL("legal.ts", root).href);
  const g = [newGame(START), newGame(START)]; let seed = 0x2f6e2b1;
  for (let p = 0; p < 40; p++) { const m = legalMoves(g[1].position); seed = (seed * 1103515245 + 12345) & 0x7fffffff; playMove(g[1], m[seed % m.length]); }
  const seam = mod.makeRenderSeam("ascii", "white-bottom");
  frames = g.map((h) => seam(h, gameStatusOf(h), false, []).length);
}
console.log(JSON.stringify({ root: root.slice(root.lastIndexOf("/") + 1), closureSize: closure.length, historyAtLoad: closure.includes("history.ts"), frames }));
