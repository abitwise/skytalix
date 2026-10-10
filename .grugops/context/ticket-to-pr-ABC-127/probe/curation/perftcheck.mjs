import { parse, perft } from "./oracle.mjs";
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";
const POS3 = "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1";
for (const [f, d, w] of [[START, 3, 8902], [START, 4, 197281], [POS3, 4, 43238], [POS3, 5, 674624]]) console.log(perft(parse(f), d) === w ? "OK" : "BAD", d, w);
