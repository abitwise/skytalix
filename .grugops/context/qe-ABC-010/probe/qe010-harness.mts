// QE qe-ABC-010 independent harness (QE's own; written from the ticket and ADR-0033, not from the SE's probes).
// Usage: node qe010-harness.mts <tree> [seed] [fuzzCount] [games]
// Reads <tree>/src only and writes nothing. Prints a section per part; exit 1 if any FAIL line was printed.
//
// Its oracle is its OWN: a FEN reader over the text and an attack test over an 8x8 array. It does not import
// moves.ts, legal.ts's isInCheck or fen.ts's helpers. It imports from <tree>: fen.ts (the subject), and
// legal.ts legalMoves + apply.ts makeMove only to PLAY games for the positive corpus.
//
// Parts:
//   A  hand-picked table: FENs that must be rejected (exact message) and FENs that must be accepted.
//   B  non-string inputs, the ticket's five plus five more: every one must throw FenError.
//   C  differential fuzz: random grammatical FENs; parseFen must accept iff the oracle says reachable-per-rules,
//      and on reject throw exactly the oracle's first fault (ADR-0033 decision 3 order). Grammar faults must throw
//      the same message from both entries. Accepted positions must equal the grammar-only parse field by field
//      and round-trip byte-identically.
//   D  positive corpus by play: random games from the six perft roots; every position reached by makeMove must be
//      accepted by parseFen and round-trip byte-identically.
//   E  production corpora (puzzle-corpus PUZZLES + HANGING_CORPUS, mirror-corpus PERFT_POSITIONS): all accepted.
const tree = process.argv[2];
const seed = Number(process.argv[3] ?? 20261010);
const FUZZ = Number(process.argv[4] ?? 200000);
const GAMES = Number(process.argv[5] ?? 300);
if (!tree) {
  console.error("usage: node qe010-harness.mts <tree> [seed] [fuzzCount] [games]");
  process.exit(2);
}

const fenMod = await import(`${tree}/src/fen.ts`);
const { parseFen, toFen, FenError } = fenMod;
const grammarOnly: ((f: string) => unknown) | undefined = fenMod.parseFenGrammarOnly;
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { makeMove } = await import(`${tree}/src/apply.ts`);

let failures = 0;
const fail = (msg: string) => {
  failures++;
  if (failures <= 60) console.log(`FAIL ${msg}`);
};

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(seed);
const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)] as T;

// ---------- own oracle ----------
type Grid = (string | null)[][]; // grid[rank 0..7][file 0..7], rank 0 = rank 1
const FILES = "abcdefgh";
const sq = (r: number, f: number) => `${FILES[f]}${r + 1}`;

function readGrid(placement: string): Grid {
  const grid: Grid = Array.from({ length: 8 }, () => Array(8).fill(null));
  placement.split("/").forEach((text, i) => {
    let f = 0;
    for (const c of text) {
      if (c >= "1" && c <= "8") f += Number(c);
      else (grid[7 - i] as (string | null)[])[f++] = c;
    }
  });
  return grid;
}
const at = (g: Grid, r: number, f: number) => (r < 0 || r > 7 || f < 0 || f > 7 ? undefined : g[r]?.[f]);

/** Is square (r,f) attacked by the given colour? Own implementation over the grid. */
function attacked(g: Grid, r: number, f: number, byWhite: boolean): boolean {
  const own = (c: string) => (byWhite ? c.toUpperCase() : c.toLowerCase());
  // pawns: a white pawn attacks (r+1, f±1), so it stands on (r-1, f±1)
  const pr = byWhite ? r - 1 : r + 1;
  for (const df of [-1, 1]) if (at(g, pr, f + df) === own("p")) return true;
  for (const [dr, df] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]] as const)
    if (at(g, r + dr, f + df) === own("n")) return true;
  for (let dr = -1; dr <= 1; dr++)
    for (let df = -1; df <= 1; df++) if ((dr || df) && at(g, r + dr, f + df) === own("k")) return true;
  const ray = (dr: number, df: number, kinds: string[]) => {
    let rr = r + dr;
    let ff = f + df;
    while (rr >= 0 && rr <= 7 && ff >= 0 && ff <= 7) {
      const c = at(g, rr, ff);
      if (c) return kinds.map(own).includes(c);
      rr += dr;
      ff += df;
    }
    return false;
  };
  for (const [dr, df] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) if (ray(dr, df, ["r", "q"])) return true;
  for (const [dr, df] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) if (ray(dr, df, ["b", "q"])) return true;
  return false;
}

