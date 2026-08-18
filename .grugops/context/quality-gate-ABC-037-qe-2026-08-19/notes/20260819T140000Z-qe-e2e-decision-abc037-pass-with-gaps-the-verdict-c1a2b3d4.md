---
id: 20260819T140000Z-qe-e2e-decision-abc037-pass-with-gaps-the-verdict-c1a2b3d4
kind: decision
by: qe-e2e
at: 2026-08-19T14:00:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-019
  - ABC-033
  - ABC-035
  - ABC-108
  - EPIC-003
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# `ABC-037` QE verdict — **PASS**, all eight criteria MET, **zero defects in the delivered build**, seven gaps, none blocking

Run on `grugops/quality-gate-ABC-037-qe-2026-08-19`, cut from the **delivery branch tip**
`grugops/abc037-the-real-prompt` @ `02e5c38` (not from `main`), in a contained agent worktree —
`ls -a .claude/` shows **no `worktrees/` directory**, so `npm test` and `npm run lint` were run AS
RECORDED. Every engineer figure was re-run here, none of them moved.

## Recommendation

**`ABC-037` MAY LEAVE `In Review`.** No production line changed at this hop and none needs to change
for the acceptance to hold. **Zero tests were added by QE** — the guards demonstrated below were
built and run out of tree, and the delivered files are byte-identical to `HEAD` (`src/line-input.ts`
md5 `2428f654f694b87a8e22ec199c01dcde` before and after every mutant).

The column move is the Orchestrator's to write, not mine.

## The headline: the engineer's one open corner is CLOSABLE, and cheaply

The brief asked me to find a guard that fires on `M6c` or to establish that none can within this
lane's cost. **A guard exists.** It is about twenty lines, it costs **36 ms**, it separates the
leaking build from the delivered one by a factor of **32**, and it runs inside vitest:

```
delivered build   retained external bytes:            0   (0.00 MiB)
M6c (drop both)   retained external bytes:   33,554,472   (32.00 MiB)  -> RED
```

The instrument is **`process.memoryUsage().external`** after a forced collection, not `heapUsed`.
The engineer's CONCLUSION — `heapUsed` cannot see this leak — is correct and I reproduced it exactly
(0.11 MiB leaking vs 0.10 MiB bound). The engineer's stated MECHANISM — *"`heapUsed` does not account
a V8 cons-string's referents"* — **is not what I measured**, and that misdiagnosis is what closed off
the working instrument. Detail and every number are in the `M6c` note.

Deleting a guard that could never fire was the right call and I would make it again. Recording the
retention bound as a construction argument was the honest fallback. **What is now known is that the
fallback was not necessary**, and the `AGENTS.md` trap the engineer wrote would actively steer the
next engineer away from the instrument that works. That is `G1`.

## Gaps, by severity

| id | severity | one line |
|---|---|---|
| `G1` | **MEDIUM** | The 1024-char cap's retained-bytes bound is provable by test and is not proved. A working guard exists (`external` + `--expose-gc`, 36 ms, 32:1 margin); the `AGENTS.md` trap states the opposite and would prevent it being written. |
| `G2` | **MEDIUM** | The `A6` guard's stated lexical limit is REAL and I landed the escape: an obfuscated, **load-time-bound** reconstruction of `process.stdout.write` writes every typed line to the real terminal and passes the **entire blocking gate** — 39 files / 1175 tests, lint, typecheck, `INPUT_DEEP=1` 26/26, all green. It defeats **security bar 3** as well as `A6`. Not reachable by input; a malicious-edit threat, not an input-attack threat. |
| `G3` | **LOW** | The cap is applied BEFORE the CRLF strip, so on a Windows pipe the effective cap is **1023**, not 1024. A 1024-char line + `\r\n` is rejected `line too long`; the identical line + `\n` reaches the resolver. The suite has a boundary row (LF only) and a CRLF row (short line); neither can see the interaction. |
| `G4` | **LOW** | `M-QE1` — dropping `{ stream: true }` from the decoder — **survives 26/26** while corrupting any UTF-8 character split across a chunk boundary into `U+FFFD`. A deliberate correctness choice with no guard. |
| `G5` | **LOW** | Two real defect classes (`M-QE2` a leaked `data` listener, `M-QE3` EOF outranking the queued surplus) are killed **only** under `INPUT_DEEP=1`, which is not in the blocking gate. The deep lane is not "breadth only" — it is load-bearing. |
| `G6` | **LOW** | Two overlapping `seam()` calls **orphan the first read forever** — `waiting` is a single slot and the second call overwrites it. `runTurnLoop` is sequential so it cannot happen today; the module is exported and `EPIC-006` wires it, and the precondition is written down nowhere. |
| `G7` | **INFO** | Documentation drift, three instances: the traceability HEADER paragraph still says "three of **eighteen** mutants" (the row says 19/16 correctly); `MAX_LINE_LENGTH`'s doc says "in CHARACTERS" while the check counts **UTF-16 code units** (an astral-character line caps at 512); and the engineer's `heapUsed` mechanism as recorded in `AGENTS.md` and three notes. |

**`M6`/`M6b` — classification CHECKED, not inherited, and it holds with one refinement.** Both are
behaviourally equivalent (26/26 green) and both are bounded. Measured retention: `M6b` **0.00 MiB**,
`M6` **2.00 MiB** — exactly one 1 MiB chunk, which is the construction argument's own bound, measured
rather than argued. So they are equivalent to each other and to the delivered build *for the purposes
of the bound*, but `M6` is not retention-identical to the delivered build. Details in the `M6c` note.

## What I did NOT do, deliberately

- **`N8-LANE` is REPORTED and NOT RULED.** I reproduced the breach independently: the lane is
  **13.91 s CPU median WITHOUT this ticket's two files** — over `NFR-008`'s 13 s clause before this
  work existed, which is `ABC-108`'s finding measured a third time from a third tree. NFR bars are
  Security/NFR's to rule.
- `ABC-033`, `ABC-035` and `ABC-078` NOT re-opened. One cross-module observation touches `ABC-033`'s
  dispatcher; it is recorded as an observation against this seam and no ticket is re-opened.
- No guard weakened, nothing merged, nothing deployed, **no board column moved**, DoR table untouched,
  `plans/nfr-catalog.md` not opened.
- Whether `AGENTS.md` should have been the Scribe's pen is the Orchestrator's to route; I judge only
  whether the content is accurate and runnable, in the gate note.
