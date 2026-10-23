---
id: 20261022T155019Z-qe-e2e-observation-41cd7a8e
kind: observation
by: qe-e2e
at: 2026-10-22T15:50:19Z
verified_by: 
confidence: high (harness output in probe/gap; each variant replayed directly before it ran)
refs:
  - ABC-178
  - qe-ABC-178b
  - 0036e5c6
  - fb00ad68
  - 7b87e5de
  - 43e4996f
  - 66fd8e1b
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - B6
  - QE-177-a
  - QE-178-a
  - QE-178-b
  - QE-178-f
  - efaa0a76
  - d781e5e5
  - 20261022T151717Z-qe-e2e-observation-f910b911
supersedes: 
seal: sha256:48e4bd36a46250c7708491dcaa43265f98d5fc14660dcf49e1857bc456c2908a
---

# `ABC-178` amended B6: **MET.** QP0 is 0 red. QP1, QP1a and QP1c are red on R1 alone, in the file and in the lane. QP1c is red at the re-check line, `289:68`. QE's own QP1c variants: QP1e (release on a fresh session's construction) is killed only by the re-check. QP1d (release on a fresh session's `position`/`go`/`ucinewgame`) survives everywhere: new gap QE-178-f, LOW

**Harness.** `gp-qe178.mjs` was taken by `git show d781e5e5:…/probe/gap/gp-qe178.mjs`: sha256 `12c0b8dbad1aa25571305fd679c4aee4f76ad1b4073ac8c9835314cf2c8dfcb3`, `cmp`-equal to the worktree file. It ran unmodified on a clone of H (`git archive 7b87e5de` with its own `npm ci`, a full `node_modules`, no symlink). There was no `RESTORE FAILED` and no `ANCHOR COUNT`, and afterwards `diff -r` against H's `src` was empty. QE's own variants run from a copy, `gp-qe178b.mjs` (the same file plus two entries). `gp-qe178.mjs` is untouched. The seconds the harness prints are not claimed.

## B6 as amended (byte-copied `gp-qe178.mjs`, at the tip)
| probe | file (127) | lane (1 996) | graded |
|---|---|---|---|
| QP0 | 0 red, exit 0 | 0 red, exit 0 | yes: green |
| QP1 | **1: R1** | **1: R1** | yes: red |
| QP1a | **1: R1** | **1: R1** | yes: red |
| QP1b | 0 | 0 | no (reported; QE-178-a accepted) |
| QP1c | **1: R1** | **1: R1** | yes: red |

- **Where QP1c goes red.** I applied QP1c to a clean clone of H and ran `vitest run src/uci-session.test.ts -t 'ABC-178 R1'`. It failed at **`src/uci-session.test.ts:289:68`**, the re-check line. R1's first check (line 286) stays green. The clone was then restored, and `diff -r` was empty.
- **The fold is what kills it.** On H with the **pre-fold** test file (`efaa0a76`), QP1c is 0/127, as at `80493be0` (`…f910b911`).

## QE's own QP1c variants (`gp-qe178b.mjs`, replayed directly first: `probe/gap/variant-semantics-178b.out`)
- **QP1d:** the release lands in session 1's own stream via a **different keyword**. A fresh session's `position`, `go` or `ucinewgame` (not `stop`/`ponderhit`) releases the other session's hold into the holder's output. Replay: R1's shape leaks nothing; a fresh session sending `position startpos` makes session 1 gain `bestmove`, while session 2's `out` stays `[]`.
- **QP1e:** no keyword is needed. **Constructing** a fresh session releases the other session's hold into the holder's stream. Replay: session 1 gains `bestmove` in all three shapes, and session 2's `out` is `[]`.

| probe | base file (126) | base lane (1 995) | pre-fold file (127) | tip file (127) | tip lane (1 996) |
|---|---|---|---|---|---|
| QP0 | 0 | — | 0 | 0 | 0 |
| QP1c | 0 | 0 (`…f910b911`) | 0 | **1: R1** | **1: R1** |
| **QP1d** | 0 | 0 | 0 | **0: survives** | **0: survives** |
| **QP1e** | 0 | — | 0 | **1: R1 @ 289:68** | **1: R1** |

**Does the re-check kill them?**
- **QP1e: yes, and only the re-check does.** The pre-fold file lets it through. The re-check reads session 1 after session 2 *exists*, so a release triggered by construction alone is caught.
- **QP1d: no.** The re-check only sees a release that something in session 2 triggers. Session 2 sends only `stop` and `ponderhit`, so a cross-session release keyed on the other release keywords (`position`, `go`, `ucinewgame`; `src/uci-session.ts` releases on all of them, and on `quit`) is never triggered before the re-check. It is not a regression: it survives at base (file 0/126, lane 0/1 995) and in the pre-fold file. → **QE-178-f, LOW.**

## Scratch-only: a zero-node widening of session 2 kills QP1d (evidence for the route; not proposed as QE's edit)
On a clone of H, R1's session 2 was changed to `talk(["stop", "ponderhit", "position startpos", "ucinewgame"])`: one line changed (`probe/gap/r1-widen.diff`), the tip untouched. File results: QP0 0/127; QP1, QP1a, QP1c, **QP1d** and QP1e each **1/127 on R1**. Census: R1 = **655**, sum **608 965** (unchanged, 0 extra nodes). `go` was left out because it searches. The clone was restored, and `diff -r` was empty.

An earlier attempt at this widening used an anchor that matched two lines (lines 280 and 287 both read `expect(talk(["stop", "ponderhit"]).out)…`). It refused to apply, and the runs that followed tested the unmodified tip. Those outputs were deleted and re-run with a context-unique anchor (`widen.cjs`). Only the re-run is reported.
