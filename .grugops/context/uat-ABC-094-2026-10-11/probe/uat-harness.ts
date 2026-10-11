// UAT ABC-094 — a throwaway acceptance harness for the book probe. It is an authoring aid, not a
// committed spec: this repository has no browser e2e lane, so there is no uat/*.uat.spec.ts.
//
// Usage:  node uat-harness.ts <tree root> <scratch dir>            -> every scenario, PASS/FAIL lines
//         node uat-harness.ts <tree root> <scratch dir> walk <seed> -> (child) JSON book walks, for S3
//         node uat-harness.ts <tree root> <scratch dir> fail <path> <result file>
//                                                                   -> (child) S6/S7 one bad-book case
//
// What it exercises: the module's PUBLIC API only (createBookProbe -> inBook / bookMove), against
// the REAL compiled artifact data/opening-book/book.json, with positions reached through the game's
// own record (newGame + playMove), the path a real game will use. Damaged books are COPIES of the
// real artifact, written under <scratch dir> (outside the repository). The checked-in artifact is
// only read; its sha256 is checked before and after.
//
// The warn sink is bound to process.stderr by THIS HARNESS in the S6/S7 children. That binding is
// the harness's, not delivered code: ABC-095's composition root owns it (QE-094-a).
//
// Scenarios, seeds and pass criteria were fixed before the first run (see the UAT pack note).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const [ROOT, SCRATCH, MODE = "all", ...REST] = process.argv.slice(2);
if (!ROOT || !SCRATCH) throw new Error("usage: uat-harness.ts <tree root> <scratch dir> [mode]");
const at = (rel: string) => pathToFileURL(`${ROOT}/${rel}`).href;

// The book must never go online (S8). Network globals become counters BEFORE the probe loads.
const net = { calls: 0 };
for (const name of ["fetch", "WebSocket", "XMLHttpRequest", "EventSource"]) {
  (globalThis as Record<string, unknown>)[name] = () => {
    net.calls++;
    throw new Error(`${name} called`);
  };
}

const { createBookProbe } = await import(at("src/book.ts"));
const { legalMoves } = await import(at("src/legal.ts"));
const { newGame, playMove, keyHistory } = await import(at("src/history.ts"));
const { parseFen } = await import(at("src/fen.ts"));
const { seededRandom } = await import(at("src/levels.ts"));
const { squareName } = await import(at("src/position.ts"));
const { zobristKey } = await import(at("src/zobrist.ts"));

// biome-ignore lint/suspicious/noExplicitAny: harness
type Any = any;
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const KIWIPETE = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const ARTIFACT = `${ROOT}/data/opening-book/book.json`;
const PROMO = ["", "", "n", "b", "r", "q"];
const uci = (m: Any): string => `${squareName(m.from)}${squareName(m.to)}${PROMO[m.promotion] ?? ""}`;
const hex = (p: Any): string => zobristKey(p).toString(16).padStart(16, "0");
const realRead = () => new Uint8Array(readFileSync(ARTIFACT));
const FILE = JSON.parse(new TextDecoder().decode(realRead())) as {
  positions: Record<string, { m: [string, number][]; n?: string }>;
};

/** A game reached through the game's own record, move by move, from UCI text. */
function game(line: string[], fen = START) {
  const h = newGame(fen);
  for (const t of line) {
    const mv = legalMoves(h.position).find((c: Any) => uci(c) === t);
    if (!mv) throw new Error(`game: ${t} is not legal after ${line.join(" ")}`);
    playMove(h, mv);
  }
  return h;
}

/** A probe on any reader, counting reads, warnings and random draws. */
function probe(read: () => Uint8Array, random: () => number) {
  const warnings: string[] = [];
  const counts = { reads: 0, draws: 0 };
  const p = createBookProbe({
    read: () => {
      counts.reads++;
      return read();
    },
    warn: (m: string) => warnings.push(m),
    random: () => {
      counts.draws++;
      return random();
    },
  });
  return { p, warnings, counts };
}

