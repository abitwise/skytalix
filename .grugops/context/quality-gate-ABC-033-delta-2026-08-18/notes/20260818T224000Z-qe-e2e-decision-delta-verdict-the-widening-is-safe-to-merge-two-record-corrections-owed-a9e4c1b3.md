---
id: 20260818T224000Z-qe-e2e-decision-delta-verdict-the-widening-is-safe-to-merge-two-record-corrections-owed-a9e4c1b3
kind: decision
by: qe-e2e
at: 2026-08-18T22:40:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-032
  - ABC-034
  - src/move-input.ts
  - repair-ABC-033-2026-08-18
  - 20260818T221500Z-qe-e2e-claim-the-g2-widening-invariant-survives-an-adversarial-122094-line-differential-c41d9a70
  - 20260818T222000Z-qe-e2e-observation-a-second-changed-class-no-note-names-the-rejection-reason-code-flips-b7d3e611
  - 20260818T222500Z-qe-e2e-claim-g5-disjointness-is-false-b2b4-makes-both-grammars-claim-different-moves-d5a90c37
  - 20260818T223000Z-qe-e2e-observation-the-declared-residue-right-boundary-exact-rule-understated-list-e2b16f04
  - 20260818T223500Z-qe-e2e-observation-the-gate-on-the-delta-tip-a7-and-the-m11-spot-check-3f0c5d82
supersedes:
---

# Delta verdict: **PASS on the code, with two corrections owed to the record**

One question was asked — *did `G2` widen anything it should not have?* — and the answer is **no**.
I attacked it with a corpus built to break it rather than to confirm it and it did not break.

## PASS

- **The widening invariant survives.** 122,094 outcome lines over 10 positions, compared old against
  new on kind **and** payload: 684 `rejected` → `move`, **0** `move` → anything, **0** `ambiguous` →
  anything, **0** new ambiguities, **0** positions or histories mutated, **0** `A1` identity misses,
  and — the two rows earlier corpora could not produce — **0** lines that resolved to a move other
  than the one they spell, and **0** lines that changed without a case-bearing last character.
- **The collision hazard is closed, not merely unobserved.** Variant 4 differs from variant 1 only on
  letter-final lines; the coordinate reader lowercases before matching so it cannot tell them apart at
  all; `PIECE_MOVE` is digit-final so no letter-final string can reach it; the only new SAN surface is
  the promotion group, which is never itself ambiguous and which variants 1-3 cannot reach. And a
  sweep of **every codepoint U+0080-U+2FFFF** found **zero** characters that uppercase into a piece
  letter. A blind whole-line variant was the right thing to be nervous about; this particular one is
  safe, and now provably so rather than anecdotally.
- **The residue boundary is right.** I would draw it in the same place, I agree with leaving the
  suffixed forms to `ABC-032`'s grammar owner, and I agree with **not** pinning them with a
  characterisation test.
- **The gate is green in a contained lane**: 36 files / **1047** tests / **0** skipped, skip-integrity
  `No findings.` exit 0, lint 61 files clean, `tsc --noEmit` exit 0. `A7` holds from git — only
  `src/move-input.ts` and `src/move-input.test.ts` since `8c84265`. `M11` re-run and reds **3**,
  reproducing the finisher exactly.

## The two corrections owed — neither blocks a merge, both belong to the Orchestrator to route

1. **`G5`'s disjointness claim is false, not just unproved.** `B2b4` on
   `4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1` makes both readers claim a move and they claim **different**
   moves — coordinate `b4`, SAN `Bb4` — because `b` is the one piece letter that is also a file
   letter. `src/move-input.ts:199-203` states the opposite in the file a future reader trusts most,
   and the `G5` note's *"a rule no real input reaches"* is wrong. **The `confidence: high` is not
   earned.** No player-visible defect today: the module returns coordinate's answer, which is what a
   shift-slipped coordinate typist meant. Owed: a comment correction, one real-input precedence case,
   and a lower confidence on that note.
2. **A second changed class went unrecorded.** Variant 4 also flips some rejections from
   `unreadable` to `no-such-move` — one-way, never the reverse. Correct behaviour, and input to
   `ABC-034`'s copy, but *"widens what is asked, never what is accepted"* is quoted in the record as
   if the rejection arm were untouched. Owed: one sentence.

Also for the record, not a correction: the residue's stated **rule** is exact and complete, but its
enumerated **list** (14 strings) badly understates the extension (264 spellings on one fixture alone —
every `#` spelling and every bishop/knight family are missing from it). A reader planning `ABC-032`'s
grammar fix should size it from the rule.

## Fences honoured

Nothing fixed, no guard weakened, no merge, no deploy, no board column moved. `G1`/`ABC-107`, `A4`,
NFR bars, `ABC-050`'s lane contamination and `ABC-032`'s grammar were not touched; the mutation
battery was spot-checked at one mutant as instructed. The `G5` counterexample is reported, not
repaired — it is pre-existing, it resolves on the exact-as-typed path, and it predates `G2`'s variant.
