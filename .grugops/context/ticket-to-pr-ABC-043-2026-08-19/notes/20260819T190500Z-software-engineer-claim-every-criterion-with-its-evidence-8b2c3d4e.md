---
id: 20260819T190500Z-software-engineer-claim-every-criterion-with-its-evidence-8b2c3d4e
kind: claim
by: software-engineer
at: 2026-08-19T19:05:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# Every criterion, its verdict, and the evidence — measured on `grugops/abc043-the-live-session` @ `39deb99`

No `finding` is admissible on this install, so these are `claim`s: they are my measurements, not a
stamped verdict, and QE's hop is where they get looked at.

| criterion | verdict | evidence |
|---|---|---|
| `A1` — one call, six options, no cast, no adapter | **MET** | `tsc --noEmit` clean with the six merged types meeting directly; `runTurnLoop(` occurs exactly once in the executable module; each option pinned to its supplier by regex; the call window carries no `as` and no `=>`. Mutant `M8` (a placeholder opponent inline) and `M5` (`humanColour` frozen) both red it. |
| `A2` — a scripted game end to end | **MET** | Child `mate`: `--colour white`, script `f3` / `zzz` / `g4`, deterministic opponent `e5` then `Qh4#`. Exit **0**. **6 frames**, which is `1 + 4 plies + 1 non-advancing-with-a-message` asserted as the formula. The last frame is compared **byte for byte** against `makeRenderSeam(...)` over the replayed mated position, and `gameStatusOf` of that position is `black-wins` / `checkmate`. `input ended` is ABSENT — it ended on the mate, not on the pipe. |
| `A3` — a parser bug is an internal error, exit non-zero | **MET** | Child `parserBug`: the parser throws under the REAL reader and the REAL loop. Exit **70**. `internal error…` on stderr. **None** of the ten `TerminalReason` values and none of `win`/`draw`/`resign`/`checkmate`/`stalemate` on either channel. Exactly **one** frame — the one already rendered — so no result screen follows. Non-vacuity asserted first: the child rendered a frame and reached the prompt. |
| `A4` — end-of-input is the clean path | **MET** | Child `truncated`: `e4` with no trailing newline, no hook. `INPUT_ENDED_NOTICE` **once**, exit **0**, one frame, no internal-error marker. Asserted AGAINST `A3` in both directions: the codes differ, the crash child carries no notice, the clean child carries no marker. |
| `A5` — an engine fault is not a chess outcome | **MET** | Children `engineThrows` and `engineForeign`, both `--colour black` so the engine acts first. Both exit **0**, both write one frame, neither names an `EndReason` word or a result word, neither writes the crash line or the notice. The foreign move is a REAL legal move with `captured` falsified — the field `playMove` builds the undo record from. |
| `A6` — one frame session, one writer, no row-count literal | **MET** | `beginFrameSession` occurs **zero** times in the entry point and **once** in `src/turn-loop.ts`; the `mate` child's **6** frames all carry the reference height and its stdout has **zero** CSI introducers. The entry point's numeric literals are transcribed (`0`, `0x20`, `0x7f`, `1`, `2`, `70`) and none is a row count; the suite writes no frame height down either, asserted for every height the four (mode, orientation) pairs produce. |
| `A7` — both colour directions | **MET** | Children `colourBlack` and `colourWhite`. Each child's frames are compared **frame by frame** against the game its script describes, replayed through the merged modules. Plus the positional witness: **2** frames precede the first prompt on `black` and **1** on `white`, so no line was read before the engine's opening ply. Mutant `M5` and mutant `M4` both red it. |
| `A8` — no production change outside the entry point | **MET** | `git diff --numstat 54cbb23 HEAD -- src` = `src/cli.ts` (+91/−17) and `src/cli.test.ts` (+704/−54), nothing else. `git diff --exit-code` against `54cbb23` on `turn-loop.ts`, `frame.ts`, `render-seam.ts`, `line-input.ts`, `engine.ts`, `move-input.ts`, `command-input.ts` — **all seven byte-identical**. Suite **1189 passed / 39 files**, skip **0**, `PERFT_DEEP=1` **32/32**. |
| `G6` — the seam built once, called nowhere | **MET** | `createLineInputSeam(` occurs once; it is constructed inside the options object and bound to no name, so there is no identifier a second call could be made through. Its own row reds on the name-binding mutant. |

## The gate, run in a contained worktree

| step | command | result |
|---|---|---|
| suite | `npx vitest run` | **1189 passed / 39 files** (base `54cbb23`: 1181 / 39) |
| skips | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed**, 36.19 s |
| lint | `npm run lint` | 70 files, no fixes applied |
| typecheck | `npm run typecheck` | clean |
| build | `npm run build` | clean (it is `tsc --noEmit`) |

## Two things a reader should not over-read

- **`A2`'s `result` and `reason` are asserted in-process, not read off the child.** Nothing prints
  them: the result screen is `ABC-044`. What the child proves is that the last frame it wrote is the
  frame the loop rendered for that position; what the in-process assertion adds is that
  `gameStatusOf` calls that position `black-wins` / `checkmate`. That is the strongest instrument
  available before `ABC-044` exists, and it is stated rather than dressed up.
- **No criterion here runs the REAL engine end to end.** BA/PM named that gap; it is still open and
  no ticket is cut for it. Every child that reaches an engine ply carries a double, including
  `ABC-042`'s two colour children — see the observation note on lane cost for why that had to change.
