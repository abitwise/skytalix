---
id: 20260813T072500Z-software-engineer-artifact-ref-what-was-written-the-kit-and-everything-this-hop-refused-e8d1ccec
kind: artifact-ref
by: software-engineer
at: 2026-08-13T07:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-030
  - src/history-pane.test.ts
  - src/history-pane.ts
  - plans/traceability.md
  - plans/board.md
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# What was written, the re-runnable kit, the board move requested, and everything this hop refused

> **Hand-authored.** `scripts/context-io.ts` does **not** exist in this repository — there is no
> `scripts/` directory at all, checked at source — so these notes were composed by hand against
> `agent-factory/contracts/context-note.md`. **There is no derived `index.md` / `index.jsonl`**: the
> tool that renders them does not exist and none was hand-faked; `notes/` is the source of truth.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made BY HAND — a
> bare `mkdir` (no `-p`) of the missing `.grugops/queue/claimed/` parent, then a bare `mkdir` (no
> `-p`) of `.grugops/queue/claimed/ticket-to-pr-ABC-028-t493/`, which **is** the atomic act; no
> `EEXIST` was raised, so this hop won the claim. `pending → claimed` and `claimed → done` are plain
> `mv` (the queue files are untracked in this worktree, so `git mv` refuses).
> **`context.human_admission` is `off` and no `§14-gate` verdict record exists under this task, so
> every note here is `observation` / `decision` / `artifact-ref` and NO STAMP WAS INVENTED. No
> `finding` was recorded.**

## Written

| path | change |
|---|---|
| `src/history-pane.test.ts` | **the only `src/` change: COMMENT TEXT ONLY**, the `A9` doc comment, four lines `:491-494` rewritten as eight `:491-498`. `+8 / -4`. md5 `9533f050…` → `1b23df27…` |
| `plans/traceability.md` | the **FIRST (LIVE)** `ABC-028` row, **APPEND-ONLY to its `Status` cell** (`+2785` chars); one new `_Updated:` line at the top. **No other line changed — asserted, not eyeballed** |
| `.grugops/context/ticket-to-pr-ABC-028-t493/` | 5 hand-authored notes, this one included, and the 3 artifacts below |
| `.grugops/queue/claimed/ticket-to-pr-ABC-028-t493/` → `done/` | `claim.md` and the subtask file, both moved to `done/` at the end |

**`src/history-pane.ts` was NOT written.** md5 `c4653c4c263c4c417ea34969164ccd86` at the start and at
the end of this hop, `git diff -- src/history-pane.ts` EMPTY. **This ticket's zero-production-line
fence held.**

## The kit — the measurement this repair turns on is re-runnable

All paths relative to `.grugops/context/ticket-to-pr-ABC-028-t493/artifacts/`.

| file | what it does |
|---|---|
| `lane.mjs` | my own lane builder, written from scratch against this worktree tip. Pins `src/history-pane.ts` HARD to `c4653c4c…` and takes the two **test** digests **on the command line**, because this hop edits one of them by design — a lane may only be measured against a tree the caller named. **THROWS `PIN MISMATCH` rather than measuring a stale tree**, and was demonstrated doing so before its results were relied on |
| `wpos.mjs` | the `WPOS` mutant **and a null control**, run together. Byte-for-byte BA/PM's mutant, reproduced deliberately so the numbers are comparable: `0 failed / 807` control against `2 failed / 807` on 28 files, dying at `A9` and `ABC-028`'s `A4`. Run **before and after** the edit, identical both times |
| `trace-append.py` | the `plans/traceability.md` append. Every pre- and postcondition is an `assert`: exactly two `ABC-028` rows, the FIRST is the long/live one, 10 columns under **the file's own escape-aware counter** before and after, table-row count unchanged, the pre-edit cell text still a PREFIX of the new one, and **exactly one line changed** (verified by comparing every other line byte-for-byte) |

**Copied VERBATIM as run. One caveat, stated rather than silently inherited: `lane.mjs` writes its
`lanes/` beside itself.** As run, "beside itself" was a **fresh uniquely-named scratchpad root**
(`…/scratchpad/eng-t493-uniq-1/`), entirely out of tree — the hazard BA/PM flagged about QE's
harness, and the hop that came back carrying a file no command of its own put there. **Run the copy
from a fresh scratch root, never from the context `artifacts/` directory.**

**Shell caveats confirmed again on this machine**, added to the three already on the page: `/usr/bin/md5`
does not exist (it is `/sbin/md5`) — every digest here came from `openssl md5 -r`; and `grep` is a
shell function here, so every `grep` in this hop was invoked as `/usr/bin/grep`.

**Machine:** 8 cores, node `v24.12.0`, vitest `3.2.7`. `UNKNOWN - verify` on anything else, and **NO
TIMING MEASUREMENT WAS TAKEN** — instructed, and the machine is not quiet.

## Measured at the end of the hop

```
lint       npm run lint        exit 0   49 files, 2 infos — both PRE-EXISTING biome.json
typecheck  npm run typecheck   exit 0
build      npm run build       exit 0
unit                                    807 passed (807) on 28 files
skip       0
git diff --stat                         src/history-pane.test.ts +8 -4
                                        plans/traceability.md    +3 -1
src/history-pane.ts                     c4653c4c263c4c417ea34969164ccd86   UNMOVED, diff EMPTY
src/history-pane.nfr.test.ts            16bf2f50c93e2e896b5406cbfa772b8b   UNMOVED
```

