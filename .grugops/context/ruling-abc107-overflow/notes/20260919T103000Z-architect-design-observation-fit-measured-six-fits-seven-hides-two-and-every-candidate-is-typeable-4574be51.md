---
id: 20260919T103000Z-architect-design-observation-fit-measured-six-fits-seven-hides-two-and-every-candidate-is-typeable-4574be51
kind: observation
by: architect-design
at: 2026-09-19T10:30:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ABC-033
  - EPIC-002
  - EPIC-003
  - ADR-0009
  - ADR-0022
  - src/frame.ts
  - src/move-input.ts
  - src/san.ts
  - src/history-pane.ts
supersedes:
---

# Fit, measured through the real pipeline at `2c96dbd`: six fits, seven hides two, eight hides three — and every candidate is typeable without the list

**NOT A STAMP.** `context.human_admission` is `off`; this is a hand-authored observation. Everything
below was produced by running the script at the end of this note with `node` against the delivered
`src/` in this worktree (Node runs `.ts` directly). No number is derived by arithmetic alone; the
capacity table is arithmetic and is labelled as such, and the fixture table is the pipeline's output.

## Geometry

`W` (widest panel row) = **21** — history pane 21 (`HISTORY_COLS` = 4 + 1 + 8 × 2), board 18, status
rows 17 / 13 / 11. `MESSAGE_ROWS` = 2 → **42 cells**.

Capacity per row by item length `L` (arithmetic: `floor((W+1)/(L+1))`; last row with `(+N more)`
reserved: `floor((W-10+1)/(L+1))`):

| L | per row | in 2 rows | last row with marker |
|---|---|---|---|
| 2 | 7 | 14 | 4 |
| 3 | 5 | 10 | 3 |
| 4 | 4 | 8 | 2 |
| 5 | 3 | 6 | 2 |
| 6 | 3 | 6 | 1 |
| 7 | 2 | 4 | 1 |

## Fixtures — `newGame(fen)` → `resolveMoveInput(history, line)` → `assembleFrame` with the real panels

All four FENs round-trip through `toFen` byte-identically (`true` in every row). `hidden` is read
from the emitted `(+N more)` marker; `per row` is items placed on row 0 / row 1.

**6 knights** `7k/8/2N1N3/1N3N2/8/1N6/2N5/K7 w - - 0 1`, `Nd4`, 6 candidates
- current: `["N2d4","N3d4","Nb5d4","Nfd4","Nc6d4","Ned4"]` → `|N2d4 N3d4 Nb5d4 Nfd4 |` / `|Nc6d4 Ned4           |` shown 6 hidden **0** per row 4/2
- `Nb3` rendering: shown 6 hidden 0, 5/1 — `b3`: 6/0 — `b3d4`: 4/2 — always-full `Nb3d4`: 3/3, hidden 0

**7 knights** `7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1`, `Nd4`, 7 candidates
- current: `["N2d4","Nb3d4","Nf3d4","Nb5d4","Nf5d4","Nc6d4","Ned4"]` → `|N2d4 Nb3d4 Nf3d4     |` / `|Nb5d4 Nf5d4 (+2 more)|` shown 5 hidden **2** per row 3/2
- `Nb3`: shown 7 hidden 0, 5/2 — `b3`: 7/0 — `b3d4`: 4/3 — always-full: shown 5 hidden 2

**8 knights** `7k/8/2N1N3/1N3N2/8/1N3N2/2N1N3/K7 w - - 0 1`, `Nd4`, 8 candidates
- current: `["Nc2d4","Ne2d4","Nb3d4","Nf3d4","Nb5d4","Nf5d4","Nc6d4","Ne6d4"]` → `|Nc2d4 Ne2d4 Nb3d4    |` / `|Nf3d4 Nb5d4 (+3 more)|` shown 5 hidden **3** per row 3/2
- `Nb3`: shown 8 hidden 0, 5/3 — `b3`: 7/1 — `b3d4`: 4/4 (zero headroom) — always-full: shown 5 hidden 3

**8 queens** `3Q3Q/Q7/6k1/8/Q6Q/8/5Q2/QK1Q4 w - - 0 1`, `Qd4`, 8 candidates (constructed here as the
other piece type that reaches the cap of 8; one queen per ray)
- current: `["Qa1d4","Qd1d4","Qfd4","Qa4d4","Qh4d4","Q7d4","Qd8d4","Qh8d4"]` → `|Qa1d4 Qd1d4 Qfd4     |` / `|Qa4d4 Qh4d4 (+3 more)|` shown 5 hidden **3** per row 3/2
- `Qa1`: shown 8 hidden 0, 5/3 — `a1`: 7/1 — `a1d4`: 4/4 — always-full: shown 5 hidden 3