/** ADR-0033 decision 3(c) order: the expected FenError message for a grammatical FEN, or null if it must parse. */
function oracleFault(fen: string): string | null {
  const [placement, side, castling, ep] = fen.trim().split(/\s+/) as [string, string, string, string];
  const g = readGrid(placement);
  for (const r of [0, 7])
    for (let f = 0; f < 8; f++) {
      const c = at(g, r, f);
      if (c === "P" || c === "p") return `pawn on ${sq(r, f)}: no pawn can stand on rank ${r + 1}`;
    }
  const homes: [string, string, number, number][] = [
    ["K", "white", 0, 7],
    ["Q", "white", 0, 0],
    ["k", "black", 7, 7],
    ["q", "black", 7, 0],
  ];
  for (const [right, colour, r, rookFile] of homes) {
    if (!castling.includes(right)) continue;
    const king = colour === "white" ? "K" : "k";
    const rook = colour === "white" ? "R" : "r";
    if (at(g, r, 4) !== king)
      return `castling right "${right}" is inconsistent with the board: no ${colour} king on ${sq(r, 4)}`;
    if (at(g, r, rookFile) !== rook)
      return `castling right "${right}" is inconsistent with the board: no ${colour} rook on ${sq(r, rookFile)}`;
  }
  const whiteToMove = side === "w";
  if (ep !== "-") {
    const f = FILES.indexOf(ep[0] as string);
    const r = Number(ep[1]) - 1;
    const pre = `en-passant square ${ep} is inconsistent with the board: `;
    if (r !== (whiteToMove ? 5 : 2))
      return `${pre}it must be on rank ${whiteToMove ? 6 : 3} when ${whiteToMove ? "white" : "black"} is to move`;
    if (at(g, r, f)) return `${pre}${ep} is occupied`;
    const fr = whiteToMove ? r - 1 : r + 1;
    if (at(g, fr, f) !== (whiteToMove ? "p" : "P"))
      return `${pre}no ${whiteToMove ? "black" : "white"} pawn on ${sq(fr, f)}`;
    const or = whiteToMove ? r + 1 : r - 1;
    if (at(g, or, f)) return `${pre}${sq(or, f)} is occupied`;
  }
  const kingChar = whiteToMove ? "k" : "K";
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++)
      if (at(g, r, f) === kingChar && attacked(g, r, f, whiteToMove))
        return `side not to move (${whiteToMove ? "black" : "white"}) is in check: its king on ${sq(r, f)} is attacked`;
  return null;
}

type Outcome = { ok: true; value: any } | { ok: false; error: unknown };
const attempt = (fn: () => unknown): Outcome => {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    return { ok: false, error };
  }
};
const describeErr = (e: unknown) =>
  e instanceof FenError ? `FenError(${(e as Error).message})` : `${(e as Error)?.name}(${(e as Error)?.message})`;

function roundTrips(fen: string, p: unknown): boolean {
  const s = toFen(p);
  const again = attempt(() => parseFen(s));
  if (!again.ok) {
    fail(`round trip: parseFen(toFen(p)) threw ${describeErr(again.error)} for ${fen}`);
    return false;
  }
  if (toFen(again.value) !== s) {
    fail(`round trip: not byte-identical for ${fen}: ${s} vs ${toFen(again.value)}`);
    return false;
  }
  return true;
}

