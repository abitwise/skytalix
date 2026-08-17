---
id: ABC-063
title: UAT-16 — the pack's most load-bearing scenario — names six commands, and not one of them appears in any test
status: done
column: Done
size: XS
priority: P2
epic: —
feature: —
---

# ABC-063 — "there is no way to make a move": six words, backed by a class argument and nothing by name

> **Cut 2026-08-15 by BA/PM** (task `uat-ABC-042-followups-2026-08-15`, subtask `uat-ABC-042-cut`,
> Workflow 03) out of QE/E2E's `R5` (`.grugops/context/uat-ABC-042-qe/notes/`). **`ABC-042` is
> merged, `Done`, and both gates passed against it: its page is NOT edited and no criterion of its is
> re-opened.**

> **Line anchors corrected 2026-08-17 by the Software Engineer at `ABC-063`, in a SECOND commit** so
> the delivery commit stays the one path `A4` measures. **Every `:NNN` below was measured against
> `main` @ `2ad1dff`** (`src/cli.test.ts` byte-identical to `39d3c5b`; the delivery appends at the
> end of the file and moves none of them). Seven corrected: `:353`→`:435`, `:372`→`:525`,
> `:477`→`:630`, `:780`→`:933`, `:247`→`:329`, and — the one the Orchestrator recorded UNRESOLVED
> rather than guess — **`:401`→`:554`**. `:401` was resolved by *reading it*, not from memory: the
> page was cut against `56c5cea`, the one revision of this file where `:353`, `:372`, `:477` and
> `:780` all hold simultaneously, and `56c5cea:401` is `A6(i) — the near-miss family, COMPLETE OVER
> POSITION, is rejected in its legal position`, which is `:554` today. **No substance changed; only
> pointers.**

## Problem

*User*: the project owner, at the moment he is asked to sign the `ABC-042` UAT pack — and every agent
afterwards who reads "it does not play a game" and needs it to still be true.

*Pain*: **UAT-16 is the scenario the pack itself calls its most important, and it has the least
by-name backing of the seventeen.** It turns the limitation *"it does not play a game"* into six
commands a signer types and watches fail — `--move e4`, `e4`, `--new`, `--undo`, `--resign`,
`--quit`. **None of the six is written in any test file, and none is spawned.**

What does back it is a class argument, and it is a good one: `:630` generates 1000 tokens, 250 per
shape, and every one is rejected; `:435` pins `ACCEPTED_ARGUMENTS` element-for-element against the
scope table; `:525` bars any argv literal outside the enumeration. Together they make a quietly
recognised fifth flag red. **But a class argument is silent on names**, and these six names are the
ones a human will type, the ones `EPIC-006` will eventually make legal, and the ones the pack's
strongest section stands on.

*Value*: **the day one of the six becomes legal, it must be a decision and not a side effect.** A
deterministic case list makes that day red on purpose, in a row that names the scenario it protects.

## Scope

- **One new `it` block in `src/cli.test.ts`**, a deterministic case list of the **six argvs UAT-16
  names**, each asserted rejected at the resolver with the offending token named.
- **A comment naming UAT-16** and the pack folder, so the next hop finds the scenario this row
  serves before deciding to change it.

## Out of scope

