---
id: 20260820T171500Z-qe-e2e-artifact-ref-what-this-hop-touched-fourteen-decoys-and-a-second-agent-in-my-tree-df80c356
kind: artifact-ref
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T17:15:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-050
  - ABC-113
  - src/cli.ts
  - src/cli.test.ts
  - plans/board.md
supersedes:
---

# What this hop touched, the fourteen wrong builds, and the second agent that was writing into `src/` while I measured

## Where I stood

**`main` @ `d127ae3`, no branch, no worktree, nothing merged, nothing deployed.** `ABC-043`'s code was
already on `main` (`46457b8` delivery, `6091212` repair round 1) and every work branch is deleted, so
the measurement point is `main` by necessity, not by choice.

## THE ISOLATION, and why it was not optional

**A second agent (`ticket-to-pr-ABC-050-2026-08-20`) was writing into this shared working tree while I
was measuring.** At my first decoy revert, `git status --porcelain` came back carrying
`src/glyph-mode.nfr.test.ts`, `biome.json`, `tsconfig.json` and `vitest.config.ts` **modified — none
of them mine**. I did not touch, commit or revert another actor's live edits.

I moved every mutation off the shared tree:

```
git archive d127ae3 | tar -x -C <scratch>/tree      # + node_modules symlinked
```

**Baseline in the isolated copy: 40 files / 1207 tests / 0 skipped, `tsc --noEmit` clean — identical
to the repository**, which is what makes the two comparable. Every decoy below was planted, run and
reverted **there**, and the orphaned-build comparison used a second isolated copy again. **Two further
isolated trees** were built from `54cbb23` and `46457b8` to pin the EPIPE regression.

**Root cause, unchanged and still unowned:** agents and the owner share ONE working tree with no
isolation. `ABC-113`'s QE hop reported it after the owner's mid-hop commit landed in its measurement
window; it has now bitten a second hop, on a different ticket, on the same day. **Reported, not this
ticket's.**

## The fourteen wrong builds — all planted, all run, all reverted

`tsc --noEmit` was **clean** on all but `D7` and `D14` (marked), which is what makes the rest mutants
rather than typos. `D` = decoy.

| id | the build | result |
|---|---|---|
| `D1` | the two non-zero exit codes swapped | **RED** — `A3` |
| `D1b` | `D1` with only `A3`'s two by-value rows deleted | **GREEN, 55/55** — the `G-05` adjudication |
| `D2` | options bag hoisted out of the call + a real `as` cast | **RED** — `A1`, `G6` |
| `D3` | hoisted bag + `void options.input(newGame(START_FEN))` | **RED on 7 rows** — `A1`, `G6`, `A2`, `A3`, `A6`, `A7`, `ABC-042 A4` |
| `D4` | `for (const history of [spare])` shadow rebind | **GREEN, 55/55** — `ABC-113`'s declared open remainder, reproduced |
| `D5` | start position handed to the loop with black to move | **RED on 10 rows** — `A2` among them |
| `D6` | `INTERNAL_ERROR.padEnd(23)` — a row count inside an interpolation | **RED** — `A8` |
| `D7` | `beginFrameSession()` with no arguments | *`tsc` exit 2* — discarded as a typo, replaced by `D7b` |
| `D7b` | `void beginFrameSession(sink, START_FEN.length)` — type-clean, no numeric literal | **RED** — `A6`, `ABC-042 A8/A6`, `A1`, `G6` |
| `D8` | `humanColour: colour === "white" ? "black" : "white"` | **RED on 11 rows** — `A7` both directions, `A2` |
| `D9` | engine faults exit `70` instead of `0` | **RED** — `A5`, `ABC-044 A3` |
| `D10` | **the control** — the catch arm exits `0` | **RED** — `A3` **and** `A4` |
| `D11` | the clean end-of-input path also writes the internal-error line | **RED** — `A4` |
| `D12` | the crash line reworded to name `draw` and `engine-failure` | **RED** — `A3` |
| `D13` | the seam bound to a name and pre-read before the loop | **RED on 7 rows** — `G6`, `A1`, `A2` |
| `D14` | an adapter arrow wrapped round `createEngine` | *`tsc` exit 2*, and **RED** — `A1` |

Plus one **`G-03` orphaned mutant** in a separate isolated copy for the live-stdin comparison, and one
non-product probe (`raw.mjs`, four lines, no product code) that established the FIFO limitation.

## RESIDUE: NONE

`git status --porcelain` at the end of this hop carries **two entries, neither mine**:
`plans/tickets/ABC-050-lane-runner-config-has-no-guard.md` (modified) and
`.grugops/context/ticket-to-pr-ABC-050-2026-08-20/` (untracked) — the other agent's live work.

- `git diff --stat -- src/` → **empty**.
- `git diff --stat -- src/cli.ts src/cli.test.ts` → **empty**.
- **No file under `src/` was written by this hop, at any point, in the repository.** Every mutation
  lived and died outside it.

## What I wrote

- **`.grugops/context/qe-ABC-043-review-exit-2026-08-20/notes/`** — six notes: this one, the verdict,
  the `G-05` adjudication, the live-stdin re-measurement, the EPIPE regression, `G-06`, and the gate
  claim.
- **`plans/board.md`** — `ABC-043` moved `In Review` → `Ready for UAT`, one line, and the two WIP
  counts corrected. **One ticket, nothing else moved, no limit touched.**

## What I explicitly did NOT do

- **Did not merge and did not deploy.** There was nothing to merge; the code is on `main`.
- **Did not apply or measure the zero-production-lines UAT waiver.** It is the Orchestrator's at the
  `Ready for UAT` exit, over `git diff --name-only main...HEAD -- src/`, **never** over `<tip>~1`. I
  record only that `ABC-043` shipped `src/cli.ts` at **+91/−17**.
- **Did not sign anything.** QE is not UAT.
- **Did not fix anything I found.** `D4`, the EPIPE regression and the third false sentence are
  measured, named and recommended — **not authored**. `ABC-113` exists because a QE hop authored an
  instrument and then adjudicated it; I did not author `ABC-043`'s guards and I kept it that way.
- **Did not re-open, re-score or amend `ABC-044` or `ABC-113`.** Neither page was opened.
- **Did not write a row into `.grugops/test-skips.md`.** Read and run against, never written.
- **Did not weaken, delete or edit a single assertion**, and did not touch `plans/traceability.md`,
  `vitest.config.ts`, `biome.json` or `tsconfig.json` — three of which sat modified in the tree by
  another actor throughout.
