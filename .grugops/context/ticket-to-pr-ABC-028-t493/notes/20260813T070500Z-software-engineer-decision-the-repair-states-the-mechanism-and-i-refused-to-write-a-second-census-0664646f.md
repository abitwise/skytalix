---
id: 20260813T070500Z-software-engineer-decision-the-repair-states-the-mechanism-and-i-refused-to-write-a-second-census-0664646f
kind: decision
by: software-engineer
at: 2026-08-13T07:05:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-017-A9
  - ABC-016
  - src/history-pane.test.ts
  - src/history-pane.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The `:493` repair states the MECHANISM and I refused to write a second census — the replacement sentence has no falsifier outside the file it sits in

> **Hand-authored, no stamp.** `scripts/context-io.ts` does **not** exist in this repository — there
> is no `scripts/` directory at all, checked at source this hop — and `mcp__grugops__propose_note`
> is not in this session's tools. `context.human_admission` is `off` and **no `§14-gate` verdict
> record exists under this task**, so **nothing on this hop is a `finding`** and no stamp was
> invented. `confidence: high` refers to the measurements, every one of which was RUN. There is no
> derived `index.md` / `index.jsonl`: the tool that renders them does not exist and none was
> hand-faked. **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made
> **by hand** — see `.grugops/queue/done/ticket-to-pr-ABC-028-t493/claim.md`.

**Worktree `../cli-chess-abc028-t493`, branch `grugops/ABC-028-t493`, HEAD `47fef3d`.** No other
worktree entered. **No timing measurement taken, by instruction.**

## What was there and what is there now

`src/history-pane.test.ts`, the `A9` doc comment. **Four lines became eight; nothing else in the
file moved.** Pre-edit `:491-494`, post-edit `:491-498` (the comment block itself grew from
`:486-500` to `:486-504`).

Removed:

> *"Measured: `WPOS` — a pane that corrupts the caller's `history.position` once per object and
> changes no rendered byte — **passes 732/732 on 26 files** against the shared fixtures, **with zero
> catchers anywhere in the project**, and fails here. `buildAllCases()` is called inside each test
> for that reason."*

Written:

> *"THE MECHANISM, which is a fact about the code in front of you and not a count of anything: a
> snapshot taken over an already-rendered module-scope singleton is BLIND to a corruption that
> happens once per object, because that corruption is already inside the snapshot — so the fixture
> must be built inside the test that snapshots it. `WPOS` is that build: a pane that corrupts the
> caller's `history.position` once per object and changes no rendered byte. It dies here, and it
> dies again at `ABC-028` `A4` in this file, which watches the caller's graph DURING a render.
> `buildAllCases()` is called inside each test for that reason."*

## The five obligations, discharged one at a time

| # | obligation | how it is discharged |
|---|---|---|
| **(i)** | the exhaustiveness claim goes, in any tense or hedge | *"with zero catchers anywhere in the project"* is **deleted, not softened**. `/usr/bin/grep -rn "anywhere in the project" src/` exits `1` — **zero hits in the whole of `src/`**, not merely outside the block |
| **(ii)** | the total goes and is NOT refreshed | `732/732 on 26 files` is **deleted**. It was **not** taken to `807/28`. The replacement contains **no number at all** |
| **(iii)** | the reason is preserved | *"`buildAllCases()` is called inside each test for that reason"* survives verbatim as the closing sentence, and the sentence it now points at is a **stronger** reason than the one it pointed at before — a deduction rather than a measurement |
| **(iv)** | state the mechanism, not a census | the new first sentence is a statement about *this* fixture and *this* snapshot, in the reader's field of view. **Its truth follows from what the code does, so no commit anywhere can falsify it** |
| **(v)** | if a catcher is named, name it as a CRITERION never as a COUNT | *"it dies again at `ABC-028` `A4` in this file"*. No count. Not *"there are two catchers"*, not *"the only other catcher"* |

## THE THING THE ORCHESTRATOR ASKED FOR EXPLICITLY: I did not replace one census with another

**The failure mode I was warned about is writing something that is true today and quantifies over
the tree** — *"only two criteria catch it"*, *"nothing else in `src/` catches it"*, *"the only other
catcher is `A4`"*. **Every one of those is the same defect with a different number**, and every one
of them has a falsifier that is **not in the text**: a criterion somebody adds tomorrow in a file I
have never opened. `grep` cannot see that falsifier, and the parent hop measured that both priced
candidate controls cannot either.

**So the new text asserts nothing that ranges over anything.** Checked clause by clause against the
question *"what commit, anywhere, could make this false?"*:

- *"a snapshot taken over an already-rendered module-scope singleton is BLIND to a corruption that
  happens once per object"* — **a deduction, not a measurement.** If the corruption happened on the
  first render and the first render happened in an earlier test, the snapshot this test takes
  already contains it, so before-equals-after holds no matter what else the test asserts. **Nothing
  anyone commits can make this sentence false**; only a change to what `ALL_CASES` is could make it
  *irrelevant*, and that change is in this file, in the reader's hands.
- *"`WPOS` is that build: … corrupts … once per object and changes no rendered byte"* — a
  **definition** of a named build, not a claim about the tree.
- *"It dies here, and it dies again at `ABC-028` `A4` in this file"* — a claim that **CITES**, and it
  cites **inside the file it is written in**. Per the parent hop's own mechanical rule, a figure
  scoped to the file you own is yours to keep true; this is the strongest form of that: the cited
  criterion is 450 lines below the citation, in the same file, under the same ticket. **A reader can
  resolve it without leaving the buffer, and this hop measured it dying.**

**What is deliberately absent: any sentence of the form "and nothing else".** The tree is stronger
than the old comment said and may get stronger still; the new comment does not care, because it
never counts.

## What I refused, and why each refusal is the parent hop's ruling and not my preference

- **Refreshing `732/732` to `807/28`.** Buys one hop of accuracy and re-arms the identical defect.
  Obligation (ii), and this page's standing instruction for `:115`.
- **Minting an `A6`.** *"The comment says only what is true"* is a one-time verdict wearing a
  standing tense; this page has demoted that shape twice. **No criterion was minted, no criterion's
  text was touched, and the ticket still has exactly five.**
- **Writing *"`A9` and `A4` are the two catchers"*.** True today, census-shaped, and the exact
  substitution the Orchestrator named. Obligation (v).
- **Touching `src/history-pane.test.ts:1014`.** BA/PM's instance 2, same shape, explicitly excluded
  so a two-line fix does not become a text hop. **Read, left alone, reported.**
- **Touching `src/zobrist.nfr.test.ts` or `src/status-panel.nfr.test.ts`.** `ABC-030`'s, and
  refreshing their numbers is explicitly refused as the repair. **Neither file was opened for edit.**
- **Touching `src/history-pane.ts`.** Zero production lines is this ticket's fence. Its md5 is
  unmoved and its diff is EMPTY.
- **Editing `plans/board.md`, any ADR, `plans/nfr-catalog.md`, `ABC-029`, `ABC-019`, `ABC-030` or any
  merged ticket.** None opened for edit.
- **De-duplicating the `ABC-028` / `ABC-029` rows in `plans/traceability.md`.** Rule 12 and the
  file's own note: I appended to the **FIRST** of the pair and deleted nothing.

## Style, per rule 11 rather than my own taste

`THE MECHANISM,` follows the block's existing `THE FIXTURES.` / `THE SPLIT.` capitalised-lead-in
shape. The cross-describe criterion reference is written `` `ABC-028` `A4` `` because that is how
this file already writes one (`:977`, `` `ABC-017` `A14` ``). Line width matches the block.
