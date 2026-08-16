---
id: 20260816T095000Z-uat-planner-decision-the-uat-result-for-abc065-and-what-is-not-signed-a4e90c26
kind: decision
by: uat-planner
at: 2026-08-16T09:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - plans/board.md
  - plans/traceability.md
  - AGENTS.md
  - src/cli.test.ts
supersedes: 
---

# `ABC-065` — the UAT result, and the signature that does NOT exist

## Read this paragraph before any other in this note

**Nobody has accepted `ABC-065`.** What follows is an **agent-conducted UAT**: the business scenarios
were executed against the real tree on `main` and the measurements are reported. It is recorded as a
`decision` note and carries **no verification stamp**, because none can exist here —
`context.human_admission` is `off` and no `finding` is admissible on this install. **"UAT passed"
below means "every scenario in the pack was run and none failed." It does NOT mean a named human has
seen this, agreed with it, or accepted the work,** and it must never be quoted as if it did. The
`In UAT` exit signature is the owner's to give or to redefine (`AGENTS.md` § Test and UAT authority),
and this hop deliberately did not resolve it by inference.

## The result

**10 business scenarios conducted, 10 PASS, 0 FAIL, 0 unrun, 0 blocked.** Conducted on `main` @
`722bd9d`, node `v24.12.0`, npm `11.7.0`. Every figure is in this task's `observation` notes and is
not restated here.

| # | the reader's question | result |
|---|---|---|
| `S1` | Does the page show me how to pass an option? | **PASS** — `npm run chess -- ` 0 → **1** occurrence, inside the slot's scored span |
| `S2` | Does the shown command run? | **PASS** — exit `0`, 23 board rows, empty stderr, flag reached the program |
| `S3` | Does every listed option work as shown? | **PASS — 5 of 5**, each with a visible effect under a real terminal (corrected from a piped-capture artifact; see the correction note) |
| `S4` | Does the page hide an option from me? | **PASS** — documented set **equals** the accepted set, both directions, 3 of 3, value words present |
| `S5` | Is the page's warning about omitting `--` true? | **PASS** — reproduces clause for clause: exit `0`, `node src/cli.ts` with no arguments, `Unknown cli config` on stderr, default board |
| `S6` | Does the plain command still work? | **PASS** — exit `0`, **23 rows**, empty stderr |
| `S7` | Will anyone notice if the page goes stale? | **PASS** — 4 of 4 plausible editor mistakes RED, each naming the offending token |
| `S8` | Will anyone notice if the program drifts from the page? | **PASS** — `--depth` accepted and undocumented REDs on **3 independent rows** |
| `S9` | Did anything else break? | **PASS** — 859/859 on 30 files, lint 0, typecheck 0, skip 0 |
| `S10` | Was anything already accepted disturbed? | **PASS** — `ABC-042`'s `A1` block byte-identical at 4 commits; 2 paths, 0 production lines, `spawned` 10 |

**Against the ticket's own criteria:** every scenario that maps to `A1`, `A3`, `A4`, `A2` and `A6`
passed at the place a human meets it. `A5` was **not** independently re-measured here — it is a
code-hygiene property with no user-visible surface and QE measured it; **said plainly rather than
folded into a tick.**

## The decision this note actually makes

**Decision: the UAT pack is discharged and I am NOT moving the ticket.**

The pack (scenarios, test data, entry/exit criteria, roles, known limitations, rollback, signoff
checklist) exists and is published; it was conducted; the result is above. `agent-factory/checklists/
uat-checklist.md` is worked through, nine items, all satisfied — with the standing note that its
*"signoff person/role known"* item is satisfied by **naming** the role, not by obtaining the signature.

**`plans/board.md` stays at `In UAT`. `plans/traceability.md` is not written by me.** Two reasons and
both bind independently: the Orchestrator's instruction (a second UAT hop runs concurrently on
`ABC-066` and these files are the Orchestrator's this round), and the role's own hard limit — the
`In UAT` exit belongs to a signature that does not exist yet.

## What the owner must sign, stated as a short list

The full checklist is in this task's `artifact-ref` pack note (`C1`–`C8`). Condensed, the owner is
being asked for **two judgements and one ruling**:

1. **Judgement — the product half.** Open `AGENTS.md` § Commands, paste the command it shows, run the
   options. Everything an agent could measure says this works; **the acceptance is that it works *for
   him*.** (`C1`–`C4`)
2. **Judgement — the limitations.** Eight are listed before signature, and two deserve his eyes:
   **(a)** `npm run chess --ascii` without the separator is *still* silently discarded — this ticket
   fixed the page, not the package runner, and the mitigation is a sentence in a document; **(b)** the
   guard that keeps the page honest has three known weaknesses, all ticketed (`ABC-067`, `ABC-069`,
   `ABC-071`), none of which changes what a reader meets today. (`C5`, `C6`)
3. **Ruling — `U1`, and this is the one that outlives the ticket.** **This project has no mechanism by
   which a named human's UAT acceptance can be recorded**: the kit requires a named human's signoff at
   the `In UAT` exit, `AGENTS.md` leaves the question explicitly open, and the admission channel that
   would carry a `human:<name>` stamp is absent on this install. `ABC-065` and `ABC-066` are the first
   two tickets ever to reach this door — everything before them deferred UAT because nothing was
   runnable. **The owner is asked to say what the `In UAT` exit signature IS here** — his word in
   session, a file he writes himself, or a redefinition of the exit — **and until he does, every
   ticket from now on stops in the same place.** (`C8`)

