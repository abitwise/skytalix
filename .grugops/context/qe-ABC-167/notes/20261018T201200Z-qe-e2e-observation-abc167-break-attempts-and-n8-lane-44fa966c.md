---
id: 20261018T201200Z-qe-e2e-observation-abc167-break-attempts-and-n8-lane-44fa966c
kind: observation
by: qe-e2e
task: qe-ABC-167
at: 2026-10-18T20:12:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - ADR-0044
  - NFR-008
  - .grugops/context/qe-ABC-167/probe/probe.ts
  - .grugops/context/qe-ABC-167/probe/probe.out
  - .grugops/context/qe-ABC-167/probe/window.mjs
supersedes:
---

# ABC-167 break attempts on the virtual clock, and N8-LANE: OWED

Hand-authored and unsealed. The probe imported the tip's `src/uci-session.ts` by absolute path from the session scratchpad.
Nothing was placed in `src/`. 36 dialogues ran; the full output is in `probe/probe.out`. **No wall-clock figure here is a reading.**

## Holds (no defect)
- **Degenerate time values give a depth-1 legal move, with no throw:**
  - `go movetime -5` and `go movetime 0` give d1 and `e2e4`;
  - `wtime -1000` gives d1.
- **A clock figure that is too large is still capped:** `movetime 1e5` is refused with one `info string`, and the search runs 3 000 ms.
- **Integer edges are dropped with one `info string`:**
  - `depth 99999999999999999999`, which is not a safe integer, is dropped;
  - `mate 1000000` → `maxDepth` 1 999 999 is still bounded by the clock.
- **Odd input lines are handled:**
  - tabs and padding are trimmed;
  - `UCI` and `Quit` in upper case are ignored, as the spec's exact tokens require;
  - U+00A0 and U+2003 between tokens split like spaces;
  - `quit now` returns `"quit"`.
- **Moves and positions:**
  - the promotion `a7a8q` is written, and the input `a7a8Q` is accepted;
  - castling `e1g1 e8c8` applies;
  - a checkmated position gives `bestmove 0000`, with no `info` line;
  - a refusal after a good `position` clears it, so the next `go` gives `bestmove 0000`.
- **A control character in a `go` value is filtered** from the `info string`. At the tip, ESC is stripped.
- **Two `go`s on one position give the same answer.** `chooseMove` does not mutate the held position.
- **D4 terms the lane does not pin, read on `virtualClock(1)`:**
  - `wtime 2000 winc 1000` gives `time 601` (G 600);
  - black with `binc 1000` gives `time 601`;
  - `movestogo 5` gives `time 201` (G 200);
  - `movetime 300` with a clock gives `time 301`.

  Each matches D4 at the tip. They are unpinned, not wrong (QE-167-b).

## Edges the page and ADR leave open (graded in the verdict note)
- **`go infinite`, then `ucinewgame`, `position startpos` and `stop`:** this writes `bestmove h8g8`, a move from the *old* position,
  after the GUI set a new one (QE-167-e).
- **`go infinite` then `quit`:** the held `bestmove` is never written (QE-167-e).
- **`go depth movetime 100`:** the valueless `depth` swallows `movetime` as its value. The `100` is then ignored, and the search
  runs the bare-`go` 3 000 ms instead of 100 ms (QE-167-f).
- **A new session with no `position` command:** `go movetime 100` plays from the start position (choice 1).

## N8-LANE (`NFR-008`): **OWED, not read and not estimated**
- **Prepared in the scratchpad:**
  - three trees, treatment `T` (the tip), placeholder `P` (a one-assertion file at `src/uci-session.test.ts`) and twin `Z`;
  - `T` and `Z` were `cmp`-verified byte-identical file by file, and `T/src` is identical to the tip.
- **The foreground quiet-window check failed.**
  - `probe/window.mjs` polled `ps -axo command | grep -E "vitest|oeselg-labs/platform"` once per second for 180 s, from
    2026-10-18T20:01:13Z on host MacBook-Air.local.
  - 167 of the 181 polls showed a process that was not mine: another repository's suite,
    `node /Users/olgeroeselg/Projects/public/grugops/node_modules/.bin/vitest run install/… scripts/…`, with its `forks.js` workers.
  - load1 over the window ran from 7.62 to 11.82 (first 9.73, last 7.96).
- **So no harness run was taken, and nothing was timed.** The trees were deleted.
  - The SE's count stands: +1 default-lane file and 0 spawns, so `N8-SPAWN` stays 0 ms.
  - The floor account takes 160 ms × 1 file by count.
  - The content delta is owed to a quiet-window reading at the gate.
