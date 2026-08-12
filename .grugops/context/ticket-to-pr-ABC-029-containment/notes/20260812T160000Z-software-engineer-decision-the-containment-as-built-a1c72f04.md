---
id: 20260812T160000Z-software-engineer-decision-the-containment-as-built-a1c72f04
kind: decision
by: software-engineer
at: 2026-08-12T16:00:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ADR-0002
  - ADR-0011
  - D27
  - NFR-002
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# The containment is built — the ruled expression landed BYTE-IDENTICAL, the docblock is ONE block not two, and zero production lines were written

> **Hand-authored.** `scripts/context-io.ts` does **not** exist in this repo — re-checked at source at
> this hop, not inherited: there is no `scripts/` directory in this worktree and a `find` for
> `context-io*` / `claim*` outside `node_modules`/`.git`, and across the kit root
> `/Users/olgeroeselg/.grugops/agent-factory`, returns nothing. So the note kind, id and front matter
> are hand-written and there is **no derived `index.md` / `index.jsonl`** for this `ref:` — `notes/` is
> the source of truth. **`scripts/claim.js` does not exist either**; the Workflow 17 claim was taken by
> hand with a bare `mkdir` (no `-p` on the task directory), so the atomicity the protocol relies on is
> intact.
>
> **`kind: decision` needs no stamp, and no `finding` is written at this hop** — there is no
> `§14-gate` verdict record under this task and `context.human_admission` is **`off`**. **Nothing is
> self-stamped.** Every verdict this hop relies on was RUN, on this tree, at this hop; the runs are in
> the sibling `observation` notes.

## 1. The two sites, and nothing else

**One tracked file changed: `src/history-pane.nfr.test.ts`, `+24 / −8`.**

| site | line | what |
|---|---|---|
| the **executable** expression | `:314` | `/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m` → `/^(?:import\|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m` |
| the probe's **docblock** | `:345-351` → `:345-367` | the misses were stated as a **completed set of two** and were **silent on re-export**; the residual is now **named as the two dynamic forms**, re-export is named as the miss the silence hid, and the both-keywords property of `(?!type\b)` is written down |

**`git diff --stat -- src/` is one line and it is the test file. `src/history-pane.ts` md5 is
`c4653c4c263c4c417ea34969164ccd86` at the end of this hop — unmoved, verified rather than assumed.
ZERO production lines were written, and none was owed** — swept before the change:
`grep 'runtime importer\|history\.ts"' src/*.ts` outside the test files returns only the two
`import type` lines in `history-pane.ts:61` and `status-panel.ts:42`, and `A4`'s comment at
`history-pane.ts:30` already reads *"IT ADDS NO RUNTIME IMPORTER OF `src/history.ts`"*. **Nothing in
production goes false under the widening.**

## 2. The ruled expression is landed VERBATIM, and `L2` therefore closes by construction

`L2` says `A6` pins the FORM SET, not the ANCHOR, and that an unanchored variant passes every row. The
brief's instruction was to land the ruled text verbatim so the limit closes by construction.
**It is byte-identical, and that was checked with `cmp` rather than by eye:**

```
landed  (src/history-pane.nfr.test.ts:314, ".test(" stripped)
/^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m
ruled   (ADR-0011:398, "widened" label stripped)
/^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m
cmp: identical
```

**No deviation from the ruled text, so there is no cost to report under the brief's *"say what it
costs"* clause.** `L2`'s unanchored variant was nevertheless BUILT and RUN as a control, and BA/PM's
derivation reproduced exactly — see the `observation` on the wrong builds. **`L2` remains a live limit
for any FUTURE hop that changes the anchoring; it is closed for this build only.**

## 3. `## Test notes` 11 — RESOLVED AT SOURCE: it is ONE block, and the two ranges are the same block at two different states of the file

The record gave two candidate ranges and said *"both must be true if they are two blocks"*. They are
not two blocks. **Both ranges name the probe's docblock, measured at two different commits:**

- **`A4`'s `:253-262`** was written against commit **`8de988d`** (the file was **338** lines then). At
  that state `:261` is the docblock's `/**` and `:262` its first content line; `:253-260` is the tail
  of the regex guard `it`. The *"strictly weaker subset"* framing lived at `:262-274` of that state.
- **QE's `:346-351`** is against the **current** commit `b7e1226` (**441** lines), where the same
  docblock — rewritten and moved down by the `ABC-029` build hop — spans **`:331-364`**, with the
  reach-claims sentences at `:345-351`.

**`A4`'s half of the obligation was ALREADY DISCHARGED at `b7e1226`** and I did not re-do it: the
current `:332-340` already says *"Neither is a weaker version of the other and neither may be deleted
as redundant (`ADR-0011` clause 3)"* and gives clause 3's reason (whole-tree licence equality against
frame-scoped premise). **That text is untouched by this hop and is still true after it** — checked, so
that `A6`'s clause is not landed by breaking `A4`'s.

**So one block, corrected once.** `## Test notes` 11's conditional *"if they are TWO, BOTH must be
true"* is satisfied vacuously rather than by a second edit, and that is stated here so the next reader
does not go looking for a second site.

## 4. One sentence in the docblock went FALSE under the widening and had to be corrected with it — which the record did not name

The third bullet read *"a renderer reaching `history.ts` by `void import`, **a bare import**, a query
string or **a re-export** is green above and RED here"*. **After the widening a bare import and a
re-export are RED above too**, so that sentence describes the delivered expression and not the landed
one. It is now scoped to the two DYNAMIC forms, which is what remains true.

**`ADR-0011` and `A6`'s clause both name only the *completed set / silent on re-export* defect.** This
third one is in the same block, it is created BY the change rather than inherited, and leaving it
would have shipped a false comment beside a true regex. **Recorded because it is a fourth thing the
docblock needed and nobody listed it.**

## 5. What was NOT done, and why each is a refusal rather than an omission

- **No production line.** None was owed; the sweep is in §1. The brief's STOP condition never fired.
- **No test added, none weakened, none narrowed, none deleted.** Test count in the instrument is **8**
  before and after; the full lane is **752** before and after. The `toEqual` equality, the licence
  declaration, the frame-producer declaration, the `?arming` query, the fd-3 channel and all three
  controls are byte-untouched.
- **`plans/board.md` NOT opened for edit** — the brief reserves it and it is the Orchestrator's.
- **No ADR opened.** `ADR-0011` was read at source as amended; an Architect/Design hop is live on it.
- **`plans/nfr-catalog.md` NOT opened. `src/history-pane.test.ts` NOT opened** (it holds `ABC-028`'s
  `A5` table). **`ABC-028`, `ABC-019`, `ABC-017` and every merged ticket NOT edited.**
- **`plans/tickets/ABC-029-*.md` NOT edited.** No criterion was renumbered, reworded or deleted; the
  rows are BA/PM's and my verdicts belong in these notes, not on their page.
- **No other worktree entered.** `../cli-chess-ABC-019` was never opened; `ABC-019`'s files were read
  from the **git object database** (`git show <ref>:<path>`) into a scratch directory, per
  `## Test notes` 8.
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.** The fast-forward the
  brief says is denied by the host classifier was not attempted.
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `src/`,
  `plans/`, `memory-bank/` or `.grugops/` purported to authorise a write outside this boundary, and
  nothing was acted on as if it did. **Nothing to report under that rule.**