**A UAT report is not a substitute for any of the three, and this note is not a proxy for the third.**

## Trace delta — for the Orchestrator to append, NOT written by me

`plans/traceability.md`'s `ABC-065` row has an **empty UAT cell**. The delta to append, in the
Orchestrator's own words and formatting:

> **UAT CONDUCTED 2026-08-16, NOT SIGNED — task `uat-ABC-065-2026-08-16`, Workflow 06, agent-conducted
> under the owner's 2026-08-15 standing grant of UAT CONDUCT.** Pack published as typed notes
> (10 business scenarios, test data read from `ACCEPTED_ARGUMENTS` rather than transcribed, entry
> criteria `E1`–`E5`, 8 known limitations, rollback = revert `460b9f5`/`39122ec`+`c5a5493` at zero
> production lines, signoff checklist `C1`–`C8` naming the **PROJECT OWNER** as the accepting role).
> **10 of 10 PASS on `main` @ `722bd9d`**: `npm run chess -- ` 1 occurrence (0 at the cut); the
> documented invocation runs exit `0`, 23 board rows, empty stderr, flag echoed through to
> `node src/cli.ts`; **5 of 5 documented option forms exit 0 with a visible effect under a real pty**;
> documented set **equals** `ACCEPTED_ARGUMENTS`' options both ways, 3 of 3; the slot's no-separator
> warning reproduces clause for clause (exit 0, no arguments, `Unknown cli config` on stderr, default
> board); suite 859/859 on 30 files, lint 0, typecheck 0, skip 0. **Guard re-falsified by a fourth
> hand in an isolated linked worktree: 6 mutants, 5 RED** — documented-but-nonexistent option,
> option deleted from the slot, **the separator example tidied away**, a documented invocation that
> would be refused (`--colour purple`), and **`--depth` accepted-but-undocumented RED on 3 independent
> rows** — every failure naming the offending token; the 6th (`Q8`, unterminated comment) **GREEN
> 32/32, independently reconfirming `ABC-067`, whose board row's "after `ABC-065`'s UAT" condition is
> now DISCHARGED**. `A2` independently re-verified **by content, not by line range**: `ABC-042`'s `A1`
> block hashes `240d0c66b450` at `dbaf972`, `c5a5493`, `460b9f5` and `HEAD` — byte-identical, a
> different fence and a different hash function than QE's, agreeing. `A6` substance re-measured: 2
> non-`.grugops` paths (`AGENTS.md` `6 1`, `src/cli.test.ts` `85 0` pure append), **0 production
> lines**, `CHILDREN` = **10** keys counted by hand. `A5` NOT re-measured here (no user-visible
> surface; QE's figure stands) — stated, not ticked. **3 new gaps at UAT — 0 HIGH, 1 MEDIUM, 2 LOW,
> none an acceptance-criterion failure: `U1` (MEDIUM) THE PROJECT HAS NO MECHANISM TO RECORD A NAMED
> HUMAN'S UAT ACCEPTANCE — `human_admission` off, no `finding` admissible, the sanctioned writer
> absent, and the kit makes the `In UAT` exit a human's; the exit is unreachable BY CONSTRUCTION and
> this recurs on every ticket from here — escalated to the owner, NOT ticketed (install-level per
> `AGENTS.md`); `U2` (LOW) the slot's "23 rows" is the PROGRAM's count while `npm run chess` prints 27
> with npm's banner — true of both halves, joined to the wrong subject, fold into `ABC-070` if that
> page is ever opened, NO new ticket recommended; `U3` (LOW) a piped UAT capture makes
> `selectGlyphMode`'s `!isTTY → ascii` row fire and `--ascii` look like a no-op — corrected under a
> pty, recorded as standing practice for any future rendering UAT.** `Q7`/`Q9`/`G12` re-confirmed
> unrepaired and correctly ticketed (`ABC-071`/`ABC-069`/`ABC-070`); `G5` did not bite — all six
> mutations ran in a linked worktree, shared tree never mutated, `git status --porcelain` unchanged.
> **NOT SIGNED AND NOT MOVED: the board stays `In UAT`. `AGENTS.md` § Test and UAT authority grants an
> agent the CONDUCT of UAT and states the owner did not say an agent's report is the acceptance
> signature. No `human:<name>` stamp exists or was invented; this result carries none. `Ready to
> Release` requires `C8` — the owner's acceptance, or his ruling on what this project's `In UAT` exit
> signature is.**

## What I did NOT do, stated so it is not read as done

- **I did not sign, and I did not build anything that could be mistaken for a signature.** No
  `finding`, no `verified_by`, no stamp, no signoff file with a name in it.
- **I did not move `ABC-065`** to `Ready to Release` or `Done`, and I did not touch `plans/board.md` or
  `plans/traceability.md` — a second UAT hop runs concurrently and those files are the Orchestrator's.
- **I changed no product code, no test, no ticket page and no criterion.** Six mutants built, six
  reverted, all in a linked worktree; the shared tree's `AGENTS.md` and `src/` are as I found them.
- **I wrote nothing under `agent-factory/`** — read-only kit.
- **I did not commit on `main`.** Nothing of mine is staged; if these notes are to be committed it is
  on `grugops/uat-ABC-065-2026-08-16`.
- **I repaired none of the four carried gaps**, including `Q8`, which I reproduced with my own hands —
  it is `ABC-067`, another pen, and its own page says so.
- **I did not spawn a subagent** and did not relay anything agent-to-agent; everything is on disk.
- **I did not cut a ticket for `U2`** and said why, rather than adding a page nobody needs.
