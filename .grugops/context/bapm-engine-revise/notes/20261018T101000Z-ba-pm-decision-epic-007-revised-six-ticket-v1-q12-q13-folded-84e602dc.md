---
id: 20261018T101000Z-ba-pm-decision-epic-007-revised-six-ticket-v1-q12-q13-folded-84e602dc
kind: decision
by: ba-pm
task: bapm-engine-revise
at: 2026-10-18T10:10:00Z
verified_by:
confidence: medium
refs:
  - EPIC-007
  - EPIC-004
  - ADR-0044
  - ADR-0036
  - ADR-0018
  - ABC-078
  - ABC-041
  - NFR-004
  - NFR-005
  - NFR-008
  - ABC-167
  - ABC-168
  - ABC-169
  - ABC-170
  - ABC-171
  - ABC-172
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
  - plans/epics/EPIC-004-engine-and-ai-opponent.md
  - .grugops/context/wave-2026-09-25/notes/20261018T093000Z-orchestrator-decision-owner-word-engine-q1-q11-answered-a41c7e02.md
  - .grugops/context/wave-2026-09-25/notes/20261018T103000Z-orchestrator-decision-owner-word-engine-q12-agpl-q13-rename-6b2d90f1.md
  - .grugops/context/arch-engine-revise/notes/20261018T095000Z-architect-design-decision-adr-0044-revised-book-levels-go-limits-skytalix-artifact-gpl-e4a7c912.md
supersedes: 20261018T075600Z-ba-pm-decision-epic-007-proposed-two-ticket-uci-v1-9d3b5f61
---

# EPIC-007 REVISED, STILL PROPOSED: v1 is six tickets (three XS, three S), Q1-Q13 answered, Q12(a)/(c) pending `arch-licence-eval`, one new Q14

This note is hand-authored and unsealed (`scripts/context-io.ts` is absent on this install, so no `finding` was
attempted). The epic page and the six ticket pages are authoritative. This note gives only the choices and why.
It supersedes `…9d3b5f61` (the first version's two-ticket plan). The readings note `…a41c7e02` of `bapm-engine-plan`
still stands, except where noted below.

## Decisions

- **Epic size `S` → `M`.** The owner's Q4-Q9 answers add the book, the levels, the `go` limits, a built artifact and a
  licence. The epic stays one epic. No ticket is larger than `S`.
- **The cut (each XS or S; one INVEST slice each):**
  - `ABC-170` XS: `maxDepth` / `maxNodes` on `EngineOptions`. Own ticket, on the Architect's suggestion, because it is
    a pinned core edit with an `A4` amendment and an identity-sweep rerun.
  - `ABC-167` S: the capability-free session with the D4 time rule and D12 mapping, level 3 fixed, book off.
    Depends on `ABC-170`.
  - `ABC-171` S (new id): `OwnBook` + `Skill Level`. Split from `ABC-167` because together they would be `M`.
  - `ABC-168` S (was XS): entry point, `tsconfig.build.json`, `npm run build` → `dist/uci.js`, `bin skytalix`, the
    opt-in real-child lane, and M1/M2/M8(a)/M9 at UAT. The only ticket with an `ADR-0036` (b1) capability.
  - `ABC-169` XS: AGPL-3.0 licence, pending `arch-licence-eval`.
  - `ABC-172` XS, P2 (new id): rename package and lock to `skytalix`. In-repo names only.
  - I refused: a separate build ticket (it would emit a file no other ticket uses), a separate GUI play-test ticket
    (that is `ABC-168`'s UAT), and splitting book and level into two tickets (they share the `setoption` parser).
- **Measures M1-M5 revised, M6-M11 added.** M6 book on/off observable; M7 `Skill Level` 1/3/5 budgets 100/3 000/3 500
  ms on the virtual clock; M8 a cutechess `depth=4` run plus `depth`/`nodes`/`mate` rows (`mate 2` on the corpus's
  smothered mate); M9 the artifact builds and runs from a fresh clone; M10 licence declared; M11 rename.
- **EPIC-004 edited:** the UCI half of the second Out-of-scope bullet is lifted, citing `…a41c7e02`. The old sentence
  is kept as dated history. "Driving an external engine" stays a permanent non-goal.
- **Owner word `…6b2d90f1`, which arrived mid-hop (relayed by the Orchestrator):** Q12 = AGPL-3.0 "if possible"; kit
  files MIT (Q12(b) answered: excluded from `LICENSE`); Q12(a) tables and Q12(c) `-only`/`-or-later` **pending
  `arch-licence-eval`**, which I did not evaluate. Q13 = rename yes → `ABC-172`.
- **New owner question, Q14:** keep `npm run chess` as the script name? Recommended: keep it. Renaming edits
  `src/cli.ts:93`, its pins, `AGENTS.md`'s guarded Dev/run slot and `ADR-0018`, for no gain.

## Facts read at this hop (main `a10e09c2`, read only)

- **`A4` is two checks, not one.** `ADR-0044` D12 says `maxDepth` trips one `A4` check (`src/engine.test.ts:515`).
  A second check, `:520`, pins `for (let iteration = 2; now() < budget.deadline; iteration++)` verbatim, and D12
  puts both new conditions in that header. `ABC-170` `A4` names both. For the Architect: a dated line in `ADR-0044`.
- **`ABC-169` fires `ABC-041` clause (a)** (`package.json` "touched at all"). The first version said "No Security/NFR
  hop". Corrected. `ABC-168` and `ABC-172` fire (a) too.
- **No string under `src/` names the product.** `cli-chess` lives only in `package.json:2` and `package-lock.json:2,8`
  among live files (`git grep`). `ADR-0044` D8/D13 and `ADR-0018` mention it; they are the Architect's records.
- **No kit file carries an MIT notice** (`grep -l MIT tools/grugops/*` hits only words like `LIMIT`). The kit's
  copyright line is `UNKNOWN - verify`, so `ABC-169` adds no MIT text, only an exclusion sentence.
- `AGENTS.md` is 24 576 B, exactly its budget (`wc -c`), which binds `ABC-168`'s Scribe lines.
- No `LICENSE*` file exists. `git remote -v` is empty. `.grugops/install.json:6` holds the old absolute path.
- `ADR-0044` D8 and D13 are one owner answer behind (GPL-3.0, "package stays `cli-chess`"). Not edited:
  `memory-bank/50-decisions` is fenced at this hop.

## Not done at this hop

- No test, vitest, build or timing run. The only commands were reads (`grep`, `git grep`, `wc`, `ls`, `sed`).
- 0 lines in `src/`, `tools/`, `package.json`, `package-lock.json`, `vitest.config.ts`, `memory-bank/50-decisions`.
- `plans/board.md` and `plans/traceability.md` not edited (the rows are in the hand-off).
- No ticket to `Ready`: every page scores 9/10 (`ABC-169` 8/10), with "the owner has not accepted" as the open item.
- Nothing merged or pushed.