**Summary — candidates per row / per region under the current rendering: 3 (full-origin items) to
4 (shorter qualifiers) per row, 6 per region. Under option 3 as `Nb3`: 5 per row, 10 per region.
Under option 3 as `b3d4`: 4 per row, 8 per region.**

## Reachability by typing, independent of the region

For every candidate in every fixture, `resolveMoveInput(history, text)` returned `kind: "move"` with
the candidate's own `from`/`to`:

| fixture | full-origin SAN (`N<from>d4` / `Q<from>d4`) | coordinate (`<from>d4`) |
|---|---|---|
| 6 knights | 6/6 | 6/6 |
| 7 knights | 7/7 | 7/7 |
| 8 knights | 8/8 | 8/8 |
| 8 queens | 8/8 | 8/8 |

(A first run of this check reported 0/8 everywhere: it compared `Move` objects by reference across
two separate `legalMoves` calls. Corrected to compare `from`/`to`; the 0/8 was the harness, not the
product, and is recorded so nobody re-finds it.)

## The script, verbatim (run with `node <file>` from the worktree root)

```ts
const ROOT = "<worktree>/src/";
const { assembleFrame, MESSAGE_ROWS, PROMPT_ROWS } = await import(`${ROOT}frame.ts`);
const { renderBoard } = await import(`${ROOT}render.ts`);
const { renderStatusPanel } = await import(`${ROOT}status-panel.ts`);
const { renderHistory } = await import(`${ROOT}history-pane.ts`);
const { newGame, gameStatusOf } = await import(`${ROOT}history.ts`);
const { resolveMoveInput } = await import(`${ROOT}move-input.ts`);
const { legalMoves } = await import(`${ROOT}legal.ts`);
const { squareName, pieceType, KNIGHT, QUEEN } = await import(`${ROOT}position.ts`);
const { toFen } = await import(`${ROOT}fen.ts`);
const FIXTURES = [
  { name: "6 knights", fen: "7k/8/2N1N3/1N3N2/8/1N6/2N5/K7 w - - 0 1", line: "Nd4", type: KNIGHT, letter: "N" },
  { name: "7 knights", fen: "7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1", line: "Nd4", type: KNIGHT, letter: "N" },
  { name: "8 knights", fen: "7k/8/2N1N3/1N3N2/8/1N3N2/2N1N3/K7 w - - 0 1", line: "Nd4", type: KNIGHT, letter: "N" },
  { name: "8 queens", fen: "3Q3Q/Q7/6k1/8/Q6Q/8/5Q2/QK1Q4 w - - 0 1", line: "Qd4", type: QUEEN, letter: "Q" },
];
function panels(history) {
  const status = gameStatusOf(history);
  return { board: renderBoard(history.position, "unicode", "white-bottom"),
           status: renderStatusPanel(history, status, false), history: renderHistory(history) };
}
function region(history, messages) {
  const frame = assembleFrame({ ...panels(history), messages }, "unicode");
  return frame.slice(frame.length - PROMPT_ROWS - MESSAGE_ROWS, frame.length - PROMPT_ROWS);
}
const hiddenOf = (rows) => { const m = /\(\+(\d+) more\)/.exec(rows.join(" ")); return m ? Number(m[1]) : 0; };
const perRow = (rows) => rows.map((r) => r.replace(/\(\+\d+ more\)/, "").trim().split(/\s+/).filter(Boolean).length);
for (const f of FIXTURES) {
  const history = newGame(f.fen);
  const legal = legalMoves(history.position);
  const outcome = resolveMoveInput(history, f.line);
  const moves = legal.filter((m) => squareName(m.to) === "d4" && pieceType(m.piece) === f.type);
  const renderings = {
    current: outcome.kind === "ambiguous" ? [...outcome.messages] : [],
    pieceOrigin: moves.map((m) => f.letter + squareName(m.from)),
    originOnly: moves.map((m) => squareName(m.from)),
    coordinate: moves.map((m) => squareName(m.from) + squareName(m.to)),
    alwaysFull: moves.map((m) => f.letter + squareName(m.from) + "d4"),
  };
  console.log(f.name, toFen(history.position) === f.fen, outcome.kind, moves.length);
  for (const [name, items] of Object.entries(renderings)) {
    const rows = region(history, items);
    console.log(name, items, rows, "hidden", hiddenOf(rows), "perRow", perRow(rows));
  }
  let sanOk = 0, coordOk = 0;
  for (const m of moves) {
    const a = resolveMoveInput(history, `${f.letter}${squareName(m.from)}${m.captured ? "x" : ""}${squareName(m.to)}`);
    const b = resolveMoveInput(history, `${squareName(m.from)}${squareName(m.to)}`);
    if (a.kind === "move" && a.move.from === m.from && a.move.to === m.to) sanOk++;
    if (b.kind === "move" && b.move.from === m.from && b.move.to === m.to) coordOk++;
  }
  console.log("reachable SAN", sanOk, "coord", coordOk, "of", moves.length);
}
```
