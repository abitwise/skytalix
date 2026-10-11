// QE ABC-094 — an independent harness for the book probe, outside the vitest suite.
// Usage: node qe-harness.ts <tree root>            -> runs every check, prints PASS/FAIL lines, exit 1 on any FAIL
//        node qe-harness.ts <tree root> pick <seed>  -> (child) prints 100 picks on the start position and 100 after 1. e4
//        node qe-harness.ts <tree root> stream       -> (child) binds warn to stderr, absent reader, 50 calls
//        node qe-harness.ts <tree root> timing       -> prints one JSON timing line (outside the suite; never asserted)
// Checks tagged A1..A7 are the ticket's criteria; EXTRA checks are QE's and do not decide a criterion.
// The checked-in artifact is only read. Nothing here writes to the repository.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = process.argv[2];
const MODE = process.argv[3] ?? "all";
if (!ROOT) throw new Error("usage: qe-harness.ts <tree root> [mode]");
const at = (rel: string) => pathToFileURL(`${ROOT}/${rel}`).href;

// Network globals are stubbed to counters BEFORE the probe is loaded (A7, dynamic half).
const net = { calls: 0 };
for (const name of ["fetch", "WebSocket", "XMLHttpRequest", "EventSource"]) {
  (globalThis as Record<string, unknown>)[name] = () => {
    net.calls++;
    throw new Error(`${name} called`);
  };
}

const book = await import(at("src/book.ts"));
const { legalMoves } = await import(at("src/legal.ts"));
const { parseFen } = await import(at("src/fen.ts"));
const { makeMove } = await import(at("src/apply.ts"));
const { seededRandom } = await import(at("src/levels.ts"));
const { squareName } = await import(at("src/position.ts"));
const { zobristKey } = await import(at("src/zobrist.ts"));

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const ARTIFACT = `${ROOT}/data/opening-book/book.json`;
const BYTES = new Uint8Array(readFileSync(ARTIFACT));
const TEXT = new TextDecoder().decode(BYTES);
const FILE = JSON.parse(TEXT) as { positions: Record<string, { m: [string, number][]; n?: string }> };
const PROMO = ["", "", "n", "b", "r", "q"];
// biome-ignore lint/suspicious/noExplicitAny: harness
type Move = any;
const uci = (m: Move): string => `${squareName(m.from)}${squareName(m.to)}${PROMO[m.promotion] ?? ""}`;
const hex = (p: unknown): string => zobristKey(p).toString(16).padStart(16, "0");
const start = () => parseFen(START);
const replay = (line: string[]) => {
  const p = start();
  for (const t of line) {
    const mv = legalMoves(p).find((c: Move) => uci(c) === t);
    if (!mv) throw new Error(`replay: ${t} not legal after ${line.join(" ")}`);
    makeMove(p, mv);
  }
  return p;
};
const enc = (s: string) => new TextEncoder().encode(s);
const fixture = (positions: Record<string, unknown>) => enc(JSON.stringify({ format: 1, maxPly: 12, positions }));

function probe(read: () => Uint8Array, random: () => number = seededRandom(1)) {
  const warnings: string[] = [];
  const reads = { n: 0 };
  const p = book.createBookProbe({
    read: () => {
      reads.n++;
      return read();
    },
    warn: (w: string) => warnings.push(w),
    random,
  });
  return { p, warnings, reads };
}

