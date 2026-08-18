---
id: 20260819T004500Z-qe-e2e-decision-the-QE-verdict-on-ABC-035-pass-with-six-gaps-none-blocking-f9207ba6
kind: decision
by: qe-e2e
at: 2026-08-19T00:45:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-033
  - ABC-036
  - ABC-038
  - ABC-045
  - ABC-046
  - ABC-050
  - ABC-078
  - ABC-107
  - EPIC-003
  - EPIC-006
  - N8-LANE
  - NFR-002
  - src/command-input.ts
  - src/command-input.test.ts
supersedes:
---

# QE verdict on `ABC-035` — **PASS. All eight criteria MET, zero defects in the delivered build, SIX gaps, none blocking.**

A **decision**, not a `finding`: no `finding` is admissible on this install
(`context.human_admission` is `off`), so this verdict carries **no verification stamp** and must
never be read as one. It is the QE role's recorded judgement, hand-authored per
`agent-factory/contracts/context-note.md`.

**Recommendation: `ABC-035` may leave `In Review`.** I do not move the column — that is the
Orchestrator's pen — and I did not merge, deploy or touch `main`.

## Why it passes

**Not one production line needs to change for the acceptance to hold.** Every criterion was checked
against the ticket's `## Acceptance criteria` block rather than against the implementation, every
engineer figure was reproduced under an independent run, and every mutation number the engineer
published reproduced **exactly** — `M9` at 14, `M1` at 3, `M8` at 1, `M13` at 1 after the repair.
That last one is the important one: **the engineer's `M13` repair is confirmed working against the
mutant it was written for.**

| id | QE verdict | how it was attacked at this hop |
|---|---|---|
| `A1` | **MET** | `R1` (3 red), `Q14` (6), `Q15` (12) — three distinct wrong classifiers, all caught |
| `A2` | **MET** | `C2` (10 red) — the production module made to leak `help` to the resolvers; `A2`'s own rows red |
| `A3` | **MET** | `R13` (1 red) — the repaired stream guard fires; loop render count reproduced |
| `A4` | **MET** | asserted over the table in both directions; `Q14`/`Q15` confirm the negative half |
| `A5` | **MET** | the pair holds; `Q5` (1 red) confirms the loop-driven refusal row is live |
| `A6` | **MET** | `R9` (14 red) — a **production-side direct import** seen by the hoisted mock |
| `A7` | **MET** | re-measured independently: `W = 21`, hidden count 0 at the delivered table |
| `A8` | **MET** | `git diff --numstat main..e01033f -- src/` → `539/0` + `142/0`, nothing else |

Gate re-run by me, **eight steps, all green**, including the `SEARCH_DEEP` lane the engineer
correctly identified as owed at this hop (41/41, exit 0). Figures in the sibling gate note.

## The gaps

Every one is a **detection** gap or a handoff fact. None is a defect in the delivered code, which is
why none blocks.

### `G1` — MEDIUM. The stream guard is one door of five, and `console.log` is the door a real engineer would use

Owner: **whoever next opens `src/command-input.test.ts`** — named precondition on `ABC-045`/`ABC-046`.

Four mutants writing to the terminal survive **0 red of 79**: `console.log` (`Q1`), `console.error`
(`Q16`), a `process.stdout.write` reference **bound at module load** (`Q2`), and `fs.writeSync(1, …)`
(`Q3`). Mechanism measured, not inferred — Vitest intercepts `console.*` before it reaches
`process.stdout.write`, and `vi.spyOn` replaces a *property* that a load-time binding has already
escaped. Diffs, probe results and the raw numbers are in the mutation note.

**This is the ticket's own named security firing threshold — *"any direct stream write"* — with four
of its five spellings undetectable.** The delivered code writes to no stream, so the threshold has
**not fired** and the ticket is compliant; what is missing is the detector, exactly as it was missing
before the engineer found `M13`. It is MEDIUM rather than higher for that reason, and MEDIUM rather
than lower because `ABC-045` and `ABC-046` both add rows to **this module** and `ABC-046`'s open
problem is precisely that `quit` has no representable outcome — the ticket most likely to reach for a
side channel is the next one through this file.

### `G2` — LOW-MEDIUM. Nothing tests "there is no state change here"

