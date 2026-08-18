---
id: 20260818T220000Z-software-engineer-artifact-ref-the-repair-branch-its-three-commits-and-every-file-891bad10
kind: artifact-ref
by: software-engineer
at: 2026-08-18T22:00:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-003
  - repair-ABC-033-2026-08-18
  - quality-gate-ABC-033-qe-2026-08-18
  - src/move-input.ts
  - src/move-input.test.ts
supersedes:
---

# `ABC-033` repair round 1 — branch, commits, files. NOT merged, NOT QE-revalidated

## Branch

- **`grugops/abc033-repair`**, base `grugops/quality-gate-ABC-033-qe-2026-08-18` @ `8c84265`.
- Tip after this hop: **`grugops/abc033-repair`** — see the commit list below for the final sha.
- **Not merged into anything. Not deployed. No board column moved by this hop.** Humans hold merge.
- No rebase and no restart: this hop continued the existing branch, as instructed.

## Commits

| sha | author-hop | what |
|---|---|---|
| `b573308` | previous hop (API outage) | the repair: production + tests + ticket page + the queue claim |
| `3635927` | Orchestrator, on the previous hop's behalf | its five typed notes, committed unchanged so they would not be lost, plus the `plans/traceability.md` row |
| *(this hop)* | finisher | the two owed notes, the audit note, and the queue sweep |

## Files

**Under `src/` — `A7`'s two, and nothing else** (`git diff --stat 8c84265..HEAD -- src/`):

| file | change |
|---|---|
| `src/move-input.ts` | **+71 / -22 region**, net: variant 4 in `CASE_VARIANTS` (`:134`), `toSan` added to `MoveInputDeps` (`:101`) and `ambiguous()` rendering through `deps.toSan` (`:229`), `attemptsOn`'s doc corrected to precedence-not-order, the `A5` header comment corrected to `1 + O(candidates)` |
| `src/move-input.test.ts` | **+201**, `40 → 48` tests: the promotion case-spelling pair (`G2`), the precedence-through-the-seam test (`G5`), three `RENDERED` argument-identity rows (`G3`), `A6`'s permissive regex replaced by a six-row exact-code table (`G4`), the false widest-list fixture comment corrected |

**Not under `src/`:**

| file | change |
|---|---|
| `plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md` | `## Scope` "Order of attempt" → "Precedence"; `A5` clarified that the one derive is of the PROMPT POSITION and a prompt costs `1 + O(candidates)` |
| `plans/traceability.md` | the `ABC-033` row records repair round 1, the gate figures and the three mutant reds |
| `.grugops/context/repair-ABC-033-2026-08-18/notes/` | five notes at `3635927` + three from this hop (gate `observation`, audit `claim`, this `artifact-ref`) |
| `.grugops/queue/claimed/abc033-repair/` → `.grugops/queue/done/abc033-repair/` | the claim, swept by this hop |

**Untouched, and checked**: `src/frame.ts`, `src/san.ts`, `src/coordinate-move.ts` — none appears in
the diff. Two throwaway probe files were created under `src/` during the audit and **deleted**;
`git status` is clean and the `A7` diff above is measured from git, not asserted.

## Tests and commands

The numbers, the lane, and the three mutant diffs are in the sibling gate `observation`
(`20260818T215500Z-…-4ce0f86a`) rather than restated here. In one line: **contained lane, 36 files /
1047 tests / 0 skipped, lint + typecheck + build clean, `PERFT_DEEP=1` 32/32, `SEARCH_DEEP=1` 41/41,
and `M6` / `M11` / `M12` now red 5 / 3 / 1 against a 48-test baseline.**

## Migration / docs

No migration, no schema change, no dependency change, no new file under `src/`. Docs touched are the
ticket page and the trace row above.

## Remaining work — what this hop did NOT close

1. **`G1` is open and deliberately unrepaired.** Seven knights attacking `d4` overflow the frame's
   message region (`(+2 more)`). `EPIC-002`'s frame owner; BA/PM was cutting the ticket in parallel.
   No fixture in `src/move-input.test.ts` pins the current overflow, on purpose.
2. **The suffixed promotions stay `unreadable`** — `E8=Q+`, `e8=q+`, `exd8=q+` and their spellings.
   Grammar knowledge, `ABC-032`'s owner, recorded in the `G2` note and re-verified in the audit note.
   No test pins them as rejected, so a fix there will not fight this file.
3. **QE re-validation of the repair has not happened.** Round 1 of `quality.self_fix_attempts` = 2 is
   spent; the three gaps QE raised are answered and the mutants red, but nobody but me has looked.
4. **The `supersedes` question on the delivery note** — whether to fold
   `20260818T184000Z-…-c05d31ea` out of replay to bury the false knight bound — is left to the
   Orchestrator, as the previous hop left it. I did not take it silently either.
