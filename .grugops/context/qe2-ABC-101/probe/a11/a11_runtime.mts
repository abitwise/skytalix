// qe2-ABC-101: an independent runtime read of A11a/A11b/A11c/A11d with plain node (no vitest), against the
// B arm (git archive 081c3715) and the H arm (git archive d22a709f). Usage: node a11_runtime.mts <arms dir> <ticket page>
// The expected frames are read from the TICKET PAGE's A11b text (the contract), not from render.test.ts.
import { readFileSync } from "node:fs";

const [arms, ticket] = process.argv.slice(2) as [string, string];
const load = async (arm: string) => ({
  renderBoard: (await import(`${arms}/${arm}/src/render.ts`)).renderBoard,
  parseFen: (await import(`${arms}/${arm}/src/fen.ts`)).parseFen,
});
const B = await load("B");
const H = await load("H");
const FENS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
];
const ORI = ["white-bottom", "black-bottom"] as const;
const swap = (s: string) =>
  [...s].map((c) => {
    const p = c.codePointAt(0) as number;
    return p >= 0x2654 && p <= 0x2659 ? String.fromCodePoint(p + 6) : p >= 0x265a && p <= 0x265f ? String.fromCodePoint(p - 6) : c;
  }).join("");

// A11b from the ticket's A11b bullet: every backticked string that starts with a rank digit or three spaces.
const page = readFileSync(ticket, "utf8");
const a11b = page.slice(page.indexOf("**`A11b` (exact frames).**"), page.indexOf("**`A11c` (geometry and no colour).**"));
const frames = [...a11b.matchAll(/`([1-8] [^`]{16}|   [a-h](?: [a-h]){7})`/g)].map((m) => m[1] as string);
console.log(`A11b strings parsed from the ticket: ${frames.length} (expect 9 + 2 + 2 + 1 = 14)`);
const start = H.parseFen(FENS[0]);
const wb: string[] = H.renderBoard(start, "unicode", "white-bottom");
const bb: string[] = H.renderBoard(start, "unicode", "black-bottom");
console.log(`  white-bottom 9 rows equal the ticket: ${JSON.stringify(wb) === JSON.stringify(frames.slice(0, 9))}`);
console.log(`  black-bottom rows 1-2 / 7-8 / label equal the ticket: ${JSON.stringify([bb[0], bb[1]]) === JSON.stringify(frames.slice(9, 11))} / ${JSON.stringify([bb[6], bb[7]]) === JSON.stringify(frames.slice(11, 13))} / ${bb[8] === frames[13]}`);
console.log("  H white-bottom:\n    " + wb.join("\n    "));
console.log("  H black-bottom:\n    " + bb.join("\n    "));

// A11a: every piece's code point, read from the frame with the orientation rule, against the contract table.
const TABLE: Record<string, number> = { K: 0x265a, Q: 0x265b, R: 0x265c, B: 0x265d, N: 0x265e, P: 0x265f, k: 0x2654, q: 0x2655, r: 0x2656, b: 0x2657, n: 0x2658, p: 0x2659 };
let checked = 0, bad = 0;
for (const fen of FENS) {
  const rows = fen.split(" ")[0]!.split("/");
  for (const o of ORI) {
    const f: string[] = H.renderBoard(H.parseFen(fen), "unicode", o);
    rows.forEach((r, i) => {
      const rank = 8 - i;
      let file = 0;
      for (const ch of r) {
        if (/\d/.test(ch)) { file += Number(ch); continue; }
        const row = f[o === "white-bottom" ? 8 - rank : rank - 1] as string;
        const col = 2 + (o === "white-bottom" ? file : 7 - file) * 2 + 1;
        checked++;
        if ((row.codePointAt(col) as number) !== TABLE[ch]) bad++;
        file++;
      }
    });
  }
}
console.log(`A11a over all 6 matrix FENs x 2 orientations: ${checked} piece cells checked, ${bad} off the contract table`);

// A11c and A11d: geometry/ESC on every cell; ascii H == B byte for byte; unicode H == swap(B).
let geo = 0, esc = 0, asciiSame = 0, uniSwap = 0, cells = 0;
for (const fen of FENS) for (const o of ORI) for (const m of ["unicode", "ascii"]) {
  const h: string[] = H.renderBoard(H.parseFen(fen), m, o);
  const b: string[] = B.renderBoard(B.parseFen(fen), m, o);
  cells++;
  if (h.length === 9 && h.every((r) => [...r].length === 18 && r.length === 18)) geo++;
  if (!h.join("\n").includes("\u001b")) esc++;
  if (m === "ascii" && h.join("\n") === b.join("\n")) asciiSame++;
  if (m === "unicode" && h.join("\n") === swap(b.join("\n")) && h.join("\n") !== b.join("\n")) uniSwap++;
}
console.log(`A11c: ${geo}/${cells} cells 9 rows x 18 code points x 18 units; ${esc}/${cells} with 0 U+001B`);
console.log(`A11d (runtime): ascii frames H == B byte for byte ${asciiSame}/12; unicode H == B with the six pairs swapped (and != B) ${uniSwap}/12`);
