---
id: 20261010T131017Z-software-engineer-decision-abc057-equality-pinned-by-framed-literal-clause3-transcribed-composer-claim-narrowed-b4c2a298
kind: decision
by: software-engineer
at: 2026-10-10T13:10:17Z
verified_by:
confidence: high
refs:
  - ABC-057
  - ADR-0011
  - ADR-0029
  - ADR-0030
  - R5
  - QE-054-b
  - src/history-pane.nfr.test.ts
  - 20261010T105420Z-ba-pm-decision-eight-august-pages-five-ready-one-drop-4fdfe525
  - 20261010T130030Z-qe-e2e-observation-abc054-gap-register-ee331683
  - 20261010T131017Z-software-engineer-observation-abc057-gates-ledger-arming-controls-cost-4d731ea3
supersedes:
---

# `ABC-057` built: the equality is pinned by a framed literal, clause 3 is transcribed, and the composer claim is narrowed

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- Branch `grugops/ABC-057-licence-guard`, from wave tip `079284d9`. The code commit is `404934f3`.
- Not merged, not pushed.

## D1. The tripwire's literal carries its leading newline and indent. The ticket's bare shape would match itself

The scope asks for `expect(instrument).toContain(<the comparator's literal text>)`. Written bare, the
string literal puts the comparator's text into the file it reads, so the assertion always finds itself.
**Measured:** `NAIVE+M15` (bare literal, then QE's `M15`) is **GREEN**, 12/12 (`probe/ledger-m15.tsv`).
The delivered literal is `"\n    expect(runtimeImporters).toEqual(…);\n"`. In source, the `\n` is a
backslash and an `n`, not a newline, so it cannot match itself. It matches only the guard's own line,
at its own indent. The shape is unchanged (`expect(instrument, msg).toContain(...)`, beside the
sibling). One comment line at the site says why the framing is load-bearing. **Not tamper-proof**
(test note 2): a hop can change both lines together, and the change then shows in the diff.

## D2. The licence docblock states clause 3 as amended, with (i) and (ii) in the ADR's words

The struck sentence is gone (0 of `game-owning driver`). The replacement transcribes `ADR-0011`'s
amendment: (i) NECESSITY with "constructs or advances the game" and the TYPE/INJECTED exclusion,
(ii) the single supplier intact with "never a bare `gameStatus`, never a status literal". It also
carries "being off the frame path is NOT part of this test" and the refused wide reading, by name
(test note 4).

**Per-entry citations (`A4`).** `cli.ts` is transcribed from the ADR's own argument. `turn-loop.ts` is
the one place where I added words to the ADR's "(i) it advances the game". **The loop already receives
`GameHistory` injected** (`options.history`), so "injected is unavailable" would be false as written.
The citation says what the source shows (`src/turn-loop.ts:52`): injection gives it the data, and
advancing it needs `playMove`/`takeBack` (and evaluating it needs `gameStatusOf`/`keyHistory`).
Those are calls, which a type import cannot make. **Architect/Design may want to confirm that this
reading of "receive one injected" is the one they meant.** I also corrected "ONE entry" to "TWO
entries", because that sentence is inside the citation paragraph being rewritten.

## D3. QE-054-b: the composer claim is narrowed in the docblock, and the tripwire is untouched

The fail-closed paragraph now says "a static value import THE TRIPWIRE READS". It says the tripwire
reads a namespace binding, or a brace specifier that BEGINS with the name. It names the two value
imports the tripwire does not count: a comment ahead of the name inside the brace, and a default
binding. The comment example is described in words, not spelled out, because spelling it would close
the JSDoc comment. The tripwire is not widened (`ADR-0029`'s site).

**Left as found, flagged:**
- The in-test comment at head `:541`, inside the tripwire's `it` block, still says "binds
  `assembleFrame` by a static value import and for nothing wider". It makes the same wide claim. The
  fold-in named the docblock only, so I left it alone. It needs a one-line comment edit, by Architect
  or BA/PM routing.
- The paragraph "THE LICENCE IS FILTERED…" still says "this tree has no `turn-loop.ts`". That is
  historical and false of today's tree. It is outside `A3`/`A4`, so it is untouched.