// ---------- A: hand-picked table ----------
const REJECT: [string, string][] = [
  // the ticket's acceptance rows
  ["4k3/8/8/8/8/8/8/K7 w KQ - 0 1", 'castling right "K" is inconsistent with the board: no white king on e1'],
  ["4k3/8/8/8/8/8/8/4K3 w K - 0 1", 'castling right "K" is inconsistent with the board: no white rook on h1'],
  ["4k3/8/4Q3/8/8/8/8/4K3 w - - 0 1", "side not to move (black) is in check: its king on e8 is attacked"],
  ["4k3/8/8/8/8/8/8/P3K3 w - - 0 1", "pawn on a1: no pawn can stand on rank 1"],
  // every right, both halves
  ["4k3/8/8/8/8/8/8/R4K2 w Q - 0 1", 'castling right "Q" is inconsistent with the board: no white king on e1'],
  ["4k3/8/8/8/8/8/8/4K3 w Q - 0 1", 'castling right "Q" is inconsistent with the board: no white rook on a1'],
  ["5k1r/8/8/8/8/8/8/4K3 w k - 0 1", 'castling right "k" is inconsistent with the board: no black king on e8'],
  ["4k3/8/8/8/8/8/8/4K3 w k - 0 1", 'castling right "k" is inconsistent with the board: no black rook on h8'],
  ["r4k2/8/8/8/8/8/8/4K3 w q - 0 1", 'castling right "q" is inconsistent with the board: no black king on e8'],
  ["4k3/8/8/8/8/8/8/4K3 b q - 0 1", 'castling right "q" is inconsistent with the board: no black rook on a8'],
  // identity tests: the wrong colour or the wrong piece on the home square
  ["r3K2r/8/8/8/8/8/8/R3k2R w KQkq - 0 1", 'castling right "K" is inconsistent with the board: no white king on e1'],
  ["4k3/8/8/8/8/8/8/4K2Q w K - 0 1", 'castling right "K" is inconsistent with the board: no white rook on h1'],
  ["4k2R/8/8/8/8/8/8/4K3 b k - 0 1", 'castling right "k" is inconsistent with the board: no black rook on h8'],
  ["r3k3/8/8/8/8/8/8/4K3 w Kq - 0 1", 'castling right "K" is inconsistent with the board: no white rook on h1'],
  // pawns, both colours, both ranks; rank 1 is scanned before rank 8 even though FEN prints rank 8 first
  ["P3k3/8/8/8/8/8/8/4K3 b - - 0 1", "pawn on a8: no pawn can stand on rank 8"],
  ["4k3/8/8/8/8/8/8/4K2p w - - 0 1", "pawn on h1: no pawn can stand on rank 1"],
  ["p3k3/8/8/8/8/8/8/4K2P w - - 0 1", "pawn on h1: no pawn can stand on rank 1"],
  ["4k2p/8/8/8/8/8/8/4K3 w - - 0 1", "pawn on h8: no pawn can stand on rank 8"],
  // en passant, white to move and black to move, each of the four faults
  ["4k3/8/8/8/8/8/8/4K3 w - e6 0 1", "en-passant square e6 is inconsistent with the board: no black pawn on e5"],
  ["4k3/8/8/4P3/8/8/8/4K3 w - e6 0 1", "en-passant square e6 is inconsistent with the board: no black pawn on e5"],
  ["4k3/8/8/8/4P3/8/8/4K3 w - e4 0 1", "en-passant square e4 is inconsistent with the board: it must be on rank 6 when white is to move"],
  ["4k3/8/8/8/8/8/8/4K3 b - e3 0 1", "en-passant square e3 is inconsistent with the board: no white pawn on e4"],
  ["4k3/8/8/8/8/8/8/4K3 b - e6 0 1", "en-passant square e6 is inconsistent with the board: it must be on rank 3 when black is to move"],
  ["4k3/8/8/8/4P3/4N3/8/4K3 b - e3 0 1", "en-passant square e3 is inconsistent with the board: e3 is occupied"],
  ["4k3/8/8/8/4P3/8/4N3/4K3 b - e3 0 1", "en-passant square e3 is inconsistent with the board: e2 is occupied"],
  ["4k3/8/8/8/4p3/8/8/4K3 b - e3 0 1", "en-passant square e3 is inconsistent with the board: no white pawn on e4"],
  ["4k3/8/8/8/p7/8/8/4K3 w - a3 0 1", "en-passant square a3 is inconsistent with the board: it must be on rank 6 when white is to move"],
  // the side not to move in check, by every piece kind, both colours
  ["8/8/8/3k4/4P3/8/8/4K3 w - - 0 1", "side not to move (black) is in check: its king on d5 is attacked"],
  ["4k3/8/3N4/8/8/8/8/4K3 w - - 0 1", "side not to move (black) is in check: its king on e8 is attacked"],
  ["4k3/8/8/1B6/8/8/8/4K3 w - - 0 1", "side not to move (black) is in check: its king on e8 is attacked"],
  ["R3k3/8/8/8/8/8/8/4K3 w - - 0 1", "side not to move (black) is in check: its king on e8 is attacked"],
  ["8/8/8/8/8/8/3k4/4K3 b - - 0 1", "side not to move (white) is in check: its king on e1 is attacked"],
  ["4k3/8/8/8/8/8/5p2/4K3 b - - 0 1", "side not to move (white) is in check: its king on e1 is attacked"],
  ["4k3/8/8/8/8/8/2n5/4K3 b - - 0 1", "side not to move (white) is in check: its king on e1 is attacked"],
  ["4k3/8/8/8/8/8/8/r3K3 b - - 0 1", "side not to move (white) is in check: its king on e1 is attacked"],
  ["4k3/8/8/b7/8/8/8/4K3 b - - 0 1", "side not to move (white) is in check: its king on e1 is attacked"],
  // clocks that do not survive their own round trip
  ["4k3/8/8/8/8/8/8/4K3 w - - 01 1", 'halfmove clock "01" does not round-trip: it reads back as "1"'],
  ["4k3/8/8/8/8/8/8/4K3 w - - 0 01", 'fullmove number "01" does not round-trip: it reads back as "1"'],
  ["4k3/8/8/8/8/8/8/4K3 w - - 9007199254740993 1", 'halfmove clock "9007199254740993" does not round-trip: it reads back as "9007199254740992"'],
  ["4k3/8/8/8/8/8/8/4K3 w - - 0 999999999999999999999", 'fullmove number "999999999999999999999" does not round-trip: it reads back as "1e+21"'],
];
const ACCEPT: string[] = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
  "rn2k2r/8/8/8/8/8/8/R3K1NR w KQkq - 0 1", // rights consistent with the board though castling is blocked
  "4k3/8/8/8/8/8/8/R3K3 w Q - 0 1",
  "r3k3/8/8/8/8/8/8/4K3 b q - 0 1",
  "4k3/8/8/8/8/8/4q3/4K3 w - - 0 1", // the side TO move in check is legal
  "4k3/8/8/8/1b6/8/4r3/4K3 w - - 0 1", // double check of the side to move
  "8/8/8/8/4P3/3k4/8/4K3 w - - 0 1", // a white pawn does not attack backwards
  "4k3/3p4/8/1B6/8/8/8/4K3 w - - 0 1", // a blocked bishop
  "8/8/8/KPp4r/8/8/8/4k3 w - c6 0 2", // ep whose only capture is illegal (pinned): kept, ADR-0005
  "8/8/8/4k3/2pP4/8/8/4K3 b - d3 0 1", // ep where the double push gave check
  "4k3/8/8/p7/8/8/8/4K3 w - a6 0 1",
  "4k3/8/8/7p/8/8/8/4K3 w - h6 0 1",
  "4k3/8/8/8/P7/8/8/4K3 b - a3 0 1",
  "4k3/8/8/8/7P/8/8/4K3 b - h3 0 1",
  "4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1",
  "4k3/8/8/8/8/8/8/4K3 w - - 100 200",
  "4k3/8/8/8/8/8/8/4K3 w - - 9007199254740991 9007199254740991",
  "  rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR\tw  KQkq -  0 1\n", // whitespace between fields (pre-existing grammar)
];