- **Spawning any of the six.** Zero new children; the count is pinned at **10** (`:933`) and an
  eleventh is a defect. The resolver is the exclusive validator (`ABC-042`'s `A9`), so a rejected
  argv cannot reach a frame by any other route.
- **`:435`, `:525`, `:554` and `:630` — byte-identical.** This ticket adds names beside the class
  argument; it does not replace or weaken it.
- **Deciding whether any of the six should become legal.** `ABC-043`–`ABC-046` own the session
  commands. This row asserts today's truth and is designed to red when that truth changes.
- **`--help`.** It is UAT-10 row g, a different scenario, and its disposition is recorded as a
  rejected follow-up in `.grugops/context/uat-ABC-042-cut/notes/` — not folded in here.
- **Any production line.** Zero.

## Acceptance (Given/When/Then)

- **`A1` (all six, by name).** **Given** the six argvs `["--move","e4"]`, `["e4"]`, `["--new"]`,
  `["--undo"]`, `["--resign"]`, `["--quit"]`, **when** each is resolved, **then** `.ok` is `false`
  and `.offending` names the first offending token of that command line — `--move`, `e4`, `--new`,
  `--undo`, `--resign`, `--quit` respectively. **6 of 6.** *(Today: **0 of 6** appear in any test
  file — measured by grep across `src/`.)*
- **`A2` (the list is closed and tied to the scenario).** **Given** the block, **then** the case list
  has **exactly six** entries and the comment above it names **UAT-16**, so a hop making one of them
  legal cannot mistake the row for a generic corpus.
- **`A3` (it reds on purpose when the vocabulary grows).** **Given** any of the six added to
  `ACCEPTED_ARGUMENTS`, **then** the suite is **RED** — here **and** at `:435`. *(This is a
  deliberate future red, not a maintenance cost: `EPIC-006` must move both rows in the same hop that
  makes a verb legal.)*
- **`A4` (nothing else moved).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path**, **zero production lines**, **zero new
  child processes** (`spawned` still `10`). Suite green, skip **0**.

## Dependencies

- **None open.** `ABC-042` is merged at `dbaf972`; the resolver and its test file exist on `main`.
- **Same-file neighbours, not blockers:** `ABC-058`, `ABC-059`, `ABC-061`, `ABC-062`, `ABC-064`. No
  shared assertion; any order works.
- **`EPIC-006` is the consumer of `A3`'s deliberate red** — `ABC-043` (session), `ABC-045`
  (`resign`), `ABC-046` (`quit` + `new`) each make one or more of these six legal. **This ticket does
  not block them and they do not block it**; it makes their scope change visible.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes.** Six pure resolver calls, against a file that already makes 1000 at `:329`
  and 1000 at `:630`. **`N8-LANE` is `MET` at 0.23× (152.5 ms of 650 ms); this ticket must not move
  it.**
- **`NFR-002` not triggered.** No frame path.
- **Security: not triggered.** `ABC-041`'s four clauses: no manifest touch, no non-`.test.ts` file
  under `src/`, no network, no write, no new spawn, blast radius one path. **The six tokens are
  literals in a test file, not user input.**

## Test notes

1. **Name the offending token per case, not just `ok === false`.** `["--move","e4"]` must blame
   `--move`, not `e4` — the resolver returns on the first unrecognised token, and asserting only
   `ok` would let a build that blamed the wrong word pass. That is the same `.ok`-only weakness
   `ABC-061` repairs on the accepting side.
2. **Keep this list separate from `ABC-062`'s two argvs.** Different scenarios (UAT-16 vs UAT-10),
   different reasons to change; merged into one row, a future hop cannot tell which half it may
   touch.
3. **Do not derive the six from anything.** They are a scenario's literal words and their value is
   that they are written down; a derivation would go stale silently, which is the defect `ABC-059`
   was cut for one level up.

## Lane cost — how many test FILES this ticket implies

**Zero.** One block in an existing file; no child process.

## Size and priority rationale

**Size `XS` (1).** One block, six pure calls, one comment. The thinking is done — the six words are
written in the pack and in QE's map.

**Priority `P2`.** No mutant, no live defect, and the class argument means a regression toward
accepting one of the six already reds at `:435`. What is unprotected is narrower: a build that
refused one of them **with the wrong token named**, and the signer's ability to see the scenario's
own words in the suite. **Promote to `P1` the moment `ABC-043` or `ABC-045`/`ABC-046` is pulled** —
that is when the six stop being permanently-refused words and start being a vocabulary in motion.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-15**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the pack's most load-bearing scenario, six named commands, **0 of 6** in any test, and exactly what the class argument does and does not cover |
| 2 | scope and out-of-scope clear | **✅** one block; five fences, including "no spawn", "`--help` is not folded in" and "this decides no session command" |
| 3 | INVEST-shaped | **✅** independent, one hop, testable by grep and by the enumeration mutant |
| 4 | acceptance testable and measurable | **✅** **6 of 6** rejected with the right token named (today **0 of 6** present), list length **exactly 6**, `A3`'s deliberate RED, **1** path, `spawned` **10** |
| 5 | dependencies known | **✅** none open; five same-file neighbours and three `EPIC-006` consumers named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with **0** new files and **0** spawns against 152.5 ms; `NFR-002` untriggered; four security clauses answered |
| 7 | test notes present | **✅** three, including "name the token, not just `ok`" and "do not derive the six" |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, with a named promotion trigger |
| 10 | no major unresolved blocker | **✅** none |