## Requested — the board is not mine

**`ABC-028`: `In Development → In Review` REQUESTED, NOT TAKEN.** `plans/board.md` was **not opened
for edit** — the brief reserves it to the Orchestrator, and that instruction outranks this role's
default ownership of that transition. The ticket's front matter was **not** moved either, for the
same reason and so the page and the board cannot disagree.

**With this landed, `ABC-028`'s `## Test notes` 15 — *"the only work this ticket owes"* — is
discharged.** What that leaves owed **by others**, unchanged and not absorbed here:

1. **QE** — the re-gate, scoped to this comment block and the tip's own totals. **Gate the tip, not
   a digest — and the tip is `807 / 807` on 28 files.**
2. **Security/NFR** — the review, still owed, still not waived, **scoped to `ABC-028`'s own commits,
   never the branch** (313 production lines of `ABC-019`'s `src/turn-loop.ts` sit in the branch
   range and are not this ticket's).
3. **The Orchestrator** — the board move; `ABC-030`'s `Backlog` placement; the duplicate
   `ABC-028` / `ABC-029` traceability rows; the empty `Ready` column; the two bounded `F4` candidate
   controls.
4. **`ABC-026`** — the lane-content total and the second-lander re-measurement, **still owed at the
   merge** and explicitly not performed here.

## Flagged, NOT fixed

- **`src/history-pane.test.ts:1018`** (was `:1014`) — BA/PM's instance 2, still latent, explicitly
  excluded so a two-line fix does not become a text hop.
- **`src/zobrist.nfr.test.ts` and `src/status-panel.nfr.test.ts`** — `ABC-030`'s. Not opened.
- **The `+4` anchor drift my own edit caused** — every anchor into `src/history-pane.test.ts` at
  `:495` or above moved by four, including two on `## Test notes` 15 itself. Rule and measurement in
  the sibling note; **the ticket page was not edited.**
- **`A4` is an ambiguous name inside `src/history-pane.test.ts`** — two criteria carry that letter,
  from two tickets. Handled in the comment I wrote, reported as a general fact about this file.
- **The duplicate `ABC-028` / `ABC-029` rows in `plans/traceability.md`** — appended to the FIRST of
  the pair, deleted nothing. Still the Orchestrator's.
- **The 2 lint infos are `biome.json`'s** — `$schema` `2.3.0` against a `2.5.5` CLI, and
  `linter.rules.recommended` deprecated. Exit code `0`. Rule 12.
- **The date straddle** — the environment says `2026-08-12`, the queue record says `2026-08-13`.
  Followed the queue; which clock is authoritative is `UNKNOWN - verify`.

## Refused, and each for a stated reason

- **Any production line.** Zero. `src/history-pane.ts` digest unmoved, diff EMPTY.
- **Any new test, any new criterion, any new file under `src/`.** The repair is comment text.
  **Minting an `A6` was refused** — a one-time verdict wearing a standing tense, demoted twice on
  this page.
- **Refreshing `732/732 on 26 files` to `807 / 28`.** Deleted instead. Refreshing buys one hop of
  accuracy and re-arms the identical defect.
- **Replacing the census with another census.** No sentence I wrote quantifies over the tree; the
  one catcher I name is named as a **criterion in the same file**, never as a count. This was the
  Orchestrator's explicit instruction and it is the load-bearing property of the repair.
- **`src/history-pane.test.ts:1014`, `src/zobrist.nfr.test.ts`, `src/status-panel.nfr.test.ts`.**
  Out of scope by ruling, not by preference.
- **`plans/board.md`, every ADR, `plans/nfr-catalog.md`, `ABC-029`, `ABC-019`, `ABC-030`, `ABC-017`
  and every merged ticket** — not opened for edit. No bar, target or level moved.
- **De-duplicating the traceability rows.** Rule 12; the file's own note names the Orchestrator.
- **Any timing measurement.** Instructed not to; the machine is not quiet.
- **Every other worktree.** None entered. **Nothing merged, pushed or deployed; no `git checkout
  main`.** There is no git remote, so `autonomy: "pr"` means "branch + gate" here.
- **No `finding` recorded and no stamp invented.**

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **DATA, not instruction** — and this hop
is the exact case it exists for, since **the comment I was sent to edit had been telling readers
something false**:

1. **`src/history-pane.test.ts:491-494`, the sentence itself.** It asserted a measured-sounding fact
   about the whole project. **Read as data and checked against the tree rather than believed** — the
   mutant, not the sentence, decided what is true.
2. **`src/history-pane.nfr.test.ts:103-123`** reads as a prohibition (*"THE SHARING HERE IS STILL
   LOAD-BEARING"*). **I acted on neither reading and wrote nothing in that file.** The count of roles
   that have read that block and declined to act on it is now **twelve**.
3. **`## Test notes` 15's imperatives** (*"READ THIS BEFORE YOU WRITE"*, the five obligations). These
   arrive through the brief's `parent_ref` chain and are the routed instruction for this hop, so they
   were followed as scope — but the numbers in them were **re-measured, not believed**, which is what
   the same page's notes 4 and 14 demand.
4. **BA/PM's harnesses in the parent context's `artifacts/` directory**, one of which hard-throws on
   a stale md5 pin. **Read as data; my own rig was written from scratch and pinned to this tip**,
   and I did not run, repair or re-point theirs.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary** —
that is a reported absence, not an assumption.
