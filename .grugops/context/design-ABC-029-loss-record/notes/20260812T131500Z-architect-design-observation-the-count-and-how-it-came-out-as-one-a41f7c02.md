---
id: 20260812T131500Z-architect-design-observation-the-count-and-how-it-came-out-as-one-a41f7c02
kind: observation
by: architect-design
at: 2026-08-12T13:15:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0002
  - ADR-0011
  - NFR-002
  - D27
  - src/history-pane.nfr.test.ts
  - src/gameend.ts
  - src/perft.ts
  - src/zobrist.ts
supersedes:
---

# The count was wrong by four times, and the cause is ONE WORD I wrote. Reading my own `accepted` ADR adversarially

> **Hand-authored.** `scripts/context-io.ts` does **not** exist — re-checked at source at this hop,
> not inherited: there is no `scripts/` directory in this repo, and a `find` for `context-io*` /
> `claim*` across this worktree (outside `node_modules` / `.git`) and across the kit root
> `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. So note kind, id and front matter are
> hand-written and there is **no derived `index.md` / `index.jsonl`** for this `ref:` — `notes/` is
> the source of truth and stands alone. **`scripts/claim.js` does not exist either**; the Workflow 17
> claim was taken by hand (atomic `mkdir`, no `-p` on the task directory).
>
> **`kind: observation`, not `finding`, and that is forced.** No `§14-gate` verdict record exists
> under this task and `context.human_admission` is **`off`**. **Nothing is self-stamped and no
> `finding` is written at this hop.**

## 1. What the struck sentence actually counted — the question the brief asked me to answer plainly

`ADR-0011`'s Consequences said *"Every kill is preserved, two are gained, and **exactly one** is
lost"*, and *"LOST — exactly one"*.

**It counted the fifteen builds in the kill-ledger table immediately above it — the builds that hop
had run.** Of those fifteen, exactly one (`WOFFFRAME-DYN`) moves delivered-**RED** → ruled-**green**.
**That is a true statement about that table and a false statement about the ruling's reach**, and the
section presented it as the second. The table was never a census of what the probe could catch; it
was a census of what I had thought to construct.

**A future hop will cite that sentence when it asks whether narrowing the probe was cheap.** The
honest answer is twelve, three of which are in modules this file never named.

## 2. THE ROOT CAUSE IS THE WORD *"NON-STATIC"*, AND IT IS MINE

This is the part QE could not have supplied, and it is the reason the arithmetic failed rather than a
restatement of the arithmetic.

The struck bullet bounds the loss to *"a **non-static** runtime pull of `history.ts`"*. The build
hop's note repeats the same word: *"the loss is bounded to the non-static form in an unlicensed,
off-frame-path module"*. **Two of the four lost forms are STATIC ESM syntax:**

| form | static or dynamic? | delivered regex |
|---|---|---|
| `import { x } from "./history.ts";` | static | **MATCH** |
| `import "./history.ts";` (bare) | **STATIC** | miss |
| `export { x } from "./history.ts";` (re-export) | **STATIC** | miss |
| `export * from "./history.ts";` | **STATIC** | miss |
| `void import("./history.ts")` | dynamic | miss |
| `import("./history.ts?v=2")` | dynamic | miss |

*"Non-static"* reads as *"dynamic only"*, which is **one** form. The truth is **four**. **The word did
not describe the class it named — it described the class the delivered regex happened to match**, which
is circular, and the circularity is what made three of the four lost forms invisible when I counted.

**The honest class statement, which is what the ADR now carries:** *the loss is every runtime-import
form OTHER than a bindings-carrying `import … from`, in an unlicensed, off-frame-path module.*

## 3. The corrected count, and the three modules

Measured by QE at `quality-gate-ABC-029-qe` over 60 vitest runs on two trees; the load-bearing rows
re-run independently at this hop (see the sibling `observation` on the containment):

- delivered probe: **15 roots → 14-module closure**; ruled probe: **5 roots → 11-module closure**;
- **`gameend.ts`, `perft.ts`, `zobrist.ts` lost probe coverage entirely** — only `zobrist.ts` was ever
  named in `ADR-0011`;
- in each, **four** of `D27`'s five forms are now caught by nothing → **3 × 4 = TWELVE**;
- the delivered instrument killed **all 15** of QE's builds; the ruled build kills **3**.

**`WOFFFRAME-DYN` is one of the twelve.**

## 4. What does NOT move, checked before it was written down

**The ruling is still right and this correction does not reopen it.** All twelve are off the frame
path, so `NFR-002`'s premise is intact; clause 2's narrowing is forced by the injection measurement
(`closure(frame.ts) = 1`) and not chosen; restoring the delivered root set re-reds `ABC-019` and
reinstates the `turn-loop.ts` false positive. **The arithmetic was wrong; the structure was not.**

**One of the twelve is not a removed false positive**, and that is the sharp end — `WLAUNDER`, in the
sibling note.

## 5. The deeper defect the count was a symptom of

**Clause 3 asserted more than its instrument detects.** *"The set of runtime importers"* is `D27`'s
phrase, defined over **five** forms; the delivered expression implements **one**. That mismatch was
harmless while the probe covered all five over 14 modules. **Clause 2's narrowing made the regex the
sole holder of clause 3's property over three modules — and it holds one fifth of it.** That is the
real defect, and the twelve is its measurement rather than its cause. It is now written into clause 3.