if (MODE === "pick") {
  const { p } = probe(() => BYTES, seededRandom(Number(process.argv[4])));
  const s = start();
  const e4 = replay(["e2e4"]);
  const out: string[] = [];
  for (let i = 0; i < 100; i++) out.push(uci(p.bookMove(s)));
  for (let i = 0; i < 100; i++) out.push(uci(p.bookMove(e4)));
  process.stdout.write(`${JSON.stringify(out)}\n`);
  process.exit(0);
}
if (MODE === "stream") {
  const p = book.createBookProbe({
    read: () => readFileSync(`${ROOT}/data/opening-book/absent-qe-ABC-094.json`),
    warn: (w: string) => process.stderr.write(`${w}\n`),
    random: seededRandom(1),
  });
  let undef = 0;
  for (let i = 0; i < 50; i++) if (p.bookMove(start()) === undefined) undef++;
  process.exit(undef === 50 ? 0 : 3);
}
if (MODE === "timing") {
  const reads = { n: 0 };
  const t0 = performance.now();
  const p = book.createBookProbe({
    read: () => {
      reads.n++;
      return new Uint8Array(readFileSync(ARTIFACT));
    },
    warn: () => {},
    random: seededRandom(7),
  });
  const t1 = performance.now();
  const readsAtConstruction = reads.n;
  const s = start();
  const e4 = replay(["e2e4"]);
  const t2 = performance.now();
  p.bookMove(s);
  const t3 = performance.now();
  const hits: number[] = [];
  for (let i = 0; i < 1000; i++) {
    const q = i % 2 ? e4 : s;
    const a = performance.now();
    p.bookMove(q);
    hits.push(performance.now() - a);
  }
  hits.sort((x, y) => x - y);
  const r = (x: number) => Math.round(x * 10000) / 10000;
  process.stdout.write(
    `${JSON.stringify({ node: process.version, readsAtConstruction, constructMs: r(t1 - t0), firstCallLoadMs: r(t3 - t2), reads: reads.n, hitMedianMs: r(hits[500]), hitP99Ms: r(hits[990]), hitMaxMs: r(hits[999]) })}\n`,
  );
  process.exit(0);
}

// ---- all checks ----
const lines: string[] = [];
let fails = 0;
const check = (tag: string, ok: boolean, detail: string) => {
  if (!ok) fails++;
  lines.push(`${ok ? "PASS" : "FAIL"} ${tag} ${detail}`);
};
const streams = { out: 0, err: 0 };
const ow = process.stdout.write.bind(process.stdout);
const ew = process.stderr.write.bind(process.stderr);
process.stdout.write = ((...a: unknown[]) => (streams.out++, true)) as typeof process.stdout.write;
process.stderr.write = ((...a: unknown[]) => (streams.err++, true)) as typeof process.stderr.write;

/** Calls fn n times; counts throws; returns results. */
function calls<T>(n: number, fn: (i: number) => T) {
  let thrown = 0;
  const res: T[] = [];
  for (let i = 0; i < n; i++) {
    try {
      res.push(fn(i));
    } catch {
      thrown++;
    }
  }
  return { thrown, res };
}

