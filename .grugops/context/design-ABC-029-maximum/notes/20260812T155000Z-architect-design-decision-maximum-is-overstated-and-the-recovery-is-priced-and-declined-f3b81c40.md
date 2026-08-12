---
id: 20260812T155000Z-architect-design-decision-maximum-is-overstated-and-the-recovery-is-priced-and-declined-f3b81c40
kind: decision
by: architect-design
at: 2026-08-12T15:50:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - D27
  - NFR-002
  - ADR-0002
  - EPIC-006
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
  - src/history-pane.nfr.test.ts
  - src/perft-bench.ts
  - src/gameend.ts
  - src/perft.ts
  - src/zobrist.ts
supersedes:
---

# BA/PM is RIGHT and it is now MEASURED: *"the maximum a textual guard may recover"* is false. The sentence is struck and bounded; the rule that refutes it is measured, PRICED and DECLINED; the containment stays at 6 of 12 and nothing being built moves.

> **Hand-authored.** `scripts/context-io.ts` does **not** exist — re-checked at source this hop, not
> inherited: there is no `scripts/` directory in this worktree. Note kind, id and front matter are
> hand-written and there is **no derived `index.md` / `index.jsonl`** for this `ref:`; `notes/` is the
> source of truth. **`scripts/claim.js` does not exist either** — the Workflow 17 claim was taken by
> hand (see the `artifact-ref` sibling).
>
> **`kind: decision` needs no stamp, and no `finding` is written at this hop.** There is no `§14-gate`
> verdict record under task `design-ABC-029-max-2026-08-12` and `context.human_admission` is **`off`**.
> **Nothing is self-stamped**, including the 57 instrument runs — those are an `observation`, and the
> sibling note says so in its own words.

## 1. The verdict on the sentence: OVERSTATED, and in the shape BA/PM named

`ADR-0011` said: *"So 6 of 12 is not a compromise; it is the **maximum a textual guard may recover
without breaking an accepted criterion**."*

**It is false, and it was refuted by construction rather than by argument.** BA/PM's counterexample —
count the dynamic literal **only in a module that exports something**, using clause 4's own
filename-free discriminator — was built and run on both trees. It recovers **12 of 12** and breaks
**no** accepted criterion: `WPERFT-DYN` **green on both trees** (which is what `A3` and `A6.2`
require), every `A6.1` row RED, every `A6.2` row green, `A5`'s rows unmoved, BASE green/green 8/8 on
both trees, **full suite 752 passed (752) on 26 files**. Numbers in the sibling `observation`.

**The shape is the one this file already corrected twice, and this is the third instance.**
*"Non-static"* described the class the delivered regex **happened to match** rather than the class it
**named**. *"The maximum"* states the ceiling for the class of guard that was **considered** —
expressions that treat every scanned file alike — as the ceiling for **all** textual guards. **I wrote
the replacement sentence one hop after correcting the first one, and I wrote the same defect into it.
BA/PM caught it; I did not.**

**What is true and all the reason ever supported:** *6 of 12 is the maximum recoverable by an
expression that treats every scanned file alike* — which the delivered and the ruled expressions both
do. That is what the sentence now says.

**A second sentence in the same paragraph was equally false and BA/PM did not name it** — *"The
dynamic forms need the probe's roots back, which is the whole-tree proxy clause 2 deliberately
removed."* They do not. **And a third, in alternative 9's own row** — *"recoverable only by rooting
the probe outside the frame path."* Both are struck by the same measurement. **Correcting one and
leaving two would have left the next hop citing one of the survivors**, which is precisely how the
first correction failed to stick.

## 2. The ruling on ADOPTION: a priced NO. The containment stays at 6 of 12.

**The rule works and is still not worth having.** Three measured costs; the first is binding.

1. **It false-positives on a construct THIS FILE RULED CORRECT.** `WPERFT-DYN-EXPORTING` — the
   harness keeps the `void import("./history.ts")` that the `A3` ruling calls **not a breach**, and
   gains one unrelated `export const PERFT_BENCH_VERSION = 1;` — goes **regex RED on both trees**,
   and **green** under the ruled containment. **The `A3` ruling turns on *"it is not a caller"* and
   *"off the frame path"*. Neither changes when the harness gains an export.** So *"exports
   something"* is a **proxy that fits today's tree**, not the property the ruling names — **the same
   defect shape again, and adopting it would write that shape into the CODE instead of into a
   sentence.** That is the whole reason, and it is why the answer is no rather than "later".
