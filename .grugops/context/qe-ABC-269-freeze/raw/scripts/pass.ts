import { analyse, parseFen, toFen } from "./lib.ts";
const PB = [0, 5, 10, 20, 35, 60, 100, 0];
const LAYOUT: Record<number, Record<string, string>> = {
  0: {},
  6: { b3: "R", b5: "N", g6: "r", g4: "n" },
  18: { b2: "Q", b3: "R", c3: "R", b5: "N", g7: "q", g6: "r", f6: "r", g4: "n" },
  24: { b2: "Q", b3: "R", c3: "R", b4: "B", c4: "B", b5: "N", c5: "N", g7: "q", g6: "r", f6: "r", g5: "b", f5: "b", g4: "n", f4: "n" },
};
function board(pieces: Record<string, string>) {
  const g: string[][] = Array.from({ length: 8 }, () => Array(8).fill(""));
  for (const [s, c] of Object.entries(pieces)) g[Number(s[1]) - 1][s.charCodeAt(0) - 97] = c;
  const rows = []; for (let r = 7; r >= 0; r--) { let row = "", e = 0; for (let f = 0; f < 8; f++) { const c = g[r][f]; if (!c) { e++; continue; } if (e) { row += e; e = 0; } row += c; } if (e) row += e; rows.push(row); }
  return rows.join("/");
}
const out: any[] = [];
for (const colour of ["w", "b"]) for (const rank of [2, 3, 4, 5, 6, 7]) for (const ph of [0, 6, 18, 24]) {
  if (colour === "b" && ![2, 5, 7].includes(rank)) continue;
  const pawnSq = colour === "w" ? `d${rank}` : `e${9 - rank}`;
  const base = { a8: "K", h1: "k", ...LAYOUT[ph] };
  const A = `${board({ ...base, [pawnSq]: colour === "w" ? "P" : "p" })} w - - 0 1`;
  const B = `${board(base)} w - - 0 1`;
  const a = analyse(A), b = analyse(B);
  out.push({ colour, rank, ph, pawnSq, A, B, rawA: a.raw, deltaA: a.delta, deltaB: b.delta, base: PB[rank - 1], mainA: a.main, mainB: b.main, fA: a.forecast, fB: b.forecast, check: a.check || b.check });
}
for (const o of out) {
  const sgn = o.colour === "w" ? 1 : -1;
  const read = sgn * ((o.fA - o.fB) - (o.mainA - o.mainB)) + o.base;
  console.log(o.colour, o.rank, o.ph, o.rawA, "delta", o.deltaA, o.deltaB, "base", o.base, "forecastTerm", read, (read / o.base).toFixed(3), o.check, o.A);
}
