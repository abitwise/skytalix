---
id: 20260812T080300Z-software-engineer-observation-gates-controls-and-lane-00dfe171
kind: observation
by: software-engineer
at: 2026-08-12T08:03:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-026
  - NFR-002
  - NFR-008
  - ADR-0008
  - ADR-0011
  - src/history-pane.nfr.test.ts
supersedes:
---

# Gates, the probe's own bars, and my `N8-LANE` delta — with the session I could not use, reported not dropped

> **`kind: observation`, not `finding`** — there is no `§14-gate` verdict record under this task to
> issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`. **A green gate I ran myself is
> not a `finding`**; it is recorded here as what it is.

## 1. Baseline, verified on arrival rather than inherited from the brief

| | brief said | I measured, before touching anything |
|---|---|---|
| lint | 0 | **0 errors**, 2 infos (both pre-existing `biome migrate` notices about `biome.json`) |
| typecheck | 0 | **0** |
| tests | 750/750 on 26 files | **750 passed (750) on 26 files** |
| skip | 0 | **0** |

All four matched exactly, so any red below would have been attributable to me.

## 2. Gate on the branch tip, after the change

| gate | result |
|---|---|
| `npm run lint` | **0 errors**, the same 2 pre-existing infos — identical to baseline |
| `npm run typecheck` | **0** |
| `npm run build` | **0** (it is `tsc --noEmit`; `AGENTS.md` says so) |
| `npx vitest run` | **750 passed (750) on 26 files** |
| skip count | **0** (`--reporter=json`, `numPendingTests + numTodoTests`) |

**750 → 750: the test count did not move, because no test was added, weakened, narrowed or deleted.**
The file holds 8 `it` blocks before and after.

Environment: Apple M3 / Darwin 25.5.0 arm64 / macOS 26.5.2 / Node **v24.12.0** / vitest 3.2.7.
`UNKNOWN - verify` on any other machine.

## 3. The probe's own bars, each re-run rather than assumed

- **Determinism — 12 consecutive runs, 12 passed, 0 flaky.** The structural reason is unchanged and I
  did not weaken it: there is still **no wall-clock assertion, no concurrency and no ordering
  dependence** anywhere in the probe, and I added none. No duration is compared to anything.
- **Three controls, still falsifiable — proved by standalone re-execution, not by reading.** With
  `FRAME_PRODUCERS` emptied so the root set is `[]`:
  - positive control 1 fails: `the probe loaded the pane: expected [] to include 'history-pane.ts'`;
  - positive control 2 fails: `the probe loaded the pane's own dependencies: expected [] to include 'san.ts'`;
  - the **arming** control still **passes** with `roots = []` and both positive controls removed —
    it reports `history.ts` independently of the closure phase, which is exactly what the `?arming`
    query is for. **I did not touch that query and did not tidy it.**
- **The pane's runtime closure** is untouched by this ticket — I changed which modules the probe
  *roots at*, not what the pane imports.
- **`WSTDERR` still survives** on both trees (measured), so the channel change did not over-reach
  onto stderr.

## 4. `A2` measured before and after, on the same tree

| | instrument | verdict |
|---|---|---|
| **before** | delivered | probe is the **sole red** of the file: `SyntaxError: Unexpected token 'g', "glyph-mode"... is not valid JSON`, 1 failed / 7 passed |
| **after** | this build | **8 passed (8)** — `WSTDOUT` green / green on **both** trees |

## 5. `N8-LANE` — my own delta, and the honest problem with measuring it

**Mechanism level, which is the number I stand behind.** The probe child alone, delivered root set
against ruled root set, 25 interleaved reps with the order flipped every rep and rep 0 discarded
(n = 24 each):

| configuration | roots | closure | median wall |
|---|---|---|---|
| delivered | 14 | 14 | **56.9 ms** (52.4–60.8) |
| ruled | 5 | 11 | **56.3 ms** (52.8–64.8) |

**Delta −0.6 ms (−1.1%), inside the harness's noise band** — reproducing the design hop's **−0.3 ms**
in both direction and magnitude. **The probe cannot get more expensive by construction**: the ruled
root set is a strict subset of the delivered one and its closure is smaller.

**Whole-lane level, on `ADR-0008`'s protocol — CPU (user + sys), median of PAIRED per-round deltas,
null control by identity, round 0 discarded.** Arms built out of tree: `A` = `HEAD`, `B` = this
ticket, `A2` = a byte-identical copy of `A` (`cmp`-verified).

| session | design | treatment `B−A` | null `A2−A` | verdict |
|---|---|---|---|---|
| **1** | 3-arm rotation, n = 10 | median **−63.5 ms**, sign 7/10 | median **−43.0 ms**, sign 8/10 | **NOT USABLE** |
| **2** | paired, order counterbalanced within each pair, n = 9 | median **−100.0 ms** (−1.09%), sign 6/9 | median **−24.0 ms** (−0.26%), sign 6/9 | usable, but see below |

**Session 1 is reported, not dropped.** It failed on its own null control: the session drifted
upward by ~400 ms of CPU end to end, a 3-arm rotation does not cancel that over 10 rounds, and a null
control of −43 ms cannot discriminate a delta of −63 ms. I rebuilt the design rather than keep the
number.

**What I claim from session 2, and what I do not.** The treatment median (−100 ms) is four times the
null (−24 ms) but carries the **same sign ratio (6/9)**, and it is two orders of magnitude larger
than the mechanism can possibly account for (−0.6 ms of child wall). **So I do NOT claim −100 ms as a
real reduction.** What is supportable: **this ticket did not make the lane more expensive**, and the
direction of both the whole-lane and the mechanism-level measurements is the one that helps.
**Zero files were added, so no floor allowance applies** — the lane file count stays **TWO**.

**`ADR-0008`'s two ratified clauses hold with room**, measured three times on the branch tip:
**wall 1.76 / 1.84 / 2.03 s** against ≤ **3 s**, and **CPU (user + sys) 8.97 / 8.98 / 9.08 s** against
≤ **13 s**.

**The lane TOTAL is not settled here and is not mine to settle.** The brief routes that dispute to
`ABC-026` and I left it there. **One figure I can add as an input rather than a verdict: the ticket
records the `RF-1` child as ~102 ms; I measure the probe child at ~57 ms wall on this tree**, which is
exactly the bottom of the 56.9–70.0 ms range the ticket's own determinism section records. The two
numbers in the ticket are not consistent with each other. **Flagged for `ABC-026`, not reconciled by
me, and no bar was re-derived.**

## 6. Security

**NONE fired.** No new dependency (`dependencies` stays `{}`), no network, and no file write anywhere
— including in the change itself: I deliberately rejected a temp-file report channel because
`## Security / NFR triggers` names *"any change that makes the probe's child accept input from
outside the repository, or that adds a dependency"* as the firing threshold, and a write would have
moved a posture the catalog states. The child's argv still contains only `file:` URLs computed from
`src/` and one `data:` URL built in the test. **fd 3 is opened by the parent for the child; nothing
outside the repository can write to it.**
