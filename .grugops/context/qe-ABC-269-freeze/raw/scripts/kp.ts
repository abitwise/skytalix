import { analyse } from "./lib.ts";
const D: [string, string, string, string][] = [
 ["D1","w","8/5pk1/6p1/7p/3K3P/6P1/5P2/8 w - - 0 1","8/5pk1/6p1/7p/7P/6P1/5P2/K7 w - - 0 1"],
 ["D2","w","8/p1k5/1p4p1/4K3/8/8/PP5P/8 b - - 0 1","8/p1k5/1p4p1/8/8/8/PP5P/7K b - - 0 1"],
 ["D3","b","8/pp6/2p5/8/4kP2/1P4K1/P7/8 b - - 0 1","7k/pp6/2p5/8/5P2/1P4K1/P7/8 b - - 0 1"],
 ["D4","b","8/p7/6p1/3k3p/7P/6P1/5PK1/8 w - - 0 1","k7/p7/6p1/7p/7P/6P1/5PK1/8 w - - 0 1"],
 ["D5","w","8/5k2/1p6/p5p1/P3K1P1/1P6/8/8 b - - 0 1","7K/5k2/1p6/p5p1/P5P1/1P6/8/8 b - - 0 1"],
 ["D6","b","8/8/8/pp6/3k4/5P2/6PP/6K1 w - - 0 1","8/8/8/pp6/8/5P2/6PP/k5K1 w - - 0 1"],
 ["S1","w","6k1/p5pp/8/8/4K3/8/P5PP/8 w - - 0 1","6k1/p5pp/8/8/8/8/P5PP/7K w - - 0 1"],
 ["S2","b","8/pp3p2/8/3k4/8/8/PP3P2/1K6 b - - 0 1","k7/pp3p2/8/8/8/8/PP3P2/1K6 b - - 0 1"],
 ["S3","w","5k2/1pp2pp1/8/3K4/8/8/PP6/8 w - - 0 1","5k2/1pp2pp1/8/8/8/8/PP6/K7 w - - 0 1"],
];
for (const [id, side, c, k] of D) {
  const a = analyse(c), b = analyse(k);
  const sgn = (x: any, v: number) => ((side === "b") !== x.stmBlack ? -v : v); // to walking king's side
  const base = sgn(a, a.main) - sgn(b, b.main);
  const fc = sgn(a, a.forecast) - sgn(b, b.forecast);
  console.log(id, side, "phase", a.raw, b.raw, "base", base, "forecastE1", fc, "fullform", sgn(a,a.forecastFullForm)-sgn(b,b.forecastFullForm));
}
