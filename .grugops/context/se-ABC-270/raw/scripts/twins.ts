// se-ABC-270 scratch: search placements of the extra white minor pair (black mirrored) on a "rnbq1rk1" back rank so that
// the phase-24 twins of ABC-083 A2 (b) and A3 (b) are green on the build and red with their term zeroed.
const W = process.argv[2];
const ev = await import(`${W}/src/evaluate.ts`);
const P = await import(`${W}/src/evaluate-params.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const { isInCheck } = await import(`${W}/src/legal.ts`).catch(() => ({}));
const { legalMoves } = await import(`${W}/src/legal.ts`);
const files = "abcdefgh";
// shapes: rank-7..rank-2 pawn rows (black on 7, white on 2/5/6), from ABC-083
const SH = { A2s: ["5ppp", "8", "8", "8", "8", "5PPP"], A2t: ["5ppp", "6P1", "8", "8", "8", "5P1P"],
  A3c: ["5ppp", "8", "5P2", "8", "8", "6PP"], A3t: ["5ppp", "8", "4P3", "8", "8", "6PP"] };
function rowStr(cells: string[]) { let s = "", e = 0; for (const c of cells) { if (c === ".") e++; else { if (e) s += e; e = 0; s += c; } } if (e) s += e; return s; }
function expand(r: string) { const out: string[] = []; for (const ch of r) { if (/\d/.test(ch)) for (let i = 0; i < +ch; i++) out.push("."); else out.push(ch); } return out; }
function build(shape: string[], wn: [number, number], wb: [number, number]) {
  // grid[rank 0..7][file], rank 0 = rank 1
  const g: string[][] = Array.from({ length: 8 }, () => Array(8).fill("."));
  const back = expand("rnbq1rk1"); for (let f = 0; f < 8; f++) { g[7][f] = back[f]; g[0][f] = back[f].toUpperCase(); }
  shape.forEach((r, i) => { const cells = expand(r); for (let f = 0; f < 8; f++) if (cells[f] !== ".") g[6 - i][f] = cells[f]; });
  for (const [[r, f], pc] of [[wn, "N"], [wb, "B"]] as const) { if (g[r][f] !== "." || g[7 - r][f] !== ".") return null; g[r][f] = pc; g[7 - r][f] = pc.toLowerCase(); }
  return g.slice().reverse().map(rowStr).join("/") + " w - - 0 1";
}
const zero = (name: string) => ({ ...P, [name]: { mg: 0, eg: 0 } });
const res: any[] = [];
for (let nr = 1; nr <= 3; nr++) for (let nf = 0; nf < 8; nf++) for (let br = 1; br <= 3; br++) for (let bf = 0; bf < 8; bf++) {
  const fens = Object.fromEntries(Object.entries(SH).map(([k, s]) => [k, build(s, [nr, nf], [br, bf])]));
  if (Object.values(fens).some((f) => f === null)) continue;
  let ok = true; for (const f of Object.values(fens) as string[]) { let p; try { p = parseFen(f); } catch { ok = false; continue; } if (ev.phaseOf(p) !== 24) ok = false; try { parseFen(f.replace(" w ", " b ")); } catch { ok = false; } if (legalMoves(p).length === 0) ok = false; }
  if (!ok) continue;
  const sc = (f: string) => ev.evaluate(parseFen(f));
  const a2 = sc(fens.A2s) - sc(fens.A2t), a3 = sc(fens.A3c) - sc(fens.A3t);
  const [a2z, a3z] = [ev.withParametersForTest(zero("KING_SHELTER_MISSING"), () => sc(fens.A2s) - sc(fens.A2t)), ev.withParametersForTest(zero("KING_FILE_HALF_OPEN"), () => sc(fens.A3c) - sc(fens.A3t))];
  // green: shelter/closed strictly higher; red zeroed: not strictly higher
  if (a2 > 0 && a3 > 0 && a2z <= 0 && a3z <= 0) res.push({ n: files[nf] + (nr + 1), b: files[bf] + (br + 1), a2, a2z, a3, a3z, fens });
}
console.log(res.length); for (const r of res.slice(0, 40)) console.log(JSON.stringify({ n: r.n, b: r.b, a2: r.a2, a2z: r.a2z, a3: r.a3, a3z: r.a3z }));
if (res[0]) console.log(JSON.stringify(res[0].fens, null, 1));