console.log("== A hand-picked table");
let aRej = 0;
for (const [f, msg] of REJECT) {
  const r = attempt(() => parseFen(f));
  if (r.ok) fail(`A wrongly ACCEPTED: ${f} (expected: ${msg})`);
  else if (!(r.error instanceof FenError)) fail(`A not a FenError: ${f}: ${describeErr(r.error)}`);
  else if ((r.error as Error).message !== msg) fail(`A wrong message: ${f}: got "${(r.error as Error).message}" want "${msg}"`);
  else aRej++;
  const o = oracleFault(f);
  if (!msg.includes("does not round-trip") && o !== msg) fail(`A oracle self-check disagrees on ${f}: ${o}`);
}
let aAcc = 0;
for (const f of ACCEPT) {
  const r = attempt(() => parseFen(f));
  if (!r.ok) fail(`A wrongly REJECTED: ${JSON.stringify(f)}: ${describeErr(r.error)}`);
  else if (roundTrips(f, r.value)) aAcc++;
  if (oracleFault(f) !== null) fail(`A oracle self-check rejects accept-row ${f}: ${oracleFault(f)}`);
}
console.log(`A rejects matched ${aRej}/${REJECT.length}; accepts held ${aAcc}/${ACCEPT.length}`);

// ---------- B: non-string inputs ----------
console.log("== B non-string inputs");
const NON_STRINGS: [string, unknown][] = [
  ["null", null],
  ["undefined", undefined],
  ["42", 42],
  ["{}", {}],
  ["[]", []],
  ["true", true],
  ["10n", 10n],
  ["Symbol()", Symbol("fen")],
  ["() => fen", () => "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["new String(start)", new String("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")],
  ["{ trim() }", { trim: () => "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }],
];
let bOk = 0;
for (const [name, v] of NON_STRINGS) {
  for (const [entry, fn] of [["parseFen", parseFen], ["parseFenGrammarOnly", grammarOnly]] as const) {
    if (!fn) continue;
    const r = attempt(() => (fn as (x: unknown) => unknown)(v));
    if (r.ok) fail(`B ${entry}(${name}) returned a position`);
    else if (!(r.error instanceof FenError)) fail(`B ${entry}(${name}) threw ${describeErr(r.error)}`);
    else bOk++;
  }
}
console.log(`B FenError on ${bOk} of ${NON_STRINGS.length * (grammarOnly ? 2 : 1)} (entry x input)`);

// ---------- C: differential fuzz ----------
console.log("== C differential fuzz");
const PIECES = "PNBRQpnbrq";
const CLOCKS = ["0 1", "0 1", "0 1", "0 1", "0 1", "0 1", "3 17", "00 1", "0 01", "0 0", "1 1", "100 51",
  "9007199254740993 1", "100000000000000000000 1", `${"9".repeat(40)} 1`, "0 1e3", "-1 1", "0 +2"];
function randomFen(): string {
  const g: Grid = Array.from({ length: 8 }, () => Array(8).fill(null));
  const empty = () => {
    for (;;) {
      const r = Math.floor(rand() * 8);
      const f = Math.floor(rand() * 8);
      if (!g[r]![f]) return [r, f] as const;
    }
  };
  const put = (r: number, f: number, c: string) => (g[r]![f] = c);
  if (rand() < 0.4) put(0, 4, "K");
  else { const [r, f] = empty(); put(r, f, "K"); }
  if (rand() < 0.4 && !g[7]![4]) put(7, 4, "k");
  else { const [r, f] = empty(); put(r, f, "k"); }
  for (const [r, f, c] of [[0, 0, "R"], [0, 7, "R"], [7, 0, "r"], [7, 7, "r"]] as const)
    if (rand() < 0.35 && !g[r]![f]) put(r, f, c);
  const extra = Math.floor(rand() * 9);
  for (let i = 0; i < extra; i++) {
    const c = pick([...PIECES]);
    let [r, f] = empty();
    if ((c === "P" || c === "p") && rand() < 0.85) {
      for (let tries = 0; tries < 20 && (r === 0 || r === 7 || g[r]![f]); tries++) [r, f] = empty();
      if (r === 0 || r === 7) continue;
    }
    put(r, f, c);
  }
  const side = rand() < 0.5 ? "w" : "b";
  let castling = [..."KQkq"].filter(() => rand() < 0.3).join("") || "-";
  if (rand() < 0.5) {
    // keep only rights the board supports, so the later rules get exercised
    castling = [..."KQkq"].filter((c) => castling.includes(c)).filter((c) => {
      const r = c === c.toUpperCase() ? 0 : 7;
      const k = r === 0 ? "K" : "k";
      const rook = r === 0 ? "R" : "r";
      return g[r]![4] === k && g[r]![c.toLowerCase() === "k" ? 7 : 0] === rook;
    }).join("") || "-";
  }
  let ep = "-";
  const u = rand();
  if (u < 0.3) {
    const f = Math.floor(rand() * 8);
    const r = side === "w" ? 5 : 2;
    const front = side === "w" ? 4 : 3;
    const origin = side === "w" ? 6 : 1;
    const pawn = side === "w" ? "p" : "P";
    if (rand() < 0.8 && !["K", "k"].includes(g[front]![f] ?? "")) g[front]![f] = pawn;
    if (rand() < 0.85 && !["K", "k"].includes(g[r]![f] ?? "")) g[r]![f] = null;
    if (rand() < 0.85 && !["K", "k"].includes(g[origin]![f] ?? "")) g[origin]![f] = null;
    ep = `${FILES[f]}${r + 1}`;
  } else if (u < 0.4) {
    ep = `${pick([...FILES])}${1 + Math.floor(rand() * 8)}`;
  }
  // castling squares may have been overwritten above; that is fine, the oracle reads the final board
  const placement = g.slice().reverse().map((row) => {
    let s = "";
    let run = 0;
    for (const c of row) {
      if (!c) run++;
      else { if (run) s += run; run = 0; s += c; }
    }
    return run ? s + run : s;
  }).join("/");
  return `${placement} ${side} ${castling} ${ep} ${pick(CLOCKS)}`;
}

const tally = new Map<string, number>();
const bump = (k: string) => tally.set(k, (tally.get(k) ?? 0) + 1);
let cAccepted = 0;
for (let i = 0; i < FUZZ; i++) {
  const f = randomFen();
  const g = grammarOnly ? attempt(() => grammarOnly(f)) : null;
  const p = attempt(() => parseFen(f));
  if (g && !g.ok) {
    // a grammar fault: both entries must throw the same FenError
    bump("grammar");
    if (!(g.error instanceof FenError)) fail(`C grammar-only threw ${describeErr(g.error)} on ${f}`);
    if (p.ok) fail(`C parseFen accepted what grammar rejects: ${f}`);
    else if ((p.error as Error).message !== (g.error as Error).message)
      fail(`C grammar message differs: ${f}: ${(p.error as Error).message} vs ${(g.error as Error).message}`);
    continue;
  }
  const want = oracleFault(f);
  bump(want === null ? "accept" : (want.split(/[ :]/)[0] as string));
  if (want === null) {
    if (!p.ok) { fail(`C wrongly REJECTED: ${f}: ${describeErr(p.error)}`); continue; }
    cAccepted++;
    if (g?.ok) {
      const a = p.value;
      const b = g.value as any;
      if (toFen(a) !== toFen(b) || a.halfmoveClock !== b.halfmoveClock || a.fullmoveNumber !== b.fullmoveNumber ||
        a.epSquare !== b.epSquare || a.castling !== b.castling || a.blackToMove !== b.blackToMove ||
        !a.board.every((v: number, k: number) => v === b.board[k]))
        fail(`C accepted position differs from the grammar-only parse: ${f}`);
    }
    roundTrips(f, p.value);
  } else if (p.ok) fail(`C wrongly ACCEPTED: ${f} (oracle: ${want})`);
  else if (!(p.error instanceof FenError)) fail(`C non-FenError on ${f}: ${describeErr(p.error)}`);
  else if ((p.error as Error).message !== want) fail(`C wrong first fault: ${f}: got "${(p.error as Error).message}" want "${want}"`);
}
console.log(`C ${FUZZ} random FENs (seed ${seed}); oracle buckets: ${[...tally].sort().map(([k, v]) => `${k} ${v}`).join(", ")}; accepted+round-tripped ${cAccepted}`);

// ---------- D: positive corpus by play ----------
console.log("== D positive corpus by play");
const ROOTS = ACCEPT.slice(0, 6);
let dPositions = 0;
let dEp = 0;
let dCastle = 0;
let dCheck = 0;
const seen = new Set<string>();
for (let game = 0; game < GAMES; game++) {
  const pos = parseFen(ROOTS[game % ROOTS.length] as string);
  for (let ply = 0; ply < 250; ply++) {
    const f = toFen(pos);
    const r = attempt(() => parseFen(f));
    dPositions++;
    seen.add(f.split(" ").slice(0, 4).join(" "));
    if (pos.epSquare !== -1) dEp++;
    if (pos.castling !== 0) dCastle++;
    if (!r.ok) fail(`D reached by play but REJECTED: ${f}: ${describeErr(r.error)}`);
    else roundTrips(f, r.value);
    const moves = legalMoves(pos);
    if (toFen(pos) !== f) fail(`D legalMoves mutated its argument at ${f}`);
    if (moves.length === 0) break;
    makeMove(pos, pick(moves));
    // side to move in check (legal) — counted with the own oracle, for coverage only
    const nf = toFen(pos);
    const gg = readGrid(nf.split(" ")[0] as string);
    const stm = nf.split(" ")[1] === "w";
    for (let rr = 0; rr < 8; rr++) for (let ff = 0; ff < 8; ff++)
      if (at(gg, rr, ff) === (stm ? "K" : "k") && attacked(gg, rr, ff, !stm)) dCheck++;
  }
}
console.log(`D ${GAMES} games, ${dPositions} positions (${seen.size} distinct boards), ep set ${dEp}, castling held ${dCastle}, side to move in check ${dCheck}`);

// ---------- E: production corpora ----------
console.log("== E production corpora");
const corpus = await import(`${tree}/src/puzzle-corpus.ts`);
const mirror = await import(`${tree}/src/evaluate.mirror-corpus.ts`);
const eFens: string[] = [
  ...(corpus.PUZZLES ?? []).map((p: { fen: string }) => p.fen),
  ...(corpus.HANGING_CORPUS ?? []).map((p: { fen: string }) => p.fen),
  ...(mirror.PERFT_POSITIONS ?? []).map((p: { fen: string }) => p.fen),
];
let eOk = 0;
for (const f of eFens) {
  const r = attempt(() => parseFen(f));
  if (!r.ok) fail(`E production corpus row REJECTED: ${f}: ${describeErr(r.error)}`);
  else if (roundTrips(f, r.value)) eOk++;
}
console.log(`E ${eOk}/${eFens.length} corpus FENs accepted and round-tripped`);

console.log(`== RESULT ${failures === 0 ? "PASS" : `FAIL (${failures} failure lines)`}`);
process.exit(failures === 0 ? 0 : 1);
