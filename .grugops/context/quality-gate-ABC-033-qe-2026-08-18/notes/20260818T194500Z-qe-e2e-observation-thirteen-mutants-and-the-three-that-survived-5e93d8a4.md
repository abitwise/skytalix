---
id: 20260818T194500Z-qe-e2e-observation-thirteen-mutants-and-the-three-that-survived-5e93d8a4
kind: observation
by: qe-e2e
at: 2026-08-18T19:45:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
  - src/san.ts
  - src/legal.ts
supersedes:
---

# Thirteen mutants against `src/move-input.test.ts` — ten died, **three survived**

Every mutant was applied to `src/move-input.ts` (M11 also to `src/legal.ts`), run as
`npx vitest run src/move-input.test.ts --reporter=json`, and reverted by a shell `EXIT` trap. Both
batteries ended with `diff -q` against the pristine copy: **RESTORE VERIFIED**. Baseline before any
mutation: **40 passed, 0 failed**.

| id | mutation | red | verdict |
|---|---|---|---|
| M1 | fold the case FIRST | **7** | killed |
| M2 | lowercase the exact attempt | **8** | killed |
| M3 | try all variants, take the first match | **2** | killed (thinly — see `G6`) |
| M4 | call `deps.legalMoves` twice | **12** | killed |
| M5 | fold union collapsed to a pick (`length >= 1` → first) | **2** | killed (thinly — see `G6`) |
| M6 | reason code ALWAYS `no-such-move` | **0** | **SURVIVED — `G4`** |
| M7 | reason code ALWAYS `unreadable` | **1** | killed |
| M8 | return `{ ...move }` instead of the `legal` element | **3** | killed |
| M9 | list the candidates, then `playMove` the first | **1** | killed |
| M10 | `ambiguous` emits only the first candidate | **9** | killed |
| M11 | `toSan(position, move)` — drop the shared `legal` | **0** | **SURVIVED — `G3`** |
| M12 | swap the attempt order (SAN before coordinate) | **0** | **SURVIVED — `G5`** |
| M13 | the module trims the line before handing it over | **1** | killed |

## The engineer's three mutants, re-run independently — and the divergence, stated honestly

The brief asked me to re-run the engineer's three. My red counts differ from theirs on two:

| mutant | engineer | QE (me) |
|---|---|---|
| fold-first | 6 | **7** |
| lowercase-the-exact-attempt | 5 | **8** |
| try-all-variants-take-first | 2 | **2** |

**I do not treat this as a discrepancy in the engineer's favour or against it.** My edits are not
byte-identical to theirs — the notes record the mutants by description, not by diff, so two different
faithful implementations of "fold the case first" can red different counts. The important thing is
the direction: **my counts are higher or equal on all three**, so nothing the engineer claimed was
killed turned out to survive. The load-bearing row the brief named — `A3` row 3, the fold-first
discriminator — reds under M1 in my run too. **Confirmed.**

Lesson worth recording for future hops: **a mutation result is only reproducible if the mutant diff
is recorded, not just described.** Neither note carried one. Mine are in the harness scripts, which
are scratch and not committed; the descriptions above are precise enough to rebuild each.

## `G3` — M11 survived, and it exposes a real blind spot in `A5`

M11 replaces `toSan(position, move, legal)` with `toSan(position, move)` in `ambiguous()`. **0 tests
red.** But it is not behaviour-neutral: `src/san.ts:78` is `legal ?? legalMoves(position)`, so
dropping the argument makes `toSan` derive the **prompt position's** legal moves once per candidate.

I instrumented the real `legalMoves` in `src/legal.ts` with a global counter and measured the true
per-prompt derive count:

| case | baseline | under M11 | `A5` spy reports |
|---|---|---|---|
| `e2e4` from the start position | 1 | 1 | 1 |
| `hello` (rejected) | 1 | 1 | 1 |
| `Nd2`, two knights (2 candidates) | **1** | **3** | **1** |
| `Qxd4`, six queens (6 candidates) | **6** | **12** | **1** |

Two separate facts fall out, and they must not be conflated:

1. **The blind spot.** `A5`'s spy watches `deps.legalMoves` only. `toSan` is imported directly from
   `./legal.ts` and is **not** a member of `MoveInputDeps`, so any derive it performs is invisible.
   M11 triples the real cost of a two-candidate ambiguity and the guard reports `1`. **A guard that
   does not red is not a guard** — this one does not, for this failure mode.
