// ABC-245 fixture generator (scratch, never in the lane). Usage: node fixture-gen.ts 97 7 <absolute path to a tree's src/>
// Seed 7 gave the committed FAR_MOVES (97 plies, repeat d7e8). DFS: white moves the queen only, every position distinct.
const W = process.argv[4] ?? "./src/"; // the tree's src/ (scratch: the worktree's)
const { parseFen } = await import(W + "fen.ts");
const { legalMoves } = await import(W + "legal.ts");
const { makeMove, unmakeMove } = await import(W + "apply.ts");
const { repetitionKey } = await import(W + "gameend.ts");
const { zobristKey } = await import(W + "zobrist.ts");
const { squareName } = await import(W + "position.ts");
const { toFen } = await import(W + "fen.ts");
function sq(p:any, piece:string){ const b=toFen(p).split(" ")[0].split("/"); for(let r=0;r<8;r++){let f=0; for(const ch of b[r]){ if(/\d/.test(ch)) f+=Number(ch); else { if(ch===piece) return [f,7-r]; f++; } } } return [-9,-9]; }
const cheb=(a:number[],b:number[])=>Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]));
const label = (m: any) => `${squareName(m.from)}${squareName(m.to)}`;
const key = (p: any) => repetitionKey(p, zobristKey(p));
const START = "4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1";
const pos = parseFen(START);
const C = key(pos);
const path: string[] = [];
const seen = new Set<bigint>([C]);
const play = (t: string) => { const m = legalMoves(pos).find((x: any) => label(x) === t); if (!m) throw t; makeMove(pos, m); path.push(t); };
for (const t of "b1b2 e8d8 b2b1 d8e8".split(" ")) { play(t); if (key(pos) !== C) seen.add(key(pos)); }
const ROOT_PLY = Number(process.argv[2] ?? 97); // index of the root
let seed = Number(process.argv[3] ?? 7);
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const QUEEN = (m: any) => true;
let nodes = 0;
function dfs(ply: number): boolean {
  if (++nodes > 2e6) throw new Error("budget");
  if (ply === ROOT_PLY) {
    if (pos.halfmoveClock !== ply) return false;
    // root: black to move, a legal move makes C
    for (const m of legalMoves(pos)) { const u = makeMove(pos, m); const k = key(pos); unmakeMove(pos, m, u); if (k === C) { return true; } }
    return false;
  }
  const ms = legalMoves(pos).filter((m: any) => {
    const u = makeMove(pos, m); const ok = pos.halfmoveClock === ply + 1; unmakeMove(pos, m, u); return ok;
  });
  // white: queen moves only (white king stays on e1)
  const filtered = ms.filter((m: any) => (pos.sideToMove ?? pos.turn) === undefined || true);
  const order = filtered.map((m: any) => [rnd(), m]).sort((a: any, b: any) => a[0] - b[0]).map((x: any) => x[1]);
  for (const m of order) {
    const from = squareName(m.from);
    if (from === "e1") continue;
    const u = makeMove(pos, m);
    const k = key(pos);
    const remaining = ROOT_PLY - (ply + 1); // plies left to the root
    const bk = sq(pos, "k"), q = sq(pos, "Q");
    const blackLeft = Math.floor(remaining / 2);
    let ok = cheb(bk, [4,7]) - 1 <= blackLeft && bk[1] >= 4;
    if (remaining === 0 && !(q[0]===1 && q[1]===0)) ok = false;
    if (remaining > 0 && q[0]===1 && q[1]===0 && remaining < 3) ok = ok;
    if (ok && !seen.has(k) && k !== C && legalMoves(pos).length > 0) {
      seen.add(k); path.push(label(m));
      if (dfs(ply + 1)) return true;
      path.pop(); seen.delete(k);
    }
    unmakeMove(pos, m, u);
  }
  return false;
}
// near the end steer: no steering, rely on dfs
if (dfs(4)) {
  // find the move to C
  for (const m of legalMoves(pos)) { const u = makeMove(pos, m); const k = key(pos); unmakeMove(pos, m, u); if (k === C) console.log("REPEAT", label(m)); }
  console.log("MOVES", path.join(" "));
  console.log("plies", path.length, "nodes", nodes);
} else console.log("none", nodes);
