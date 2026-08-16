---
type: observation
task: slot-guard-anchor-2026-08-16
author: Orchestrator
date: 2026-08-16
subject: independent verification of the ABC-067 + ABC-071 delivery — re-run, not relayed
---

# I re-ran the gate myself. Every stop condition holds.

**This is not a transcription of the engineer's report.** `quality.gate_enforcement` is `blocking` and
the engineer is the party with an interest in the answer, so the gate was re-run from the branch tip
and the scope conditions re-measured from git. Where a number below matches the engineer's, it
matches because I got the same number, not because I copied it.

## Scope conditions — all MET

| condition | source of truth | result |
|---|---|---|
| delivered diff is exactly one path | `git diff --name-only 82133dd~1 82133dd` | **`src/cli.test.ts`**, one path |
| `AGENTS.md` not edited | `git diff --stat main -- AGENTS.md` | **empty — byte-identical to `main`** |
| no merged criterion deleted | `git diff` grep for removed `expect(` | **0 removed**; **0** `it(` blocks removed |
| no production line | diff paths | 0 files under `src/` other than the `.test.ts` |
| `spawned` still 10 | `src/cli.test.ts:836` `expect(spawned).toBe(10)`, green in the suite | **asserted mechanically, holds** |
| notes kept out of the scored commit | `git diff --name-only 8ab6071~1 8ab6071` | notes are a **separate** commit — the scored diff needs no `.grugops/` exclusion |

The two-commit split is the engineer's own idea and it is a good one: `ABC-067` `A6` and `ABC-071`
`A5` both score `git diff --name-only <delivered>~1 <delivered>`, and a single commit would have
forced that criterion to be read with an exclusion clause. Split, the criterion is scored literally.

## Gates — re-run at the branch tip, verbatim

- `npm run lint` → `Checked 54 files in 57ms. No fixes applied.` **exit 0**
- `npm run typecheck` → no output, **exit 0**
- `npm test` → **`Test Files 30 passed (30)` / `Tests 861 passed (861)`**; `src/cli.test.ts` **34 tests** (was 32 — the two new rows, and nothing lost)
- `npm run build` → no output, **exit 0**
- skip count → **0**; `test-skip-integrity.js` → **`No findings.` exit 0**

`.grugops/test-skips.md` is human-owned; it was read and passed to the checker, and **no row was
written into it** by any party this hop.

## The measured-not-asserted criteria, re-measured by me

`ABC-067` `A5`'s baseline and `A2`'s observable ship as measurements rather than suite assertions.
That is a judgement call, so I did not accept it on the engineer's word. Re-derived independently
against the delivered `AGENTS.md`:

```
slot count in file : 1
captured bytes     : 800
captured lines     : 9
further bullets    : 0
```

**Exactly `A5`'s 9 lines / 800 bytes and `A2`'s 0-unmutated figure.** The engineer's reasoning for not
pinning these in the suite is accepted and it is the tickets' own: pinning `AGENTS.md`'s byte count
would assert the prose, which is precisely the coupling both tickets' test note 3 forbids. The
assertions that ship are the prose-independent ones the criteria actually score.

## Two engineer judgement calls — ACCEPTED, and the acceptance is mine, not theirs

1. **The assertion expression deviates from the one `ABC-071` § Scope names.** The page offers
   `expect(agents.split("- Dev / run:").length).toBe(2)`; the delivery uses `.length - 1` against
   `toBe(1)` so the failing number **is** the slot count (`expected 2 to be 1`) rather than a split
   arity. **The page offered that expression as a sufficient repair, not as a mandate**, and `A1`
   scores the *reason the guard gave*, while test note 4 says the failure message is half the
   criterion. The deviation serves the criterion better than the literal expression would.
   **The engineer flagged it to me instead of doing it silently — that is the behaviour the fence
   ("do not widen scope on your own authority") exists to produce.**
2. **`ABC-071`'s `N3b` figure is wrong in a way that STRENGTHENS the ticket.** QE recorded a
   two-verdict asymmetry (`N3a` green / `N3b` red). The engineer measured **three**: placed just
   before `### Development` the duplicate is **GREEN**, not red; only a far-enough-before placement
   reds, and it reds on `--check`. So the guard's verdict varied across three placements, not two.
   **All three now fail identically on the count.** This was reported rather than quietly reconciled
   to QE's published number, which is the honest handling — and it means `ABC-071`'s `A2` ("both
   mutants fail for the same stated reason") is satisfied across a wider input set than the criterion
   demanded. **No new ticket: the defect this reveals is the one being repaired, and it is repaired.**

## What I did NOT do

- **No merge.** The gate is green and merge authority is standing, but the owner has not been told
  and I do not merge silently.
- **No UAT, and no signature of any kind.** `context.human_admission` is `off`; this note is a
  hand-authored `observation` and carries **no `finding`, no `§14-gate` verdict, no `human:<name>`
  stamp**. A green gate is not an acceptance.
- **No Security/NFR.** Untriggered at 0 production lines / 0 new files / 0 new spawns, and the
  delivered diff did not widen — so the judgement recorded in my ruling note stands rather than
  being voided.
