// qe-ABC-280 P3: the Lichess reading (readComments false) on comment shapes the deep row does not name.
// usage: node lexprobe.mjs <clone>
const { lexMovetext } = await import(`${process.argv[2]}/tools/tune/pgn.ts`);
const base = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 1-0";
const want = ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"];
const cases = {
  evalMate: "1. e4 { [%eval #-3] [%clk 0:05:00] } 1... e5 { [%eval 0.3] } 2. Nf3 Nc6 3. Bb5 a6 1-0",
  moveTextInComment: "1. e4 { 1. d4 d5 2. c4 } e5 2. Nf3 { Qxf7# M5 } Nc6 3. Bb5 a6 1-0",
  multiLineComment: "1. e4 { a long\ncomment over\nlines } e5 2. Nf3 Nc6 3. Bb5 a6 1-0",
  nagsAndMarks: "1. e4! $1 e5?! $6 2. Nf3 Nc6 3. Bb5!? a6 1-0",
  braceAdjacent: "1. e4{x}e5 2. Nf3{[%eval 1]}Nc6 3. Bb5 a6 1-0",
  // shapes the 2017-03 export is not known to carry (reported, not graded):
  semicolonComment: "1. e4 e5 ; a rest-of-line comment\n2. Nf3 Nc6 3. Bb5 a6 1-0",
  variation: "1. e4 e5 (1... c5 2. Nf3) 2. Nf3 Nc6 3. Bb5 a6 1-0",
  unterminated: "1. e4 e5 2. Nf3 { never closed Nc6 3. Bb5 a6 1-0",
};
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
console.log("base", eq(lexMovetext(base, false), { sans: want, comments: null }));
for (const [k, t] of Object.entries(cases)) {
  const r = lexMovetext(t, false);
  console.log(k, eq(r.sans, want) && r.comments === null ? "SAME" : `DIFFERS ${JSON.stringify(r)}`);
}
