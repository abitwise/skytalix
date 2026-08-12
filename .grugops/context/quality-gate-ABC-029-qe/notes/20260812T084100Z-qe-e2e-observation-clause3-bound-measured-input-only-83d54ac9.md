---
id: 20260812T084100Z-qe-e2e-observation-clause3-bound-measured-input-only-83d54ac9
kind: observation
by: qe-e2e
at: 2026-08-12T08:41:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0011
  - src/history-pane.nfr.test.ts
supersedes:
---

# The bounded reach of clause 3's equality, measured precisely — INPUT for Architect/Design, and I do not rule on it

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` `off`.
>
> **The brief hands this on explicitly unsettled and NOT mine to settle: *"Architect/Design owns it,
> the ADR was deliberately not edited. If you can measure the bound precisely, that is useful input —
> but do not rule on it and do not edit the ADR."* I measured it. I did not rule and I did not open
> `ADR-0011`.**

## The bound is tighter than "a deleted licence is vacuous", and the tight version is the useful one

`ADR-0011` and `A5` both state the bound as: *a licence whose file is DELETED is vacuous rather than
red, because `main` and the tip-minus-`turn-loop.ts` are the same 16 `cmp`-identical files.* That is
correct and it is not a choice. **What it does not say is how far the vacuity extends.** Measured, on
the real instrument:

| build | `base16` | `base17` |
|---|---|---|
| licence `["turn-loop.ts"]` — as delivered | green / green | green / green |
| licence `["turn-loop.ts", "ghost-driver.ts"]` — **one name with no file** | **green / green, 8/8** | **green / green, 8/8** |
| licence `["turn-loop.ts", "a.ts", "b.ts", "c.ts", "d.ts", "e.ts"]` — **five names with no file** | **green / green, 8/8** | **green / green, 8/8** |
| licence `["turn-loop.ts", "zobrist.ts"]` — **one name that DOES have a file** | **RED** / green | — |

**The precise bound, in one sentence: the licence declaration is unverifiable in the over-listing
direction for any entry whose file does not exist, and the number of such entries is unbounded — but
over-listing an entry whose file DOES exist is caught immediately.**

That is a better-shaped bound than "one deleted file is vacuous":

- **The guard is tight where it can be.** `["turn-loop.ts", "zobrist.ts"]` is RED with
  `expected [] to deeply equal [ 'zobrist.ts' ]`, because `zobrist.ts` exists and does not import
  `history.ts`. **A licence cannot be quietly widened to admit an existing module.** That is the same
  mechanism as `WSTALELICENCE` and it is genuinely strong.
- **The guard is blind only to names that name nothing.** Six entries, five of them fiction, is
  green on both trees. The declaration can therefore accumulate dead entries indefinitely with no
  instrument noticing — the "guard that fails by omission" class, on the licence side rather than the
  frame-path side.

## Why this is worth handing on rather than filing as a defect

`ADR-0011`'s residual-risk section names the fail-open risk on **clause 2** (the declared frame path),
with owner Architect/Design and dated expiry `EPIC-006`. **Clause 3 carries a structurally similar
fail-open and it is not named there** — the ADR treats clause 3's bound as a single fact about
deletion. The measurement above says the shape is *"unverifiable over-listing of non-existent
names"*, which is the same class as clause 2's and would take the same owner and the same kind of
tripwire.

**Owner: Architect/Design, at the next hop that touches `ADR-0011` clause 3. Trigger: the first
licence entry added after `turn-loop.ts`** — that is the moment a second name can be wrong and
nothing will say so. **`EPIC-006` is not the right expiry for this half**: clause 2's declaration is
deleted there when the frame path becomes a real closure, but the licence is not, so clause 3's
bound outlives clause 2's.

**No `A5` row covers this and I am not adding one** — the criterion is BA/PM's and the ruling is
Architect/Design's. **`memory-bank/50-decisions/ADR-0011-*.md` was read and not opened for edit;
`plans/nfr-catalog.md` was not opened at all.**

## One inherited, PRE-EXISTING gap in clause 1, measured so it is not mistaken for a regression

`ADR-0011` clause 1 reads *"every `.ts` file **under** `src/`"*. The one expression is
`readdirSync(directory).filter(…)` — **non-recursive**. So the delivered expression implements
*"every `.ts` file directly IN `src/`"*.

| build | ruled instrument | **delivered** instrument |
|---|---|---|
| `WSUBDIR` — `src/engine/probe-victim.ts` with a **static** `import { newGame } from "../history.ts"`, off the frame path | **green / green, 8/8** | **green / green, 8/8** |
| the same file, imported by `render.ts` (on the frame path) | green / **RED** | — |

**It is green under the delivered instrument too, so `ABC-029` did not cause it** — it is inherited,
and it was invisible while `src/` was flat. `src/` is flat today for `.ts` (its only subdirectory is
`__snapshots__`, which holds no `.ts`), so this is **latent**. The probe still backstops it whenever
the subdirectory module is on the frame path.

**Owner: Architect/Design (clause 1's wording, or the one expression, must move — not both).
Trigger: the first `.ts` file added under a subdirectory of `src/`.** Reported, not fixed: fixing it
would be a code change outside this role and outside every criterion on this ticket.