2. **The hole it opens is DATED.** A new zero-export production module holding the dynamic import
   (`WENTRY-DYN`) is **green** under the rule and **RED** under the uniform one. **Clause 4 names
   `EPIC-006`'s CLI entry point as the second entry point**, so the rule buys its `WPERFT-DYN` green
   by pre-authorising the exact evasion at the exact site this file already has on a schedule.
3. **A false-positive surface that cannot be closed.** A dynamic import is an **expression**, so it
   cannot be anchored the way the static forms are — measured: the ordinary indented-in-a-function
   form needs the unanchored pattern. Unanchored matches comments and strings: a **comment**, a
   **template string** and a **trailing comment** quoting the specifier each turn the guard RED. A
   comment-aware variant fixes only the first. **None is contained by the `lint` gate** — QE's
   containment argument covers `biome check` violations; **a comment's contents are not one.**
   `ADR-0011`, `ABC-029` and the instrument's own docblock all quote that literal verbatim.

**What the recovery is worth — the SECOND GROUND SURVIVES AND BOUNDS IT, exactly as BA/PM said, and
it is now measured rather than asserted.** `WOFFFRAME-COMPUTED` (`const spec = "./history" + ".ts";
void import(spec);`) is **green under the exports rule AND under the uniform dynamic rule**. The
containment's six are **closed forms** — `export … from` and a bare `import` cannot be evaded,
because ESM requires a literal specifier there. The extra six are **one spelling of an open form**.
**So the recovery buys reach against a careless dynamic import and none against an evasive one.
*"False confidence"* names it exactly, and I am not overselling the twelve.**

**Cost is NOT the reason.** The added predicate is **+20 µs per full 16-file scan** — irrelevant
beside the probe's ~20 ms spawn. Cheapness was never the question. **No `N8-LANE` verdict is claimed
and none is owed here.**

## 3. This hop causes NO REWORK, and that was checked rather than assumed

- **`A6.2` is a required VERDICT (`WPERFT-DYN` green), not a ban on a technique** — BA/PM wrote it
  that way deliberately, and **the measurement confirms the wider expression satisfies it too.** So
  the rows were correct under both rules and **no criterion row moves.**
- **The Engineer lands the ruled `widened` expression unchanged.** Nothing in their hop changes.
- **`ABC-029`'s criteria were NOT opened.** `ADR-0002`, `ADR-0008`, `ADR-0009`, `ADR-0010` read only,
  not opened. `plans/board.md`, `plans/nfr-catalog.md`, `ABC-028`, `ABC-019` and every merged ticket
  untouched. **No byte under `src/`** — `git diff --stat -- src/` empty.

## 4. If anyone ever wants the other six — owner and cost, named as the brief requires

**It is a NEW ROW on a NEW TICKET, not a change to `ABC-029`.**

| what | who |
|---|---|
| write the criterion row | **BA/PM** |
| build it | **Engineer**, in `src/history-pane.nfr.test.ts` |
| re-rule this ADR | **Architect/Design** |

**Cost to reopen: they must beat costs 1 and 3 above — not the arithmetic.** The arithmetic is
settled and recorded (12 of 12, measured twice now). **`R4` in the residual register is amended so it
cannot be read as *"nothing textual could catch these six"*, which is the reading that would send a
future hop to re-derive what is already on the page.** Owner and trigger on `R4` are unchanged.

**My recommendation is that it is not worth doing**, and cost 1 is why: a guard that reds a build this
ADR ruled correct is worse than a guard that misses it.

## 5. Ratification — NOT OWED, and none was manufactured

**No target, no bar, no level and no `UNKNOWN - verify` marker moves.** This amendment strikes a
rationale sentence, adds a measured alternative and a priced rejection, and changes no clause and no
verdict. Every claim is gate-adjudicable — it fails on the constructed builds or it does not, and
**all 57 were run.** Same distinction from `ADR-0008` that `ADR-0009` and `ADR-0010` draw.
**`ADR-0004`'s by-delegation ratification is NOT relied on and NOT extended.**

**No residual is newly accepted.** `R4` was already this file's ruling; what changes is only the
record of what a textual rule *could* do about it and why it should not.

## 6. Requested board move — **NONE**

`ABC-029` stays in **`In Development`**. The ticket's front matter reads `in-development` /
`In Development` and agrees with the board; **nothing moves and no front matter is edited.**
The Architect's `In Design` exit is not this ticket's live transition — `ABC-029` is past it, and this
hop corrected a record rather than designing a structure. **`plans/board.md` was not opened.**
