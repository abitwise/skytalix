const W = "/home/olger/projects/public/skytalix/.claude/worktrees/qe-ABC-269-freeze/src/";
const { PUZZLES, HANGING_CORPUS } = await import(W + "puzzle-corpus.ts");
const { MATE_CORPUS } = await import(W + "search.mate-corpus.ts");
const { parseFen } = await import(W + "fen.ts");
const PW = [0, 0, 1, 1, 2, 4, 0];
function phase(fen: string) {
  const p = parseFen(fen); let s = 0;
  for (let sq = 0; sq < 128; sq++) { if (sq & 0x88) continue; const pc = p.board[sq]; if (pc) s += PW[pc & 7]; }
  return s;
}
const rows: [string, string, number][] = [];
PUZZLES.forEach((r: any, i: number) => rows.push([`PUZZLES[${i}] ${r.name ?? r.id ?? ""}`, r.fen, phase(r.fen)]));
HANGING_CORPUS.forEach((r: any, i: number) => rows.push([`HANGING[${i}] ${r.name}`, r.fen, phase(r.fen)]));
MATE_CORPUS.forEach((f: string, i: number) => rows.push([`MATE[${i}]`, f, phase(f)]));
const by: Record<number, number> = {};
for (const r of rows) by[r[2]] = (by[r[2]] ?? 0) + 1;
console.log(JSON.stringify(by));
for (let ph = 0; ph <= 30; ph++) { const f = rows.filter(r => r[2] === ph).slice(0, 2); for (const r of f) console.log(ph, r[0], r[1]); }
