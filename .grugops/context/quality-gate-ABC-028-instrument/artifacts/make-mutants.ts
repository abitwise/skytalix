/**
 * Builds the wrong panes `A4` names, each as the DELIVERED source text
 * (md5 54fd4346dcc1a0060c4e66ae0149265d) plus exactly one anchored edit.
 * Nothing under `src/` is written; every mutant lands in `probe/mutants/`.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "..", "src", "history-pane.ts"), "utf8");
const md5 = createHash("md5").update(source).digest("hex");
console.log(`delivered src/history-pane.ts md5 = ${md5}`);
if (md5 !== "54fd4346dcc1a0060c4e66ae0149265d") throw new Error("source is not the delivered pane");

const AFTER_SETUP = "  const firstVisible = firstVisiblePly(moves.length, position.blackToMove);\n";
const BEFORE_RETURN = "  return rows;\n}";

function replaceOnce(text: string, needle: string, replacement: string): string {
  const first = text.indexOf(needle);
  if (first < 0 || text.indexOf(needle, first + 1) >= 0) {
    throw new Error(`anchor not unique: ${JSON.stringify(needle.slice(0, 40))}`);
  }
  return text.slice(0, first) + replacement + text.slice(first + needle.length);
}

/** Mutate right after setup, restore right before the return: "mid-render, restored before return". */
function midRender(name: string, mutate: string, restore: string): [string, string] {
  let text = replaceOnce(source, AFTER_SETUP, `${AFTER_SETUP}\n  // ${name}\n${mutate}`);
  text = replaceOnce(text, BEFORE_RETURN, `  // ${name} restore\n${restore}\n${BEFORE_RETURN}`);
  return [name, text];
}

const mutants: [string, string][] = [
  // The delivered pane, unchanged — the positive control.
  ["WCLEAN", source],

  midRender(
    "WFENMID",
    '  const savedFen = history.initialFen;\n' +
      '  (history as { initialFen: string }).initialFen = "8/8/8/8/8/8/8/8 w - - 0 1";\n',
    "  (history as { initialFen: string }).initialFen = savedFen;",
  ),

  midRender(
    "WPOSMID",
    "  const caller = history.position;\n" +
      "  const savedNumber = caller.fullmoveNumber;\n" +
      "  const savedBlack = caller.blackToMove;\n" +
      "  caller.fullmoveNumber = 1;\n" +
      "  caller.blackToMove = !savedBlack;\n",
    "  caller.fullmoveNumber = savedNumber;\n  caller.blackToMove = savedBlack;",
  ),

  midRender(
    "WBOARDMID",
    "  const callerBoard = history.position.board;\n" +
      "  const savedByte = callerBoard[0] as number;\n" +
      "  callerBoard[0] = savedByte ^ 0xff;\n",
    "  callerBoard[0] = savedByte;",
  ),

  // Hostile variant 1: mutates the board with a TypedArray METHOD rather than an element write.
  midRender(
    "WBOARDSET",
    "  const callerBoard = history.position.board;\n" +
      "  const savedBoard = Uint8Array.from(callerBoard);\n" +
      "  const scrambled = Uint8Array.from(callerBoard);\n" +
      "  scrambled[0] = (scrambled[0] as number) ^ 0xff;\n" +
      "  callerBoard.set(scrambled);\n",
    "  callerBoard.set(savedBoard);",
  ),

  // Hostile variant 2: reaches the caller's board through its ArrayBuffer, so no write trap on
  // the board object can see it. Not one of A4's four named builds — a robustness probe.
  midRender(
    "WBOARDBUF",
    "  const alias = new Uint8Array(history.position.board.buffer);\n" +
      "  const savedAliasByte = alias[0] as number;\n" +
      "  alias[0] = savedAliasByte ^ 0xff;\n",
    "  alias[0] = savedAliasByte;",
  ),

  // Hostile variant 3: the instrument's THEORETICAL BLIND SPOT, built to be missed. It mutates the
  // caller's board through an alias and restores it with NO intervening access to the graph, so no
  // sample falls inside the window where the board differs. Built to measure the boundary, not to
  // be killed.
  midRender(
    "WBOARDBLIND",
    "  const blindAlias = new Uint8Array(history.position.board.buffer);\n" +
      "  const blindSaved = blindAlias[0] as number;\n" +
      "  blindAlias[0] = blindSaved ^ 0xff;\n" +
      "  blindAlias[0] = blindSaved;\n",
    "  void blindSaved;",
  ),

  midRender(
    "WMOVESWAP",
    "  const savedMoves = history.moves;\n" +
      "  (history as { moves: readonly Move[] }).moves = [...history.moves];\n",
    "  (history as { moves: readonly Move[] }).moves = savedMoves;",
  ),
];

// WSPLICE — mutates the CONTENTS of `moves` and puts them back. Structural, so it is written out
// rather than inserted: it splices the hidden prefix off, renders the window from index 0, and
// unshifts the prefix back. Byte-identical output to the delivered pane.
{
  let text = replaceOnce(
    source,
    AFTER_SETUP +
      "\n  for (let ply = 0; ply < firstVisible; ply++) makeMove(position, moves[ply] as Move);\n" +
      "\n  const pairs: MovePair[] = [];\n" +
      "  for (let ply = firstVisible; ply < moves.length; ply++) {\n",
    AFTER_SETUP +
      "\n  // WSPLICE\n" +
      "  const hidden = (moves as Move[]).splice(0, firstVisible);\n" +
      "  for (const hiddenMove of hidden) makeMove(position, hiddenMove);\n" +
      "\n  const pairs: MovePair[] = [];\n" +
      "  for (let ply = 0; ply < moves.length; ply++) {\n",
  );
  text = replaceOnce(
    text,
    BEFORE_RETURN,
    "  // WSPLICE restore\n  (moves as Move[]).unshift(...hidden);\n" + BEFORE_RETURN,
  );
  mutants.push(["WSPLICE", text]);
}

for (const [name, text] of mutants) {
  const directory = join(here, "mutants", name);
  mkdirSync(directory, { recursive: true });
  // The mutant lives three levels down, so its sibling imports are re-pointed at the real src.
  const rehomed = text.replaceAll('from "./', 'from "../../../src/');
  writeFileSync(join(directory, "history-pane.ts"), rehomed);
  const changed = rehomed === source.replaceAll('from "./', 'from "../../../src/');
  console.log(`  ${name.padEnd(10)} written, differs from delivered: ${!changed}`);
}