try {
  // A1 — full sweep of every book position reachable from the start over book moves.
  {
    const { p, warnings } = probe(() => BYTES, seededRandom(11));
    const seen = new Set<string>();
    let frontier: string[][] = [[]];
    let inBookOk = 0, inBookBad = 0, emptyOk = 0, emptyBad = 0, offOk = 0, offBad = 0, zeroLead = 0, thrown = 0;
    while (frontier.length) {
      const next: string[][] = [];
      for (const line of frontier) {
        const pos = replay(line);
        const key = hex(pos);
        if (seen.has(key)) continue;
        seen.add(key);
        const entry = FILE.positions[key];
        if (entry === undefined) continue;
        if (key.startsWith("0")) zeroLead++;
        try {
          const legal = legalMoves(pos).map(uci);
          if (entry.m.length === 0) {
            const mv = p.bookMove(pos);
            if (mv === undefined && p.inBook(pos) === false) emptyOk++;
            else emptyBad++;
            continue;
          }
          const mv = p.bookMove(pos);
          const t = mv && uci(mv);
          if (t && legal.includes(t) && entry.m.some(([u]) => u === t) && p.inBook(pos) === true) inBookOk++;
          else inBookBad++;
          for (const [u] of entry.m) next.push([...line, u]);
          // one off-book child per in-book position: the first legal move not in m whose key is absent
          const off = legal.find((u: string) => !entry.m.some(([b]) => b === u) && FILE.positions[hex(replay([...line, u]))] === undefined);
          if (off) {
            const child = replay([...line, off]);
            if (p.bookMove(child) === undefined && p.inBook(child) === false) offOk++;
            else offBad++;
          }
        } catch {
          thrown++;
        }
      }
      frontier = next;
    }
    const keysTotal = Object.keys(FILE.positions).length;
    check("A1", inBookBad === 0 && inBookOk > 0, `in-book entries: ${inBookOk} returned a legal move from their own m and inBook true, ${inBookBad} did not`);
    check("A1", emptyBad === 0 && emptyOk > 0, `present-with-empty-m: ${emptyOk} returned nothing and inBook false, ${emptyBad} did not`);
    check("A1", offBad === 0 && offOk > 0, `absent-key children: ${offOk} returned nothing and inBook false, ${offBad} did not`);
    check("A1", thrown === 0, `throws over the sweep: ${thrown}`);
    check("A1", warnings.length === 0, `warnings over the sweep on the delivered artifact: ${warnings.length}`);
    lines.push(`INFO A1 sweep reached ${seen.size} keys (${keysTotal} in the file); ${zeroLead} reached keys have a leading zero`);
    const s = start();
    check("A1", FILE.positions[hex(s)]?.m.length === 20, `independent key encoding: the file holds the start key ${hex(s)} with 20 moves`);
  }

  // A2 — two separate OS processes, same seed, 100 picks on two positions.
  {
    const self = fileURLToPath(import.meta.url);
    const outs = [1, 2].map(() => spawnSync(process.execPath, [self, ROOT, "pick", "2026"], { encoding: "utf8" }));
    const ok = outs.every((o) => o.status === 0);
    const a = ok ? JSON.parse(outs[0].stdout) : [];
    const b = ok ? JSON.parse(outs[1].stdout) : [];
    check("A2", ok && a.length === 200 && JSON.stringify(a) === JSON.stringify(b), `two processes, seed 2026: ${a.length} picks each (100 start + 100 after e4), identical: ${JSON.stringify(a) === JSON.stringify(b)}`);
    const { p } = probe(() => BYTES, seededRandom(2026));
    const s = start();
    const e4 = replay(["e2e4"]);
    const inproc = [...Array.from({ length: 100 }, () => uci(p.bookMove(s))), ...Array.from({ length: 100 }, () => uci(p.bookMove(e4)))];
    check("A2", JSON.stringify(inproc) === JSON.stringify(a), "the in-process sequence equals the child-process sequence");
    lines.push(`INFO A2 distinct picks in the 100 start-position draws: ${new Set(a.slice(0, 100)).size}`);
  }

  // A3 — seeds 1..10 after 1. e4, one pick each.
  {
    const e4 = replay(["e2e4"]);
    const replies: string[] = [];
    for (let seed = 1; seed <= 10; seed++) replies.push(uci(probe(() => BYTES, seededRandom(seed)).p.bookMove(e4)));
    const d = new Set(replies).size;
    check("A3", d >= 3, `distinct replies on seeds 1-10: ${d} (${replies.join(" ")})`);
  }

  // A4 — 8:1:1, seed 42, 1,000 draws, ±5 pp; plus an evenly spaced sweep that must land exactly 800/100/100.
  {
    const bytes = fixture({ [hex(start())]: { m: [["e2e4", 8], ["d2d4", 1], ["g1f3", 1]] } });
    const share = (rnd: () => number) => {
      const { p } = probe(() => bytes, rnd);
      const c: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        const mv = p.bookMove(start());
        const t = mv ? uci(mv) : "none";
        c[t] = (c[t] ?? 0) + 1;
      }
      return c;
    };
    for (const seed of [42, 1, 2026]) {
      const c = share(seededRandom(seed));
      const ok = Math.abs((c.e2e4 ?? 0) - 800) <= 50 && Math.abs((c.d2d4 ?? 0) - 100) <= 50 && Math.abs((c.g1f3 ?? 0) - 100) <= 50 && !c.none;
      check("A4", ok, `seed ${seed}: ${JSON.stringify(c)} each within ±5 pp`);
    }
    let i = 0;
    const sweep = share(() => (i++ + 0.5) / 1000);
    check("A4", sweep.e2e4 === 800 && sweep.d2d4 === 100 && sweep.g1f3 === 100, `evenly spaced [0,1) sweep: ${JSON.stringify(sweep)} (exact 800/100/100 expected)`);
    let j = 0;
    const order = (() => {
      const b2 = fixture({ [hex(start())]: { m: [["e2e4", 3], ["d2d4", 2], ["g1f3", 5]] } });
      const { p } = probe(() => b2, () => (j++ + 0.5) / 10);
      return Array.from({ length: 10 }, () => uci(p.bookMove(start()))).join(" ");
    })();
    check("EXTRA", order === "e2e4 e2e4 e2e4 d2d4 d2d4 g1f3 g1f3 g1f3 g1f3 g1f3", `cumulative mapping in file order, 3:2:5 over 10 spaced draws: ${order}`);
  }

  // A5 — artifact absent from disk: real readFileSync of a missing path.
  {
    const { p, warnings, reads } = probe(() => new Uint8Array(readFileSync(`${ROOT}/data/opening-book/absent-qe-ABC-094.json`)));
    check("A5", reads.n === 0, `reads at construction: ${reads.n}`);
    const { thrown, res } = calls(50, (i) => (i % 2 ? p.bookMove(start()) : p.bookMove(replay(["e2e4"]))));
    const ib = calls(10, () => p.inBook(start()));
    check("A5", thrown === 0 && ib.thrown === 0, `throws over 50 bookMove + 10 inBook: ${thrown + ib.thrown}`);
    check("A5", res.filter((r) => r === undefined).length === 50 && ib.res.every((r) => r === false), "50 of 50 returned nothing; inBook false 10 of 10");
    check("A5", warnings.length === 1, `warnings: ${warnings.length}`);
    lines.push(`INFO A5 reads in total: ${reads.n}; warning text: "${warnings[0]}"`);
    const self = fileURLToPath(import.meta.url);
    const child = spawnSync(process.execPath, [self, ROOT, "stream"], { encoding: "utf8" });
    const errLines = child.stderr.split("\n").filter(Boolean);
    check("A5", child.status === 0 && child.stdout.length === 0 && errLines.length === 1, `QE's stderr binding in a child (ABC-095's shape, not the delivered root): exit ${child.status}, stdout ${child.stdout.length} B, stderr ${errLines.length} line(s)`);
    const nonError = probe(() => {
      throw "not an Error";
    });
    const r2 = calls(50, () => nonError.p.bookMove(start()));
    check("EXTRA", r2.thrown === 0 && nonError.warnings.length === 1, `a reader throwing a non-Error: throws ${r2.thrown}, warnings ${nonError.warnings.length}`);
    const two = [probe(() => new Uint8Array(0)), probe(() => new Uint8Array(0))];
    for (const t of two) t.p.bookMove(start());
    lines.push(`INFO A5 two probe instances on one bad file in one process warn ${two[0].warnings.length + two[1].warnings.length} times in total (once per instance)`);
  }

  // A6 — the corrupt matrix (named five, then QE's additions).
  {
    const sk = hex(start());
    const e4k = hex(replay(["e2e4"]));
    const oversize = new Uint8Array(1_048_577).fill(0x20);
    oversize.set(BYTES, 0);
    const exact = new Uint8Array(1_048_576).fill(0x20);
    exact.set(BYTES, 0);
    const badUtf8InName = (() => {
      const i = TEXT.indexOf("King's Pawn Game");
      const head = enc(TEXT.slice(0, i));
      const tail = enc(TEXT.slice(i));
      const out = new Uint8Array(head.length + 1 + tail.length);
      out.set(head, 0);
      out[head.length] = 0xff;
      out.set(tail, head.length + 1);
      return out;
    })();
    const deep = enc(`${"[".repeat(500_000)}${"]".repeat(500_000)}`);
    const matrix: [string, string, Uint8Array][] = [
      ["A6", "empty file", new Uint8Array(0)],
      ["A6", "valid container, garbage payload: key 15 hex", fixture({ [sk.slice(1)]: { m: [["e2e4", 1]] } })],
      ["A6", "valid container, garbage payload: key 17 hex", fixture({ [`0${sk}`]: { m: [["e2e4", 1]] } })],
      ["A6", "valid container, garbage payload: key uppercase", fixture({ [sk.toUpperCase()]: { m: [["e2e4", 1]] } })],
      ["A6", "valid container, garbage payload: key __proto__", enc(`{"format":1,"positions":{"__proto__":{"m":[["e2e4",1]]}}}`)],
      ["A6", "valid container, garbage payload: m a string", fixture({ [sk]: { m: "e2e4" } })],
      ["A6", "valid container, garbage payload: pair of 3", fixture({ [sk]: { m: [["e2e4", 1, 1]] } })],
      ["A6", "valid container, garbage payload: weight 0", fixture({ [sk]: { m: [["e2e4", 0]] } })],
      ["A6", "valid container, garbage payload: weight -1", fixture({ [sk]: { m: [["e2e4", -1]] } })],
      ["A6", "valid container, garbage payload: weight 1.5", fixture({ [sk]: { m: [["e2e4", 1.5]] } })],
      ["A6", "valid container, garbage payload: weight '1'", fixture({ [sk]: { m: [["e2e4", "1"]] } })],
      ["A6", "valid container, garbage payload: weight 2^53", fixture({ [sk]: { m: [["e2e4", 2 ** 53]] } })],
      ["A6", "valid container, garbage payload: uci 'E2E4'", fixture({ [sk]: { m: [["E2E4", 1]] } })],
      ["A6", "valid container, garbage payload: uci 'e7e8k'", fixture({ [sk]: { m: [["e7e8k", 1]] } })],
      ["A6", "valid container, garbage payload: format '1'", enc(JSON.stringify({ format: "1", positions: {} }))],
      ["A6", "valid container, garbage payload: positions an array", enc(JSON.stringify({ format: 1, positions: [] }))],
      ["A6", "valid container, garbage payload: null", enc("null")],
      ["A6", "illegal in keyed position: e2e5 at start", fixture({ [sk]: { m: [["e2e5", 1]] } })],
      ["A6", "illegal in keyed position: Black's e7e5 at start", fixture({ [sk]: { m: [["e7e5", 1]] } })],
      ["A6", "illegal in keyed position: e2e4 beside it, weight 10^6", fixture({ [sk]: { m: [["e2e4", 1_000_000], ["e2e5", 1]] } })],
      ["A6", "illegal in keyed position: real book with e2e5 appended at start", enc(TEXT.replace(`"${sk}":{"m":[`, `"${sk}":{"m":[["e2e5",1],`))],
      ["A6", "larger than 1 MB: real book space-padded to 1,048,577 B", oversize],
      ["EXTRA", "invalid UTF-8 inside the n string of the real book", badUtf8InName],
      ["EXTRA", "1,000,000 B of nested arrays", deep],
      ["EXTRA", "weights overflow: two of 2^53-1", fixture({ [sk]: { m: [["e2e4", 2 ** 53 - 1], ["d2d4", 2 ** 53 - 1]] } })],
    ];
    const cuts = Array.from({ length: 64 }, (_, k) => Math.floor((BYTES.length * (k + 1)) / 65));
    for (const c of cuts) matrix.push(["A6", `truncated mid-record at byte ${c}`, BYTES.subarray(0, c)]);
    for (const [tag, name, bytes] of matrix) {
      const { p, warnings } = probe(() => bytes);
      const { thrown, res } = calls(50, (i) => (i % 3 === 2 ? p.inBook(start()) : p.bookMove(i % 3 ? replay(["e2e4"]) : start())));
      const legalOnly = res.every((r) => r === undefined || r === false || (typeof r === "object" && legalMoves(start()).map(uci).concat(legalMoves(replay(["e2e4"])).map(uci)).includes(uci(r))));
      const printable = warnings.every((w) => /^[\x20-\x7e]+$/.test(w));
      check(tag, thrown === 0 && legalOnly && warnings.length === 1 && printable, `${name}: throws ${thrown}, nothing-or-legal ${legalOnly}, warnings ${warnings.length}, printable ${printable}`);
    }
    // the illegal case returns NOTHING (the illegal move is never handed onward), and nothing after it
    {
      const { p, warnings } = probe(() => fixture({ [sk]: { m: [["e2e4", 1_000_000], ["e2e5", 1]] } }), () => 0.99999999);
      const r = calls(50, () => p.bookMove(start()));
      check("A6", r.res.every((m) => m === undefined || uci(m) !== "e2e5"), "illegal e2e5 is never returned, even when the draw lands on it (random 0.99999999)");
      lines.push(`INFO A6 mixed-entry draw on the illegal move: ${r.res.filter((m) => m === undefined).length}/50 nothing, warnings ${warnings.length}`);
    }
    // an illegal move keyed under a position only reached later: legal before, nothing after
    {
      const { p, warnings } = probe(() => fixture({ [sk]: { m: [["e2e4", 1]] }, [e4k]: { m: [["e2e4", 1]] } }));
      const before = p.bookMove(start());
      const after = calls(20, () => p.bookMove(replay(["e2e4"])));
      check("A6", before && uci(before) === "e2e4" && after.res.every((m) => m === undefined) && warnings.length === 1, `illegal entry met later: before ${before && uci(before)}, after all nothing ${after.res.every((m) => m === undefined)}, warnings ${warnings.length}`);
    }
    {
      const { p, warnings } = probe(() => exact);
      const mv = p.bookMove(start());
      lines.push(`INFO A6 boundary: exactly 1,048,576 B (real book padded) -> ${mv ? `accepted, returned ${uci(mv)}` : "refused"}, warnings ${warnings.length}`);
    }
  }

  // EXTRA — promotions are encoded right (no shipped entry exercises them).
  {
    const pos = parseFen("8/4P3/8/8/8/8/k7/4K3 w - - 0 1");
    for (const [t, piece] of [["e7e8q", 5], ["e7e8n", 2], ["e7e8r", 4], ["e7e8b", 3]] as const) {
      const { p, warnings } = probe(() => fixture({ [hex(pos)]: { m: [[t, 1]] } }));
      const mv = p.bookMove(parseFen("8/4P3/8/8/8/8/k7/4K3 w - - 0 1"));
      check("EXTRA", mv?.promotion === piece && warnings.length === 0, `promotion ${t}: returned promotion piece ${mv?.promotion} (want ${piece}), warnings ${warnings.length}`);
    }
  }

  // A7 — structural (TypeScript AST) and dynamic.
  {
    const src = readFileSync(`${ROOT}/src/book.ts`, "utf8");
    const sf = ts.createSourceFile("book.ts", src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const banned = new Set(["eval", "Function", "require", "fetch", "WebSocket", "XMLHttpRequest", "EventSource", "process", "globalThis", "global", "Worker", "import"]);
    const hits: string[] = [];
    const specs: string[] = [];
    const visit = (n: ts.Node) => {
      if (ts.isImportDeclaration(n)) specs.push((n.moduleSpecifier as ts.StringLiteral).text);
      if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword) hits.push("dynamic import()");
      if (ts.isMetaProperty(n)) hits.push("import.meta");
      if (ts.isIdentifier(n) && banned.has(n.text)) {
        const parent = n.parent;
        const isPropName = parent && ts.isPropertyAccessExpression(parent) && parent.name === n;
        if (!isPropName) hits.push(n.text);
      }
      if (ts.isPropertyAccessExpression(n) && n.name.text === "constructor") hits.push(".constructor");
      if (ts.isElementAccessExpression(n)) hits.push(`element access [${n.argumentExpression.getText(sf)}]`);
      ts.forEachChild(n, visit);
    };
    visit(sf);
    const offending = hits.filter((h) => !h.startsWith("element access"));
    check("A7", offending.length === 0, `AST hits for eval/Function/require/import()/fetch/WebSocket/XHR/EventSource/process/globalThis/import.meta/.constructor: ${offending.length}${offending.length ? ` (${offending.join(", ")})` : ""}`);
    check("A7", specs.length > 0 && specs.every((s) => s.startsWith("./")), `import specifiers: ${specs.join(", ")} (all local)`);
    lines.push(`INFO A7 element accesses (reviewed, not counted): ${hits.filter((h) => h.startsWith("element access")).join("; ") || "none"}`);
    check("A7", net.calls === 0, `network globals called during every check above: ${net.calls}`);
  }
  check("A5", streams.out === 0 && streams.err === 0, `in-process writes by the probe to stdout / stderr during every check: ${streams.out} / ${streams.err}`);
} catch (error) {
  fails++;
  lines.push(`FAIL HARNESS uncaught: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  process.stdout.write = ow;
  process.stderr.write = ew;
}
ow(`${lines.join("\n")}\nSUMMARY ${fails === 0 ? "GREEN" : "RED"} fails=${fails} checks=${lines.filter((l) => /^(PASS|FAIL)/.test(l)).length}\n`);
process.exit(fails === 0 ? 0 : 1);