Owner: same. `Q7` — a `board` arm parking a flag on `globalThis` — survives **0 red of 79**. The
module header asserts *"There is no state change here"*; no guard holds it. Same class as `G1` one
step out: an out-of-band channel that is not a stream at all.

### `G3` — LOW-MEDIUM. The stream guard is a single-window guard

Owner: same. `Q8a` — a stdout write on the module's **first** call — survives **0 red of 79**,
because that call happens in `A1`'s tests long before the spy is installed. `Q8b` (a write after 50
calls) reds 1 **only by accident of test ordering**; re-order the file and it survives too. The guard
observes 14 calls in one window, not the module's whole lifetime.

### `G4` — LOW. Two uncontrolled or weak controls, both true today

Owner: same.

- The stream fence asserts `errored === 0` with **no stderr control** — the control only writes to
  stdout. Measured: `Q6` reds 1, so the stderr spy **is** live. Latent, not live.
- `A6`'s in-file control calls the barred functions **from the test file**, so it proves the test
  file's import is mocked and not that the mock reaches the production module. `R9` supplies what the
  control does not. Strengthen when the file is next opened.

### `G5` — LOW-MEDIUM, and it is a HANDOFF, not a defect. `help` overflows the frame at the eighth item

Owner: **`ABC-036`** to re-measure, **`ABC-045`/`ABC-046`** to carry, **`ABC-107`** to decide with.

`W = 21` **confirmed**. The engineer's *"a seventh item overflows"* is **falsified by measurement**:
the seventh fits at exactly 21/21 and the **eighth** overflows, dropping three items behind
`(+3 more)`. Headroom is **two** short tokens, not one. **`ABC-036` does not hit the wall**; the
second token added after it does. This is a **second instance of `ABC-107`'s defect** and in one
respect worse — it would fire on `help` deterministically, the one command whose job is to list the
vocabulary. Full ladder and reasoning in the `A7` note.

### `G6` — INFO. Two things I was fenced from ruling, recorded and routed rather than absorbed

- **`N8-LANE` was not measured to its paired-delta method**, by the engineer or by me. I record the
  fact and the runner-reported consistency figure (79 tests, 14 ms) and **do not rule it** —
  `ABC-078` is in Security/NFR and that role owns the NFR bars.
- **`ABC-050`** (`vitest.config.ts` has no `exclude`) is live and already routed; not chased here.
  Containment was verified instead, and the recorded commands were used unmodified.

## Things I checked and found sound, recorded so they are not re-checked

- **`A2`'s zeros are not the `ABC-033` `G3` failure one layer out.** Attacked directly; the spies see
  the production module's call. There is no direct-import escape path here because `deps` is a
  parameter, not an import.
- **`A6`'s hoisted `vi.mock` is not blind to a direct import.** Proven by a production-side import
  lighting the counter (`R9`, 14 red). The engineer's choice of `vi.mock` over `vi.spyOn` was right.
- **`M8`'s single witness is genuinely all the property needs** (`R8` reds exactly 1, on exactly that
  row). Thin, and honestly named by the engineer. It is a real property with one observer; I would
  not add a second, but the next editor of that row should know it is the only one.
- **`b4` earns its keep, and what it guards is now named rather than conjectured**: it reds under the
  **first-letter alias** build (`Q15`, 12 red) and under neither prefix build. The engineer's
  conjecture that it guards "a different wrong build" is **confirmed and measured**. Do not delete
  that row.
- **`Q4` (mutating `deps`, 15 red) and `Q7b` (a thrown signal, 12 red)** — both channels well closed.
- **`history` is well guarded**: `Position` carries no cache field, so `A1`'s `toFen` byte-identity is
  a **complete** guard on the position; `moves` is asserted directly; only `initialFen` has a single
  witness (`Q5`, 1 red).

## Fences observed

I did not fix, and I weakened no guard — the delivered tree is byte-identical to `e01033f` under
`src/`, verified after every mutant and at the end of the hop. I did not re-open `ABC-033`. I ruled
no NFR bar. I did not merge, did not deploy and did not move a board column. Two scratch probe files
were created, run and deleted; the mutation harness lives outside the repository and is not
committed.
