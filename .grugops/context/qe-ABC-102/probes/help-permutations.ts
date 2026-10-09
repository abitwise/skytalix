// QE probe for ABC-102: does ANY order of the seven help tokens hide one at the narrowest frame?
// Run from the worktree root: node .grugops/context/qe-ABC-102/probes/help-permutations.ts
import { helpMessages } from "../../../../src/command-input.ts";
import { MESSAGE_ROWS, PROMPT_ROWS } from "../../../../src/frame.ts";
import { gameStatusOf, newGame } from "../../../../src/history.ts";
import { makeRenderSeam } from "../../../../src/render-seam.ts";

const start = newGame("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
function* perms(xs: string[]): Generator<string[]> {
  if (xs.length <= 1) { yield xs; return; }
  for (let i = 0; i < xs.length; i++)
    for (const rest of perms([...xs.slice(0, i), ...xs.slice(i + 1)])) yield [xs[i] as string, ...rest];
}
let total = 0; let hiding = 0; const examples: string[][] = [];
for (const mode of ["unicode", "ascii"] as const) {
  const render = makeRenderSeam(mode, "white-bottom");
  for (const order of perms([...helpMessages()])) {
    total++;
    const rows = render(start, gameStatusOf(start), false, order);
    const region = rows.slice(rows.length - PROMPT_ROWS - MESSAGE_ROWS, rows.length - PROMPT_ROWS).join("\n");
    if (region.includes("(+")) { hiding++; if (examples.length < 3) examples.push([mode, ...order, "=>", region]); }
  }
}
// One more token of `moves`' length (ABC-036) in the delivered order:
const plus = makeRenderSeam("unicode", "white-bottom")(start, gameStatusOf(start), false, [...helpMessages(), "moves"]);
const plusRegion = plus.slice(plus.length - PROMPT_ROWS - MESSAGE_ROWS, plus.length - PROMPT_ROWS);
const plus2 = makeRenderSeam("unicode", "white-bottom")(start, gameStatusOf(start), false, [...helpMessages(), "moves", "x"]);
const plus2Region = plus2.slice(plus2.length - PROMPT_ROWS - MESSAGE_ROWS, plus2.length - PROMPT_ROWS);
console.log(JSON.stringify({ total, hiding, examples, eighthTokenMoves: plusRegion, ninthToken: plus2Region }, null, 1));