/** The book plays both sides from the start until it has nothing to say. */
function bookWalk(seed: number): string[] {
  const { p } = probe(realRead, seededRandom(seed));
  const h = newGame(START);
  const line: string[] = [];
  for (let ply = 0; ply < 40; ply++) {
    const mv = p.bookMove(h.position);
    if (mv === undefined) break;
    line.push(uci(mv));
    playMove(h, mv);
  }
  return line;
}

const sha = () => createHash("sha256").update(readFileSync(ARTIFACT)).digest("hex");

// ---------------------------------------------------------------------------------------------
// Child modes.
// ---------------------------------------------------------------------------------------------

if (MODE === "walk") {
  const seed = Number(REST[0]);
  const walks: Record<string, string[]> = {};
  for (let s = 1; s <= 10; s++) walks[s] = bookWalk(s);
  const { p } = probe(realRead, seededRandom(seed));
  const start = game([]).position;
  const picks: string[] = [];
  for (let i = 0; i < 100; i++) picks.push(uci(p.bookMove(start)));
  process.stdout.write(JSON.stringify({ walks, picks }));
  process.exit(0);
}

if (MODE === "fail") {
  // One bad-book case. The harness binds warn to stderr (QE-094-a: the delivered binding is ABC-095's).
  // Results go to a file, never stdout: stdout must stay 0 B, as it is the board.
  const [path, resultFile] = REST;
  const out = { throws: 0, nothing: 0, legal: 0, illegal: 0, illegalUci: [] as string[], calls: 0, net: 0 };
  let p: Any;
  try {
    p = createBookProbe({
      read: () => new Uint8Array(readFileSync(path)),
      warn: (m: string) => process.stderr.write(`${m}\n`),
      random: seededRandom(1),
    });
  } catch {
    out.throws++;
  }
  // 50 calls, alternating bookMove / inBook, over the first six positions of the Ruy Lopez.
  const lines = [[], ["e2e4"], ["e2e4", "e7e5"], ["e2e4", "e7e5", "g1f3"], ["e2e4", "e7e5", "g1f3", "b8c6"]];
  lines.push(["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]);
  for (let i = 0; i < 50; i++) {
    const pos = game(lines[i % lines.length]).position;
    out.calls++;
    try {
      if (i % 2 === 0) {
        const mv = p.bookMove(pos);
        if (mv === undefined) out.nothing++;
        else if (legalMoves(pos).some((c: Any) => uci(c) === uci(mv))) out.legal++;
        else {
          out.illegal++;
          out.illegalUci.push(uci(mv));
        }
      } else if (p.inBook(pos) === false) out.nothing++;
      else out.legal++;
    } catch {
      out.throws++;
    }
  }
  out.net = net.calls;
  writeFileSync(resultFile, JSON.stringify(out));
  process.exit(0);
}

// ---------------------------------------------------------------------------------------------
// Parent: every scenario.
// ---------------------------------------------------------------------------------------------

const results: { id: string; ok: boolean; line: string }[] = [];
const check = (id: string, ok: boolean, line: string) => {
  results.push({ id, ok, line });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${line}`);
};
const info = (line: string) => console.log(`     ${line}`);
const shaBefore = sha();
info(`artifact sha256 before: ${shaBefore}`);
rmSync(SCRATCH, { recursive: true, force: true });
mkdirSync(SCRATCH, { recursive: true });

// S1 — a known opening position answers with a book move from the book, legal on the board.
{
  const named: [string, string[]][] = [
    ["start position", []],
    ["1. e4", ["e2e4"]],
    ["1. d4", ["d2d4"]],
    ["1. c4 (English)", ["c2c4"]],
    ["1. e4 c5 (Sicilian)", ["e2e4", "c7c5"]],
    ["1. e4 e6 (French)", ["e2e4", "e7e6"]],
    ["1. e4 c6 (Caro-Kann)", ["e2e4", "c7c6"]],
    ["1. e4 e5 2. Nf3 Nc6 3. Bb5 (Ruy Lopez)", ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]],
    ["1. e4 e5 2. Nf3 Nc6 3. Bc4 (Italian)", ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4"]],
    ["1. d4 d5 2. c4 (Queen's Gambit)", ["d2d4", "d7d5", "c2c4"]],
    ["1. d4 Nf6 2. c4 g6 (King's Indian)", ["d2d4", "g8f6", "c2c4", "g7g6"]],
  ];
  let agree = 0;
  let hits = 0;
  let keyRoutesAgree = 0;
  const { p, warnings } = probe(realRead, seededRandom(1));
  for (const [label, line] of named) {
    const h = game(line);
    const entry = FILE.positions[hex(h.position)];
    const fileMoves = (entry?.m ?? []).map(([u]) => u);
    const mv = p.bookMove(h.position);
    const inBook = p.inBook(h.position);
    if (keyHistory(h).at(-1) === zobristKey(h.position)) keyRoutesAgree++;
    const legal = mv !== undefined && legalMoves(h.position).some((c: Any) => uci(c) === uci(mv));
    const ok =
      fileMoves.length > 0
        ? mv !== undefined && legal && fileMoves.includes(uci(mv)) && inBook
        : mv === undefined && !inBook;
    if (ok) agree++;
    if (mv !== undefined) hits++;
    info(
      `S1 ${label}: book answers ${mv === undefined ? "nothing" : uci(mv)}; the file holds ${fileMoves.length} move(s)` +
        `${entry?.n ? `, name "${entry.n}"` : ""}`,
    );
  }
  // The same position reached by two move orders gets the same answer (seed fixed).
  const a = game(["d2d4", "g8f6", "c2c4", "e7e6"]).position;
  const b = game(["c2c4", "e7e6", "d2d4", "g8f6"]).position;
  const pa = probe(realRead, seededRandom(5)).p.bookMove(a);
  const pb = probe(realRead, seededRandom(5)).p.bookMove(b);
  const transposes = pa !== undefined && pb !== undefined && uci(pa) === uci(pb);
  info(`S1 transposition 1.d4 Nf6 2.c4 e6 vs 1.c4 e6 2.d4 Nf6 (seed 5): ${pa && uci(pa)} / ${pb && uci(pb)}`);
  check(
    "S1",
    agree === named.length && hits >= 2 && transposes && warnings.length === 0 && keyRoutesAgree === named.length,
    `book agrees with the file on ${agree}/${named.length} named positions; ${hits} answered with a move; ` +
      `transposition same answer: ${transposes}; the two key routes agree ${keyRoutesAgree}/${named.length}; warnings ${warnings.length}`,
  );
}

// S2 — out of book, the book quietly says nothing (no move, no warning, no crash).
{
  const { p, warnings, counts } = probe(realRead, seededRandom(1));
  const cases: [string, Any][] = [["Kiwipete middlegame (FEN)", parseFen(KIWIPETE)]];
  const odd = game(["a2a4", "a7a5", "h2h4", "h7h5", "a1a3", "a8a6"]).position;
  cases.push(["1. a4 a5 2. h4 h5 3. Ra3 Ra6", odd]);
  // Named-but-moveless entries: BFS from the start through book moves, keys in sorted order, first 5.
  const empties: [string, Any][] = [];
  const seen = new Set<string>();
  let frontier: string[][] = [[]];
  while (frontier.length > 0 && empties.length < 5) {
    const next: string[][] = [];
    for (const line of frontier) {
      const pos = game(line).position;
      const k = hex(pos);
      if (seen.has(k)) continue;
      seen.add(k);
      const e = FILE.positions[k];
      if (e && e.m.length === 0 && empties.length < 5) empties.push([`"${e.n}" (${line.join(" ")})`, pos]);
      for (const [u] of e?.m ?? []) next.push([...line, u]);
    }
    frontier = next.sort((x, y) => x.join(" ").localeCompare(y.join(" ")));
  }
  for (const c of empties) cases.push([`named, no moves: ${c[0]}`, c[1]]);
  let quiet = 0;
  let throws = 0;
  let fileSaysOut = 0;
  for (const [label, pos] of cases) {
    const e = FILE.positions[hex(pos)];
    if (!e || e.m.length === 0) fileSaysOut++;
    try {
      const mv = p.bookMove(pos);
      const ib = p.inBook(pos);
      if (mv === undefined && ib === false) quiet++;
      info(`S2 ${label}: ${mv === undefined ? "nothing" : uci(mv)}, inBook ${ib}; file entry ${e ? `m=${e.m.length}` : "absent"}`);
    } catch {
      throws++;
    }
  }
  // Leaving book in a real line: a book walk on seed 1, then the next position is out.
  const walk = bookWalk(1);
  const after = game(walk).position;
  const tail = p.bookMove(after);
  if (tail === undefined) quiet++;
  info(`S2 the seed-1 book walk leaves book after ${walk.length} plies: ${walk.join(" ")}; next call: ${tail === undefined ? "nothing" : uci(tail)}`);
  check(
    "S2",
    quiet === cases.length + 1 && throws === 0 && warnings.length === 0 && fileSaysOut === cases.length && empties.length === 5,
    `${quiet}/${cases.length + 1} out-of-book positions answered nothing; throws ${throws}; warnings ${warnings.length}; ` +
      `${empties.length} named-but-moveless entries found and used`,
  );
  // INFO for ABC-095/ABC-101: does an out-of-book bookMove consume a random draw?
  const q = probe(realRead, seededRandom(1));
  q.p.bookMove(parseFen(KIWIPETE));
  q.p.inBook(parseFen(KIWIPETE));
  info(`S2 INFO random draws consumed by 1 out-of-book bookMove + 1 inBook: ${q.counts.draws} (reads ${counts.reads})`);
}

// S3 — the choice is repeatable for a given seed: two fresh processes, same games.
{
  const run = () =>
    spawnSync(process.execPath, [process.argv[1], ROOT, SCRATCH, "walk", "7"], { encoding: "utf8" });
  const a = run();
  const b = run();
  const ja = JSON.parse(a.stdout);
  const jb = JSON.parse(b.stdout);
  let sameWalks = 0;
  for (let s = 1; s <= 10; s++) if (JSON.stringify(ja.walks[s]) === JSON.stringify(jb.walks[s])) sameWalks++;
  const samePicks = ja.picks.length === 100 && JSON.stringify(ja.picks) === JSON.stringify(jb.picks);
  const distinctWalks = new Set(Object.values(ja.walks).map((w: Any) => w.join(" "))).size;
  info(`S3 process A exit ${a.status}, process B exit ${b.status}; seed-3 walk: ${ja.walks[3].join(" ")}`);
  check(
    "S3",
    a.status === 0 && b.status === 0 && sameWalks === 10 && samePicks,
    `seeds 1-10: ${sameWalks}/10 whole book walks identical across 2 processes; seed 7: 100 start-position picks identical: ${samePicks}; ` +
      `${distinctWalks} distinct walks among the 10 seeds`,
  );
}

// S4 — different seeds give a varied opening.
{
  const e4 = game(["e2e4"]).position;
  const start = game([]).position;
  const replies: string[] = [];
  const firsts: string[] = [];
  for (let s = 1; s <= 10; s++) {
    replies.push(uci(probe(realRead, seededRandom(s)).p.bookMove(e4)));
    firsts.push(uci(probe(realRead, seededRandom(s)).p.bookMove(start)));
  }
  const d = new Set(replies).size;
  info(`S4 replies to 1. e4, seeds 1-10: ${replies.join(" ")}`);
  info(`S4 INFO first moves from the start, seeds 1-10: ${firsts.join(" ")} (${new Set(firsts).size} distinct)`);
  check("S4", d >= 3, `${d} distinct replies to 1. e4 over seeds 1-10 (bar: >= 3)`);
}

// S5 — popular book moves come up more often, in line with the book's own weights.
{
  const spots: [string, string[]][] = [
    ["after 1. e4", ["e2e4"]],
    ["start position", []],
  ];
  let ok = true;
  for (const [label, line] of spots) {
    const pos = game(line).position;
    const entry = FILE.positions[hex(pos)];
    const total = entry.m.reduce((s, [, w]) => s + w, 0);
    const { p } = probe(realRead, seededRandom(1));
    const n: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      const u = uci(p.bookMove(pos));
      n[u] = (n[u] ?? 0) + 1;
    }
    let worst = 0;
    const rows: string[] = [];
    for (const [u, w] of entry.m) {
      const dev = Math.abs((n[u] ?? 0) / 10 - (100 * w) / total);
      worst = Math.max(worst, dev);
      rows.push(`${u} ${(n[u] ?? 0) / 10}%/${((100 * w) / total).toFixed(1)}%`);
    }
    const foreign = Object.keys(n).filter((u) => !entry.m.some(([v]) => v === u));
    ok = ok && worst <= 5 && foreign.length === 0;
    info(`S5 ${label}, seed 1, 1,000 draws (drawn/weight): ${rows.join(", ")}`);
    info(`S5 ${label}: worst deviation ${worst.toFixed(1)} pp; moves outside the entry ${foreign.length}`);
  }
  check("S5", ok, "every move's share within +/-5 pp of its weight, at both positions, seed 1");
}

// S6 + S7 — a missing or damaged book: no crash, nothing (or only legal moves), one warning, stderr only.
{
  const real = realRead();
  const text = new TextDecoder().decode(real);
  const json = () => JSON.parse(text);
  const startKey = hex(game([]).position);
  const deepKey = hex(game(["e2e4", "e7e5", "g1f3"]).position);
  const w = (name: string, data: Uint8Array | string) => {
    const path = `${SCRATCH}/${name}`;
    writeFileSync(path, data);
    return path;
  };
  const withBadMove = (key: string) => {
    const o = json();
    o.positions[key].m[0][0] = key === startKey ? "e2e5" : "a8a1";
    return JSON.stringify(o);
  };
  const badKey = () => {
    const o = json();
    o.positions["not-a-hex-key!!!"] = { m: [["e2e4", 1]] };
    return JSON.stringify(o);
  };
  const escape = () => {
    const o = json();
    o.positions["\u001b[2J\u001b[31mHACKED"] = { m: [["e2e4", 1]] };
    return JSON.stringify(o);
  };
  const format2 = () => JSON.stringify({ ...json(), format: 2 });
  const badUtf8 = () => {
    const b = Uint8Array.from(real);
    const i = text.indexOf('"n":"') + 6;
    b[i] = 0xff;
    return b;
  };
  const dir = `${SCRATCH}/a-directory.json`;
  mkdirSync(dir, { recursive: true });
  const cases: { id: string; label: string; path: string; mayReturnLegal?: boolean; expectWarn: number }[] = [
    { id: "C0", label: "control: the real artifact, unharmed", path: ARTIFACT, mayReturnLegal: true, expectWarn: 0 },
    { id: "C1", label: "missing file", path: `${SCRATCH}/no-such-book.json`, expectWarn: 1 },
    { id: "C2", label: "empty file (0 B)", path: w("empty.json", ""), expectWarn: 1 },
    { id: "C3", label: "real book cut in half (truncated mid-record)", path: w("half.json", real.slice(0, real.length >> 1)), expectWarn: 1 },
    { id: "C4", label: "valid JSON, one key not 16 hex digits", path: w("bad-key.json", badKey()), expectWarn: 1 },
    { id: "C4b", label: "valid JSON, format 2", path: w("format2.json", format2()), expectWarn: 1 },
    { id: "C5", label: "illegal move at the start position (e2e5)", path: w("illegal-start.json", withBadMove(startKey)), expectWarn: 1 },
    { id: "C5b", label: "illegal move 3 plies in (a8a1 after 1.e4 e5 2.Nf3)", path: w("illegal-deep.json", withBadMove(deepKey)), mayReturnLegal: true, expectWarn: 1 },
    { id: "C6", label: "real book padded past 1 MiB (still valid JSON)", path: w("big.json", text + " ".repeat(800_000)), expectWarn: 1 },
    { id: "C7", label: "real book with one byte that is not UTF-8", path: w("not-utf8.json", badUtf8()), expectWarn: 1 },
    { id: "C8", label: "a key carrying a terminal escape sequence", path: w("escape.json", escape()), expectWarn: 1 },
    { id: "C9", label: "a directory where the file should be", path: dir, expectWarn: 1 },
  ];
  let allOk = true;
  let missingOk = false;
  for (const c of cases) {
    const resultFile = `${SCRATCH}/${c.id}.result.json`;
    const r = spawnSync(process.execPath, [process.argv[1], ROOT, SCRATCH, "fail", c.path, resultFile], {
      encoding: "buffer",
    });
    const o = JSON.parse(readFileSync(resultFile, "utf8"));
    const stderr = r.stderr.toString("utf8");
    const lines = stderr.split("\n").filter((l) => l.length > 0);
    const esc = r.stderr.includes(0x1b);
    const ok =
      r.status === 0 &&
      o.throws === 0 &&
      o.illegal === 0 &&
      o.calls === 50 &&
      r.stdout.length === 0 &&
      lines.length === c.expectWarn &&
      !esc &&
      o.net === 0 &&
      (c.mayReturnLegal ? true : o.legal === 0);
    if (c.id === "C1") missingOk = ok;
    else allOk = allOk && ok && (c.id !== "C0" || o.legal === 50);
    info(
      `${c.id} ${c.label}: exit ${r.status}; throws ${o.throws}; nothing ${o.nothing}; legal ${o.legal}; illegal ${o.illegal}; ` +
        `stdout ${r.stdout.length} B; stderr lines ${lines.length}${lines.length ? ` "${lines.join(" | ")}"` : ""}; ESC in stderr ${esc}; net ${o.net} -> ${ok ? "ok" : "NOT OK"}`,
    );
  }
  check("S6", missingOk, "missing book: 50 calls, 0 throws, 50 x nothing, exactly 1 warning line, 0 B on stdout (harness-bound stderr)");
  check("S7", allOk, "control C0 answers 50/50 with no warning; C2-C9: 0 throws, nothing or only legal moves, never the illegal one, exactly 1 warning, no file bytes in it");
}

// S8 — the book never goes online and runs nothing it reads.
{
  const src = readFileSync(`${ROOT}/src/book.ts`, "utf8");
  const imports = [...src.matchAll(/^import .* from "([^"]+)";$/gm)].map((m) => m[1]);
  const builtins = imports.filter((i) => i.startsWith("node:") || !i.startsWith("./"));
  const evalish = (src.match(/\beval\s*\(|new Function|\bimport\s*\(|\brequire\s*\(/g) ?? []).length;
  info(`S8 src/book.ts imports: ${imports.join(", ")}`);
  check(
    "S8",
    net.calls === 0 && builtins.length === 0 && evalish === 0,
    `network calls across every parent scenario ${net.calls} (each child also reported 0); Node builtin or package imports ${builtins.length}; eval/Function/import()/require() sites ${evalish}`,
  );
}

// S9 — making the book costs the game's start nothing: no read until the first question, then one.
{
  const { p, counts } = probe(realRead, seededRandom(1));
  const atBuild = counts.reads;
  const start = game([]).position;
  p.bookMove(start);
  const afterFirst = counts.reads;
  for (let i = 0; i < 100; i++) p.inBook(start);
  check("S9", atBuild === 0 && afterFirst === 1 && counts.reads === 1, `reads at construction ${atBuild}; after the first question ${afterFirst}; after 100 more ${counts.reads}`);
}

const shaAfter = sha();
info(`artifact sha256 after: ${shaAfter} (${shaAfter === shaBefore ? "unchanged" : "CHANGED"})`);
rmSync(SCRATCH, { recursive: true, force: true });
const failed = results.filter((r) => !r.ok).length;
console.log(`SUMMARY ${results.length - failed}/${results.length} PASS${shaAfter === shaBefore ? "" : " — ARTIFACT CHANGED"}`);
process.exit(failed === 0 && shaAfter === shaBefore ? 0 : 1);