2. **The baseline is already not 1, and that is defensible.** Six queens costs **6** real derives at
   `64b596c`. Those surplus calls come from `toSan`'s `suffix` (`src/san.ts:105`,
   `check && legalMoves(position).length === 0`) computed on the position **after** each checking
   candidate — a *different* position, so `A5`'s "one derive per prompt" of the *prompt's* position
   is honestly satisfied. **I am not calling the baseline a defect.**

   But the delivered test's own comment (`src/move-input.test.ts:307`) reads *"Every attempt is
   handed the ONE array, so no resolver derives its own either."* **That comment is false as
   written** — `toSan` does derive its own, once per checking candidate. Anyone downstream quoting
   "one derive per prompt" as a cost bound for `NFR-003` or `N8-LANE` will be quoting a number that
   does not hold for ambiguous prompts, where the real cost is `1 + O(candidates)`.

Recommended repair (the engineer's, not mine to make): put `toSan` in `MoveInputDeps` so the spy sees
it, or assert the count against an instrumented `./legal.ts`. Correct the comment either way.

## `G4` — M6 survived: the reason-code precedence is asserted in one direction only

M6 returns `["no-such-move"]` for **every** rejection. **All 40 tests pass**, including the five
`A6` rows for `"hello"`, `"e9e9"`, `"Qz9"`, `""` and `"   "` — none of which names a move at all.

The cause is `src/move-input.test.ts:324-326`:

```ts
expect((outcome as { messages: readonly string[] }).messages).toEqual([
  expect.stringMatching(/^(unreadable|no-such-move)$/),
]);
```

The regex accepts either code, so the loop asserts only *"a code, not prose"* — which is a real and
worthwhile assertion, and is presumably why it was written this way. But it means **`unreadable` is
never pinned to any input anywhere in the suite.** The single test at `:333` pins `no-such-move` for
`e2e5`, which is why M7 (always-`unreadable`) died with 1 red. The precedence rule
`no-such-move` outranks `unreadable` is therefore **half-asserted**: inverting it is caught,
collapsing it is not.

Answering the brief's question directly — *"Is it asserted, or incidental?"* — **it is incidental in
one direction.** Repair: pin `unreadable` for at least one input (`"hello"` is the obvious one).

## `G5` — M12 survived: the "fixed and asserted" order of attempt is not asserted

The ticket's `## Scope` says *"Order of attempt, fixed and asserted: exact coordinate → exact SAN"*.
Swapping the two in `attemptsOn` reds **0 tests**.

The test that looks like it covers this (`:211-222`) asserts `coordinateTexts()[0] === "BXC4"`,
`sanTexts()[0] === "BXC4"` and that the two arrays are the same length. **None of those distinguishes
the order**, because both resolvers are called with the same text on the same pass, so their
first-elements and lengths match under either ordering. It asserts *"both readers saw the exact line
first"* — genuinely useful, and not what the scope line claims.

There is a second, more interesting point underneath. `attemptsOn` (`:163-170`) builds an array by
calling **both** resolvers **eagerly**, then the caller loops over the results. So there is no "order
of attempt" in the ordinary sense at all — **both grammars always run on every text**, and the order
only decides which *result* is preferred. The ticket's rationale (*"coordinate first, because it is
the smaller grammar and cannot match a SAN string by accident"*) describes a preference rule, and the
ticket also argues the two grammars are distinguishable by length in every accepted case — which, if
true, means no input can distinguish the orderings and M12 surviving is **expected rather than
alarming**.

**Severity LOW**, and the gap is one of accuracy rather than risk: either assert the preference with
an input both grammars claim, or stop calling it "asserted" on the ticket page. It also means the
eager double call is unremarked — every prompt pays for both parsers whether or not the first
succeeded. Not a defect against any criterion; worth the engineer knowing.

## `G6` — how many criteria notice a build that guesses? Two tests, one fixture

The brief asked me to break the union into a first-match and *"see how many criteria notice"*. I ran
it twice, at two different points:

- **M3** breaks the union at the *attempt* level (return on first match inside the fold loop): **2
  red**.
- **M5** breaks it at the *candidate set* level (compute the union, then take `candidates[0]`
  regardless of length): **2 red**.

Both times the same two tests: `A3` row 2, and its `A4` row. **Both are driven by the single fixture
`BOTH_CAPTURES_FEN` + `"BXC4"`.**

So: *"never guess is structural"* — **is the claim true? Yes.** The union genuinely is the mechanism,
and both ways of removing it are caught. **Is it well guarded? No.** The entire fold-ambiguity
property rests on one FEN and one input string. If that fixture were ever wrong, weakened, or
deleted, a build that silently picks a bishop over a pawn would ship green. Note the `fences`
describe block's *"never picks between two legal moves"* test (`:356`) does **not** help here — it
uses `e7d8`, which is ambiguous on the **exact** coordinate attempt, so it never exercises the fold's
union at all.

**Severity LOW**, observation not defect. Worth a second fold-ambiguity fixture on a different piece
family.
