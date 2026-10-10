// Applies one mutant to a scratch tree (never the worktree). Usage: node mutate.ts <tree> <id>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [T, id] = process.argv.slice(2) as [string, string];
const BP = join(T, "data/opening-book/book.json");
const CP = join(T, "tools/opening-book/compile.ts");
const book = () => JSON.parse(readFileSync(BP, "utf8"));
const save = (b: any) => writeFileSync(BP, `${JSON.stringify(b)}\n`);
const csrc = () => readFileSync(CP, "utf8");
const csave = (from: string | RegExp, to: string) => {
  const s = csrc(); const n = s.replace(from, to);
  if (n === s) throw new Error(`mutant ${id}: pattern not found`);
  writeFileSync(CP, n);
};
const START = "ef1f7b1fab6d8a8e"; // filled below
const { zobristKey } = await import(join(T, "src/zobrist.ts"));
const { parseFen } = await import(join(T, "src/fen.ts"));
const sk = zobristKey(parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toString(16).padStart(16, "0");
void START;
switch (id) {
  case "CONTROL-none": break;
  case "A1-illegal-move": { const b = book(); b.positions[sk].m = b.positions[sk].m.map(([u, w]: any) => [u === "e2e4" ? "e2e5" : u, w]); save(b); break; }
  case "A2-unreachable-entry": { const b = book(); b.positions["ffffffffffffffff"] = { m: [["e2e4", 1]] }; save(b); break; }
  case "A3-weight-zero": { const b = book(); b.positions[sk].m[0][1] = 0; save(b); break; }
  case "A4-weight-fraction": { const b = book(); b.positions[sk].m[0][1] = 1.5; save(b); break; }
  case "A5-weight-string": { const b = book(); b.positions[sk].m[0][1] = "3"; save(b); break; }
  case "A6-oversize": { const b = book(); const k = Object.keys(b.positions).find((x) => b.positions[x].n)!; b.positions[k].n += "x".repeat(700_000); save(b); break; }
  case "A7-maxply-13": { const b = book(); b.maxPly = 13; save(b); break; }
  case "A8-e4-two-replies": { const b = book(); const k = Object.keys(b.positions).find((x) => b.positions[x].n === "King's Pawn Game")!; b.positions[k].m = b.positions[k].m.slice(0, 2); save(b); break; }
  case "A9-attribution-field": { const b = book(); b.attribution = "LICENSE.md"; save(b); break; }
  case "A10-code-in-data-dir": { writeFileSync(join(T, "data/opening-book/load.js"), "export {};\n"); break; }
  case "A11-keys-unsorted": { const b = book(); const ks = Object.keys(b.positions); const p: any = {}; for (const k of [...ks.slice(1), ks[0]]) p[k] = b.positions[k]; b.positions = p; save(b); break; }
  case "A12-m-unsorted": { const b = book(); b.positions[sk].m.reverse(); save(b); break; }
  case "A13-duplicate-uci": { const b = book(); b.positions[sk].m.push([...b.positions[sk].m[0]]); save(b); break; }
  case "A14-empty-m-no-name": { const b = book(); const k = Object.keys(b.positions).find((x) => b.positions[x].m.length === 0)!; delete b.positions[k].n; save(b); break; }
  case "A15-control-byte-name": { const b = book(); const k = Object.keys(b.positions).find((x) => b.positions[x].n)!; b.positions[k].n = "\u001b[31mRed"; save(b); break; }
  case "A16-commit-prefix": { const b = book(); b.source.commit = b.source.commit.slice(0, 8); save(b); break; }
  case "A17-extra-field": { const b = book(); b.positions[sk].x = "anything"; b.format = 2; save(b); break; }
  case "A18-zobrist-drift": { const p = join(T, "src/zobrist.ts"); const s = readFileSync(p, "utf8"); const n = s.replace(/if \(position\.blackToMove\) key \^= BLACK_TO_MOVE;/, "if (position.blackToMove) key ^= BLACK_TO_MOVE ^ 1n;"); if (n === s) throw new Error("zobrist pattern"); writeFileSync(p, n); break; }
  case "A19-ply13-move": {
    // give a reachable empty-m leaf at ply 12 a legal move, so a 13-ply line exists
    const { legalMoves } = await import(join(T, "src/legal.ts")); const { makeMove } = await import(join(T, "src/apply.ts")); const { squareName } = await import(join(T, "src/position.ts"));
    const b = book(); const uci = (m: any) => `${squareName(m.from)}${squareName(m.to)}${["", "", "n", "b", "r", "q"][m.promotion] ?? ""}`;
    const hex = (p: any) => zobristKey(p).toString(16).padStart(16, "0");
    let frontier = [parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")]; const seen = new Set<string>();
    for (let ply = 0; ply < 12; ply++) { const next: any[] = []; for (const p of frontier) { const k = hex(p); const e = b.positions[k]; if (!e || seen.has(k)) continue; seen.add(k); const lm = legalMoves(p); for (const [u] of e.m) { const c = { ...p, board: new Uint8Array(p.board) }; makeMove(c, lm.find((x: any) => uci(x) === u)); next.push(c); } } frontier = next; }
    const leaf = frontier.find((p) => { const e = b.positions[hex(p)]; return e && e.m.length === 0 && !seen.has(hex(p)); })!;
    b.positions[hex(leaf)].m = [[uci(legalMoves(leaf)[0]), 1]]; save(b); break; }
  case "C1-skip-bad-san": csave(`if (parsed.outcome !== "move") throw new Error(\`\${where}: "\${san}" is \${parsed.outcome}\`);`, `if (parsed.outcome !== "move") return;`); break;
  case "C2-no-header-check": csave(/if \(rows\[0\] !== HEADER\)\n\s+throw new Error\([^;]+;/, ""); break;
  case "C3-no-column-check": csave(/if \(columns\.length !== 3\) throw[^;]+;/, ""); break;
  case "C4-no-two-names-check": csave(`end.name !== undefined && end.name !== name`, `false`); break;
  case "C5-no-control-check": csave(/if \(hasControlByte\(name\)\) throw[^;]+;/, ""); break;
  case "C6-write-before-validate": csave(`const texts = SOURCE_FILES`, `writeFileSync(outPath, "");\n  const texts = SOURCE_FILES`); break;
  case "C7-no-collision-check": csave(/if \(found\.fen !== fen\) throw[^;]+;/, ""); break;
  case "C8-no-key-sort": csave(`[...entries.keys()].sort()`, `[...entries.keys()]`); break;
  case "C9-no-m-sort": csave(`.sort(([a], [b]) => (a < b ? -1 : 1))`, ``); break;
  case "C10-uniform-weights": csave(`= "line-count";`, `= "uniform";`); break;
  case "C11-maxply-14": csave(`const MAX_PLY = 12;`, `const MAX_PLY = 14;`); break;
  case "C12-timestamp": csave(`format: 1,`, `format: 1, generated: Date.now(),`); break;
  case "C13-abs-path": csave(`writeFileSync(outPath, compileBook(texts, commit));`, `writeFileSync(outPath, compileBook(texts, commit).replace("}\\n", \`,"from":\${JSON.stringify(sourceDir)}}\\n\`));`); break;
  case "C14-random-order": csave(`[...entries.keys()].sort()`, `[...entries.keys()].sort(() => Math.random() - 0.5)`); break;
  case "C15-san-only-first-12": csave(`const parsed = parseSan(position, san);`, `if (ply >= MAX_PLY) return;\n        const parsed = parseSan(position, san);`); break;
  case "C16-control-boundary": csave(`code < 0x20 || code === 0x7f`, `code < 0x07 || code === 0x7f`); break;
  case "C17-commit-ignored": csave(`source: { repo: "lichess-org/chess-openings", commit },`, `source: { repo: "lichess-org/chess-openings", commit: SOURCE_COMMIT },`); break;
  case "C18-name-past-12": csave(`if (sans.length > MAX_PLY) continue;`, ``); break;
  default: throw new Error(`unknown mutant ${id}`);
}
