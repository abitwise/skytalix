// qe-ABC-209: does the D reading exercise the kept table? From cutechess-cli's `-debug all` log (the harness's d.out):
// 1. every engine instance `<name>(N)` (one OS process; restart=on) gets exactly one `ucinewgame` and one `quit`, so one
//    process plays one whole game: the table can persist across that game's moves;
// 2. each candidate instance's searches (a `go` not answered by `info string book`) are replayed through HEAD's own
//    `createGameTracker`, keyed exactly as `src/uci-session.ts` keys the accepted `position` line (the tokens before
//    `moves`, and the move tokens); a search whose token equals the previous search's keeps the table.
// Usage: node persist.mts <head root> <d.out or d.out.gz>
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
const [root, file] = process.argv.slice(2);
const { createGameTracker } = await import(`${root}/src/transposition.ts`);
const raw = readFileSync(file as string);
const text = ((file as string).endsWith(".gz") ? gunzipSync(raw) : raw).toString("utf8");
type Inst = { name: string; uci: number; newgame: number; quit: number; gos: { start: string; moves: string[]; book: boolean }[]; line: { start: string; moves: string[] } | null; lastGo: number };
const inst = new Map<string, Inst>();
const get = (k: string) => {
  let v = inst.get(k);
  if (!v) { v = { name: k.replace(/\(\d+\)$/, ""), uci: 0, newgame: 0, quit: 0, gos: [], line: null, lastGo: -1 }; inst.set(k, v); }
  return v;
};
for (const l of text.split("\n")) {
  const m = /^\d+ ([<>])(\w+\(\d+\)): (.*)$/.exec(l);
  if (!m) continue;
  const [, dir, k, body] = m as unknown as [string, string, string, string];
  const v = get(k);
  if (dir === ">") {
    if (body === "uci") v.uci++;
    else if (body === "ucinewgame") { v.newgame++; v.line = { start: "startpos", moves: [] }; }
    else if (body === "quit") v.quit++;
    else if (body.startsWith("position ")) {
      const tokens = body.split(/\s+/);
      const at = tokens.indexOf("moves");
      v.line = { start: tokens.slice(1, at === -1 ? undefined : at).join(" "), moves: at === -1 ? [] : tokens.slice(at + 1) };
    } else if (body.startsWith("go")) { v.gos.push({ ...(v.line as { start: string; moves: string[] }), book: false }); v.lastGo = v.gos.length - 1; }
  } else if (body === "info string book" && v.lastGo >= 0) (v.gos[v.lastGo] as { book: boolean }).book = true;
}
const byName: Record<string, { instances: number; notOneGame: number; searches: number; book: number; kept: number; cleared: number; firstOfGame: number; midGameClears: number }> = {};
for (const v of inst.values()) {
  const r = (byName[v.name] ??= { instances: 0, notOneGame: 0, searches: 0, book: 0, kept: 0, cleared: 0, firstOfGame: 0, midGameClears: 0 });
  r.instances++;
  if (v.uci !== 1 || v.newgame !== 1 || v.quit !== 1) r.notOneGame++;
  const track = createGameTracker();
  let prev: object | null = null;
  let first = true;
  for (const g of v.gos) {
    if (g.book) { r.book++; continue; }
    r.searches++;
    const t = track(g.start, g.moves);
    if (t === prev) r.kept++;
    else { r.cleared++; if (first) r.firstOfGame++; else r.midGameClears++; }
    prev = t; first = false;
  }
}
console.log(JSON.stringify(byName, null, 1));
for (const [n, r] of Object.entries(byName))
  console.log(`${n}: ${r.instances} processes, ${r.notOneGame} not exactly one game; ${r.searches} searches (+${r.book} book answers): ${r.kept} keep the table (${((100 * r.kept) / r.searches).toFixed(1)} %), ${r.cleared} clear (${r.firstOfGame} first-of-game, ${r.midGameClears} mid-game)`);
