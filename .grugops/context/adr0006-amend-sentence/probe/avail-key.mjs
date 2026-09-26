/**
 * PROBE (adr0006-amend-sentence): ADR-0006's 2026-09-25 amendment says "An availability key would
 * collide the two, and the table would return a wrong score." Test it against the real search.
 *
 * Copies `src/` to a scratch tree OUTSIDE the repository (argv[2]) and edits `search.ts` so the
 * TABLE (probe and store only) is keyed on a castling-AVAILABILITY key: the rights key with every
 * right that no castle move uses right now (for either side) left out. `keys[]` (the in-tree
 * repetition array) and `zobristKeyAfterMove` are untouched. Each exact-string edit is asserted to
 * match once. A shadow map records, per table key, the RIGHTS key of the node that stored it, so a
 * probe hit whose rights key differs is a FOREIGN hit (a different position's entry), and a foreign
 * hit that returns a cutoff is a foreign SCORE used. Root scores are compared with the clean
 * (rights-keyed) search. No `src/` file in the repository is touched.
 *
 * Usage: node avail-key.mjs <scratch-dir> <repo-root>
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [scratch, repo] = process.argv.slice(2);
const EDITS = [
  [
    "  const slot = switches.table ? probeTable(key) : -1;\n  if (slot !== -1) {\n    const settled = tableCutoff(slot, depth, alpha, beta, ply);\n    if (settled !== null) return settled;\n  }",
    "  const ttKey = globalThis.__ttKey ? globalThis.__ttKey(position, key) : key;\n  const slot = switches.table ? probeTable(ttKey) : -1;\n  if (slot !== -1) {\n    const settled = tableCutoff(slot, depth, alpha, beta, ply);\n    globalThis.__onHit?.(ttKey, key, settled !== null);\n    if (settled !== null) return settled;\n  }",
  ],
  [
    "  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);",
    "  globalThis.__onStore?.(ttKey, key);\n  if (switches.table) storeEntry(ttKey, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);",
  ],
  [
    "  const slot = switches.table ? probeTable(rootKey) : -1;",
    "  const rootTtKey = globalThis.__ttKey ? globalThis.__ttKey(position, rootKey) : rootKey;\n  const slot = switches.table ? probeTable(rootTtKey) : -1;",
  ],
  [
    "  if (switches.table) storeEntry(rootKey, depth, BOUND_EXACT, best, 0, bestMove);",
    "  globalThis.__onStore?.(rootTtKey, rootKey);\n  if (switches.table) storeEntry(rootTtKey, depth, BOUND_EXACT, best, 0, bestMove);",
  ],
];

const dir = join(scratch, "avail");
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
cpSync(join(repo, "src"), join(dir, "src"), { recursive: true });
const file = join(dir, "src", "search.ts");
let text = readFileSync(file, "utf8");
for (const [from, to] of EDITS) {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`edit matched ${n} times: ${from.slice(0, 60)}`);
  text = text.replace(from, to);
}
writeFileSync(file, text);

const { parseFen } = await import(join(dir, "src", "fen.ts"));
const { legalMoves } = await import(join(dir, "src", "legal.ts"));
const { zobristKey } = await import(join(dir, "src", "zobrist.ts"));
const { FLAG_CASTLE } = await import(join(dir, "src", "moves.ts"));
const P = await import(join(dir, "src", "position.ts"));
const s = await import(join(dir, "src", "search.ts"));

/** The castling rights a castle move could use RIGHT NOW, for the side to move and the other side. */
function availableMask(position) {
  let mask = 0;
  const flagOf = (m) => {
    const black = m.to >= 0x70;
    const king = (m.to & 7) === 6;
    return black ? (king ? P.CASTLE_BK : P.CASTLE_BQ) : king ? P.CASTLE_WK : P.CASTLE_WQ;
  };
  for (const m of legalMoves(position)) if (m.flags & FLAG_CASTLE) mask |= flagOf(m);
  const other = { ...position, board: position.board.slice(), blackToMove: !position.blackToMove, epSquare: P.NO_SQUARE };
  for (const m of legalMoves(other)) if (m.flags & FLAG_CASTLE) mask |= flagOf(m);
  return mask & position.castling;
}
const availKey = (position) => zobristKey({ ...position, castling: availableMask(position) });

let stats;
function install(on) {
  if (!on) {
    globalThis.__ttKey = undefined; globalThis.__onHit = undefined; globalThis.__onStore = undefined;
    return;
  }
  const shadow = new Map();
  stats = { hits: 0, foreignHits: 0, foreignCutoffs: 0 };
  globalThis.__ttKey = (position) => availKey(position);
  globalThis.__onStore = (ttKey, rightsKey) => shadow.set(ttKey, rightsKey);
  globalThis.__onHit = (ttKey, rightsKey, cut) => {
    stats.hits++;
    if (shadow.get(ttKey) !== rightsKey) {
      stats.foreignHits++;
      if (cut) stats.foreignCutoffs++;
    }
  };
}

const ROOTS = [
  ["knight-g1 w K", "4k3/8/8/8/8/8/8/4K1NR w K - 0 1", [3, 4, 5, 6]],
  ["knight-g1 w -", "4k3/8/8/8/8/8/8/4K1NR w - - 0 1", [3, 4, 5, 6]],
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", [3, 4]],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", [3, 4]],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", [3, 4]],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", [3, 4]],
];
const DOORS = { search: s.search, pre121: s.searchWithoutPvsOrReductions };

for (const [name, fen, depths] of ROOTS) {
  for (const d of depths) {
    for (const [door, fn] of Object.entries(DOORS)) {
      install(false);
      const clean = fn(parseFen(fen), d).score;
      install(true);
      const avail = fn(parseFen(fen), d).score;
      const row = { name, d, door, clean, avail, same: clean === avail, ...stats };
      install(false);
      console.log(JSON.stringify(row));
    }
  }
}
