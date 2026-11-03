import { parseFen } from "<worktree>/src/fen.ts";
import { legalMoves } from "<worktree>/src/legal.ts";
import { squareName } from "<worktree>/src/position.ts";
import { isLosingCapture, see } from "<worktree>/src/see.ts";
const mv = (m: any) => squareName(m.from) + squareName(m.to);
const HAND: [string, string, number][] = [
 ["1k1r4/1pp4p/p7/4p3/8/P5P1/1PP4P/2K1R3 w - - 0 1", "e1e5", 100],
 ["1k1r3q/1ppn3p/p4b2/4p3/8/P2N2P1/1PP1R1BP/2K1Q3 w - - 0 1", "d3e5", -220],
 ["4k3/8/3p4/4p3/8/8/8/4QK2 w - - 0 1", "e1e5", -800],
 ["3rk3/3r4/8/8/8/8/3R4/3QK3 w - - 0 1", "d2d7", 0],
 ["4k3/8/4p3/3n4/8/4N3/8/4K3 w - - 0 1", "e3d5", 0],
 ["4k3/8/4p3/3n4/8/8/6B1/4K3 w - - 0 1", "g2d5", -10],
 ["4k3/8/8/3n4/4P3/8/8/4K3 w - - 0 1", "e4d5", 320],
 ["3rk3/8/8/3p4/8/8/3R4/3RK3 w - - 0 1", "d2d5", 100],
 ["3qk3/3r4/8/3p4/8/8/3R4/3RK3 w - - 0 1", "d2d5", -400],
 ["4k3/8/2p5/3p4/8/8/6B1/4K2Q w - - 0 1", "g2d5", -130],
 ["4k3/8/4p3/3p4/4P3/8/8/4K3 w - - 0 1", "e4d5", 0],
 ["4k3/8/8/3r4/8/8/8/3QK3 w - - 0 1", "d1d5", 500],
 ["4k3/8/8/2b5/3n4/8/3R4/3RK3 w - - 0 1", "d2d4", 150],
 ["4k3/3p4/8/8/8/8/8/3QK3 w - - 0 1", "d1d7", -800],
 ["4k3/3p4/8/8/8/8/3Q4/3RK3 w - - 0 1", "d2d7", 100],
 ["3rk3/8/8/8/3P4/2P5/8/4K3 b - - 0 1", "d8d4", -400],
 ["3qk3/3r4/8/8/3P4/8/8/3RK3 b - - 0 1", "d7d4", 100],
 ["4k3/8/3p1p2/4p3/2N5/5N2/8/4K3 w - - 0 1", "f3e5", -220],
 ["4k3/8/2p5/3q4/4P3/8/8/4K3 w - - 0 1", "e4d5", 800],
 ["4k3/8/2p5/3p4/8/8/3Q4/3RK3 w - - 0 1", "d2d5", -700],
 ["6qk/5b2/8/3p4/8/2N5/8/3RK3 w - - 0 1", "c3d5", -220],
 ["3rk3/3q4/8/8/8/8/3P4/4K3 b - - 0 1", "d7d2", 100],
 ["3rk3/8/8/3b4/8/2N5/8/4K3 w - - 0 1", "c3d5", 10],
];
for (const [fen, uci, want] of HAND) { const p = parseFen(fen); const m = legalMoves(p).find((x) => mv(x) === uci && x.promotion === 0); const v = m ? see(p, m) : NaN; console.log(v === want ? "ok " : "BAD", uci, v, want, m ? isLosingCapture(p, m) : "-", fen); }
