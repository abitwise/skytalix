---
id: 20261012T204500Z-ba-pm-decision-six-rulings-a5i-repinned-a9-widened-dor-10-of-10-f4a8b6ee
kind: decision
by: ba-pm
task: bapm-amend-ABC-101
at: 2026-10-12T20:45:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-042
  - ABC-061
  - ABC-065
  - ABC-043
  - ADR-0027
  - ADR-0032
  - ADR-0037
  - RISK-002
  - 20261012T204400Z-ba-pm-observation-what-a5i-guards-and-what-the-wiring-keeps-0a291de1
  - 20261012T203600Z-software-engineer-decision-stop-do-not-amend-abc086-443a041f
supersedes:
---

# Six rulings: `ABC-086` `A5`(i) re-pinned as (i′), `ABC-101` `A9` widened by one row, `A7` read in two halves, `ABC-042` pointer, moved guards allowed, slot line clear. `ABC-101` DoR 10/10.

This note is hand-authored and unsealed. It is an agent `decision`, not a stamp. The ticket pages are
authoritative, and this note records why. The readings are in `…0a291de1`.

1. **`ABC-086` `A5`(i): re-pinned, not loosened. A criteria question, not a design one.**
   - **Why it is not design.** `ADR-0027` d3/d4, `ADR-0032` and `ADR-0037` D3 already rule the construction.
     `ABC-101` § Scope (2026-10-12) already rules the shape. No ADR names `createEngine` as the shipped
     construction. What A5(i) pinned was a line of code standing in for a property.
   - **I take the SE's alternative 1, made stricter.** The SE's re-pin, "`createLevelSeam(` present, no
     `now:`", would drop half of the property. The default budget would then be guarded only by other
     tickets' rows (`ABC-087` `A6`, `ABC-101` `A8′`). A5's last line makes that half `ABC-086`'s own. So the
     row asserts four things:
     - (1) the literal `createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })`;
     - (2) 0 `\bnow\b` in the adapter module;
     - (3) `LEVELS[DEFAULT_LEVEL]` `toEqual` `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 }`;
     - (4) `resolveOptions([])` gives `DEFAULT_LEVEL`.
     Each kills a named mutant (the page lists them).
   - **SE alternative 2** (a default-only `createEngine` branch) is refused. It keeps two code paths only so
     that a text pin stays green. **Alternative 3** (the literal in a comment) is refused. It fakes the
     green.
2. **`ABC-101` `A9`: widened by `src/engine.test.ts`.** The widening covers the one `(i)` `it` and its
   import specifiers. It is read with `git diff -U0`.
   - Why: the row lives in `ABC-086`'s file, and only `ABC-101`'s diff can move it.
   - Why it is narrow: any other hunk in that file breaks A9.
3. **`A7`: read in two halves.** Executable code must have 0 matches (the test row). Lines this ticket adds,
   comments included, must have 0 (QE reads this off the diff), except a citing comment.
   - The two base hits, `:8` "0.112 ms" and `:129` "simply", are tolerated by name.
   - Why: the literal text was false at cut time. Its intent ("this layer gives a level no meaning") is
     unchanged. Editing `ABC-042`'s comments is not this ticket's work (rule 9).
   - No test pins the raw count of 2, because test note 4 warns that this kind of prose count gets deleted.
4. **`ABC-042`: a dated pointer under its scope table.** It covers the table row, the out-of-scope bullet
   and `A6`(iii)'s child. It takes effect at `ABC-101`'s merge. The criteria are unchanged.
5. **Guards that moved without being named: allowed, not loosened.**
   - `ABC-061` `A2`/`A3`: the whole-object rule forces the new field into every expectation. It now also
     pins the default level on all 6 argvs, `random` on both outcomes, which is stricter. `ABC-061` `A5` reads
     its own diff only.
   - `ABC-042` `A8`: the transcription is exact by design and grows one explained number at a time.
     `32` (the D3 exponent) and `2`–`5` (the ordinals, with `3` also the default) are not row counts.
     Condition: both lists stay `toEqual`, and the comment states each meaning.
   - All of these are now named under `ABC-101`'s guard table.
6. **For the Orchestrator: the `AGENTS.md` slot line (`probe/agents-md-dev-run-slot.txt`) conflicts with no
   criterion.**
   - `ABC-065` `A3`: the documented options become `--colour`, `--difficulty`, `--ascii`, `--unicode`,
     which equals the accepted options. The values `1`–`5` appear.
   - The slot's rule (2): every named option is accepted.
   - `ABC-071`: one slot. `ABC-067`: the comment still closes inside it. `ABC-109` `A5`: 24,573 ≤ 24,576.
   - `ABC-101` `A5` is `USAGE`'s, not the slot's. `A6` is met once the line lands with the code.
   - The forms were run before writing (the SE's probe header).
   - **One wording remark, outside any criterion.** NEW drops "up to". "default level 3 (3 s/move)" reads as
     a fixed time, but the budget is a ceiling: book replies are instant. "(≤3 s/move)" costs +3 B and
     lands at exactly 24,576 B. That is the Scribe's call.
   - **Sequencing.** The Scribe lands the line after the SE's code, or in the same window. `A6` is read on
     the tree that holds both. The order is the Orchestrator's.

**`ABC-101` DoR after: 10/10, MET.** Items 2, 4, 5 and 10 were re-read on the page. Size `M` and `P1` hold.
