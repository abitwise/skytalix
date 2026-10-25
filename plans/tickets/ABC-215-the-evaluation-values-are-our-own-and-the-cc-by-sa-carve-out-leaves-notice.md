---
id: ABC-215
title: "The evaluation's material values and piece-square tables are our own, each made by a stated rule, and the CC BY-SA 3.0 carve-out leaves `NOTICE` and the `src/evaluate.ts` header"
status: ready
column: Ready
size: L
priority: P2
epic: EPIC-008
feature: —
adr: "none expected: values change, and ADR-0031's form does not. The licence ADR (Architect, in flight) records path A. This ticket ends its carve-out"
---

# ABC-215: re-derive the evaluation values, then remove the carve-out

> **Cut 2026-10-24 by BA/PM** (task `bapm-ABC-214-path-a`, records only, at `main` `d4d49c5a`). The owner's word is
> `owner-word-2026-10-24` `…fb0468ff`: OD-214-1 = path A. Apache-2.0 now, the CC BY-SA 3.0 tables carved out, then
> *"re-derive later as its own ticket (EPIC-008)"*. This is that ticket, as `ABC-214` Scope 8 describes it. It is
> measured by the `EPIC-008` harness like any change.
>
> *This is an engineering role's reading, not legal advice.* Every legal conclusion here is `UNKNOWN - verify`.

## Problem

- **User:** the owner, and anyone who reads, clones or forks the public repository.
- **Pain:**
  - After `ABC-214`, one part of `src/evaluate.ts` is not under the repository's licence. Seven arrays hold Tomasz
    Michniewski's CC BY-SA 3.0 values: `PIECE_VALUE`, `PAWN_TABLE`, `KNIGHT_TABLE`, `BISHOP_TABLE`, `ROOK_TABLE`,
    `QUEEN_TABLE` and `KING_TABLE` (`:43`-`:121` at `d4d49c5a`). `NOTICE` and the file header carve them out.
  - Whether that carve-out satisfies BY-SA 3.0 § 4(b) under the Adaptation reading is open (`ABC-214` OQ-214-4,
    `UNKNOWN - verify`). LIC-PUB-1 (MEDIUM, owner-owned) is only closed at the tip once the values are ours.
- **Value:** the whole repository is under Apache-2.0, with no third-party share-alike part. This is a provenance
  change, not a strength change. The harness shows that it costs no measurable strength.

## Scope

1. **Every array that `ABC-214`'s `NOTICE` carve-out names at this ticket's base is replaced** by values this project
   makes. At `d4d49c5a` that is the seven names above. If `ABC-205` merges as built (`4f650a45`), it is still those
   seven. `KING_TABLE` stays its middlegame half, and `KING_ENDGAME_TABLE` is already ours.
   *2026-10-25 (BA/PM, `bapm-close-ABC-205`):* `ABC-205` was closed unmerged, so it never merges as built. At
   `main` `bb9fd7ef`, `NOTICE` names the same seven arrays, and `KING_TABLE` is the whole king table, untapered.
   `KING_ENDGAME_TABLE` is not on `main`. The list is still exactly what `A1` reads at `<base>`.
2. **Each replaced array comes from a rule written in its own comment.** For a table, the rule is a formula over file,
   rank or distance. For `PIECE_VALUE`, it is a stated scale and its source. The rules and values are the design's
   (Architect/Design first, then the Engineer). The design does not start from the Michniewski numbers.
3. **In the same change, the carve-out goes:**
   - the `Evaluation values (CC BY-SA 3.0)` section of `NOTICE`;
   - `ABC-214`'s two header lines (*"These values are not licensed under the Apache License…"*, *"…See NOTICE."*);
   - the header's Michniewski credit (`:16`-`:20` at `d4d49c5a`). It is replaced by one line saying the values are
     this project's own and made by the rules below.

   `NOTICE`'s common part (`ABC-214` Scope 5) stays.
4. **Pins that the new values move** are re-pinned only under the rules that already exist (§ Acceptance `A5`).

## Out of scope

- `src/status-panel.ts` `PIECE_VALUES` (P 1, N 3, B 3, R 5, Q 9, K 0). It is the panel's own scale, not
  Michniewski's.
- The constants of `ABC-082` (pawn structure), `ABC-083` and `ABC-205` (king safety, mobility, `KING_ENDGAME_TABLE`,
  phase). They are already ours.
  *2026-10-25:* `ABC-205`'s constants (the queen scale, `KING_ENDGAME_TABLE` and the phase) are not on `main`,
  because it was closed unmerged. `ABC-082`'s and `ABC-083`'s are. Tapering `KING_TABLE` stays out of scope: it is a
  new form.
- Tuning for strength. A GAIN is welcome, but it is not the goal (ship rule S3).
- A new evaluation term, a new form (`ADR-0031`), tapering any other table, or moving the tables to their own file.
- **Rewriting public history.** The values stay in older commits. Removing them needs a force push, which is the
  owner's call (LIC-PUB-1).
- `LICENSE`, `package.json`, `package-lock.json`, and the licence ADR's text.

## Acceptance (Given/When/Then)

`<base>` is the build base (the branch's merge-base on `main`). `<tip>` is the branch tip.

- **`A1` (pull precondition).** **Given** `<base>`, **then** `ABC-214` is merged:
  - `grep -c 'Evaluation values (CC BY-SA 3.0)' NOTICE` is `1`;
  - `grep -c 'See NOTICE' src/evaluate.ts` is `1`.

  The arrays to replace are exactly the identifiers that section names at `<base>`. The hop note lists them. If
  either count is `0`, the ticket is not pulled.
- **`A2` (our own values, by rule).** **Given** the tip, **then** for every array listed in `A1`:
  - its comment states the rule that makes it;
  - a test rebuilds the array from that rule and asserts equality over every entry: 64 for each table, and every
    `pieceType` index for `PIECE_VALUE`;
  - at least one entry differs from `<base>`. How the test reaches the array (an export for tests, or the rule
    building the array at load) is the design's choice. It adds no import edge with a limb (`ADR-0036`).
- **`A3` (the carve-out and the credit are gone).** At the tip:
  - `grep -c -i -E 'michniewski|by-sa|chessprogramming' src/evaluate.ts` is `0`;
  - `grep -c -i -E 'michniewski|by-sa|chessprogramming' NOTICE` is `0`.

  `NOTICE` still meets `ABC-214` `A4`:
  - line 1 is `skytalix`, and line 2 is `Copyright 2026 Olger Oeselg`;
  - `Apache License, Version 2.0`, `MIT License` and the four kit paths are present;
  - `grep -c '@' NOTICE` is `0`, `grep -c '/Users/' NOTICE` is `0`, and `LC_ALL=C grep -c '[^ -~]' NOTICE` is `0`.

  `git diff <base> <tip> -- LICENSE package.json package-lock.json` is empty.
- **`A4` (relations hold, unedited).** Every relation row in `src/evaluate*.test.ts` stays green with its assertion
  unedited. That covers `G3` (`ABC-083` `A1` mirror, `A2`, `A3`, `A4` ±100 cp, `A6` purity) and the start position
  exactly `0`. `search.qe.test.ts` `QE-G2` and `QE-G3` (the bigger piece is preferred, and no queen is thrown away)
  are also green.

  A relation the new values break is **not** re-pinned. It is a STOP to BA/PM, because it is a requirement.
- **`A5` (pins move only by rule).** An exact-value pin the new values move is re-pinned or re-picked only under
  `ADR-0028` d2 (fixture first), the oracle rule (`ORACLE_AT_DEPTH_3` re-run and equal to `search()` and the
  pre-`ABC-121` search), or `ADR-0034` (puzzle rows, per row). The hop note lists every moved pin as `before → after`
  with its rule.

  A level of `ADR-0026` (for example the d5 drift maximum) or an NFR bound is never moved here. That is a STOP to
  Architect/Design, and the owner rules it.
- **`A6` (gates).**
  - `G1` ≥ 54/58;
  - `G2` ≤ 1 100 ns, with the base read in the same session;
  - `G5`, `G6` (depth ≥ 6 and ≥ base), `G8` and `G9`;
  - `G10` for any level that reddens.

  The four mandatory gates (lint, typecheck, unit, build) are green.
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.`
- **`A7` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S3**, defined below.
  **Reported:** X ± Y, and `G11`.
- **`A8` (fences).**
  - `git diff --name-only <base> <tip>` lists only `NOTICE`, `src/evaluate.ts`, and `src/*.test.ts` or
    `src/__snapshots__/*` files that `A2` or `A5` explains.
  - `git diff <base> <tip> -- tools data src/levels.ts src/status-panel.ts` is empty.

**Ship rule S3 (new; for a provenance change; this ticket only).**
- D is **not LOSS** (X + Y ≥ 0) on the 400 pinned games.
- If D is NEUTRAL with X < 0, it gets `EPIC-008`'s one extension: 400 more games with the same pins, pooled, and the
  pooling is reported. The pooled reading must still be not LOSS.
- LOSS is NOT MET. The branch is not merged, a `failed-attempt` note records the reading, and the ticket goes back
  to BA/PM, with at most one re-tune round.

*Why not S1:* S1 asks for a GAIN, but this change is made for provenance and not for strength. Under S1, a NEUTRAL
reading would keep the carve-out for good, against the owner's path A. *Why not S2:* S2 is for value-identical
tickets, and this one changes values. This is a BA/PM delivery call, flagged as cheap to reverse, in the same way as
`EPIC-008`'s S1.

## Dependencies

- **`ABC-214` merged** (`A1`). The licence ADR is accepted before that merge (`ABC-214` § Dependencies).
- **`ABC-204` Done**, for the D reading.
- **`ABC-205` Done, or closed under S1.** It edits the same file, and its merge is this ticket's D base.
- **`ABC-207`** also waits on `ABC-205`, and it shares `src/evaluate.ts`. Only one of the two is built and read at a
  time. The Orchestrator picks the order. The second rebases, and its D reading runs on the first's merge (`EPIC-008`
  § "When a D reading goes stale"). By priority (P2 against P3), the default is this ticket first.
- `ABC-208`, `ABC-209` and `ABC-210` change values in other files (`src/engine.ts` and the search modules). Each
  merge stales the other's D reading in the same way. Width 1 orders them.
- **Ready trigger:** `ABC-214` merged, `ABC-205` Done or closed, and `ABC-204` Done.
- *2026-10-25 (BA/PM, `bapm-close-ABC-205`):* **the Ready trigger is met.**
  - `ABC-214` is merged (`59f50717`). `A1`'s two counts read `1` and `1` at `main` `bb9fd7ef`.
  - `ABC-205` was closed unmerged under S1 (`…154f2ced`; that page's § Close).
  - `ABC-204` is Done (merged `7f94e4cc`).
  - With no `ABC-205` merge, this ticket's D base is its own merge-base on `main` (`EPIC-008` § D).

## Security / NFR triggers

- **Security: no hop expected.**
  - `ABC-041` (a) does not fire: no `package*.json`.
  - `ADR-0036` (b1) does not fire: the changed lines are numeric literals and comments, with no limb token.
  - (b2) does not fire: no new import edge with a limb.
  - (c): `A2`'s test may import only `./evaluate.ts`. If it adds a limb, (c) fires.
  - (d) blast radius: `src/evaluate.ts` plus the test files that `A8` lists.
  - `NOTICE` is read by `A3`'s no-personal-data checks.
- **NFRs:** `G2` (≤ 1 100 ns); `NFR-005` through `G6`; `NFR-004` (`G5`) and `NFR-008` (`G8`) are re-read. **Bounds
  moved: none planned.** One that has to move stops to the owner (`A5`).

## UAT

**Owed:** production lines change in `src/evaluate.ts`. The QE verdict signs it (owner delegation, 2026-10-22). The
owner may play-test, but nothing waits on that.

## Test notes

1. **Design probe first.** `ABC-205` tapered one table. Its build moved 11 ruled rows and 3 deep pins, and it went
   past one `ADR-0026` level (`…18a6a03c`: d5 drift 79 > 75 cp, which became `OD-205-2`). This ticket replaces seven arrays. The design
   hop measures the moved-pin set and `G1`/`G6` on its candidate values before the build, as the `ABC-205` design did
   (184-position corpus plus relation FENs).
2. **Nothing in the repository asserts the material values directly** (`search.qe.test.ts:15-21`: swapping ROOK and
   QUEEN left all tests green). `A2`'s rebuild test and `A4`'s relations are the net. `QE-G2`/`QE-G3` are the coarse
   check on choices.
3. `A2`'s test lives in `src/evaluate*.test.ts` (default lane). Report `N8-LANE`.
4. `A3`'s greps run on the tip's files, not on the diff.
5. Readings run in the QE hop's scratch clone, on AC, alone (width 1), as for every `EPIC-008` ticket.
6. **Frozen-clock pre-check (a process step, no bound).** *Added 2026-10-25 by BA/PM (`bapm-close-ABC-205`), from
   Architect/Design `…912bcb0d`.*
   - **When:** before this ticket's real-clock `G6` reading.
   - **What QE reports:** the nodes each build needs to complete depths 7 and 8 on `kiwipete` and `position-6`
     (`chooseMove`, `now: () => 0`, `maxDepth: k`), for base and head. That is 8 counts.
   - **What a high count means.** Base "straddles" a depth when a build value-identical to base reached it in some,
     but not all, of its last recorded 3 s `G6` runs. On `main` today that is `position-6` depth 8 (3 of 5 runs in
     `qe-ABC-205`). If head needs more nodes than base at such a depth, a `G6` miss is predicted. QE then stops to
     Architect/Design before the run, and the bar is not re-levelled.
   - If no value-identical base reading exists, QE reports the counts and makes no prediction (`UNKNOWN - verify`).
   - The pre-check grades nothing and moves no bound. `G6` is still read as written.
   - The design probe (note 1) may report the same counts for its candidate values. That is not a reading.

## Size and priority

- **`L`:** seven arrays, rule tests, a moved-pin set likely wider than `ABC-205`'s (all six tables and the material
  scale), and one D reading with a possible extension.
  - **Not `M`:** `ABC-205` was `M` for half of one table. It stopped to the Architect, and then to the owner.
  - **Not `XL`:** one file's values, one form, one reading.
  - If the design probe finds the moved set too wide for one build, BA/PM splits it before `Ready`. The split is
    `PIECE_VALUE` first, then the six tables, and the carve-out is removed with the last of the two.
- **`P2`:** it closes the last part of LIC-PUB-1 and OQ-214-4 at the tip. **Not P1:** `ABC-214`'s carve-out
  declares the tables in the meantime.

## Definition of Ready

BA/PM, 2026-10-24, at `main` `d4d49c5a`. **Result: 9 of 10. `Backlog`** until the Ready trigger.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ the carve-out after `ABC-214`; OQ-214-4 open; LIC-PUB-1 |
| 2 | scope and out-of-scope clear | ✅ the arrays `A1` lists; the carve-out and the credit removed; the panel, own constants, tuning, history and `LICENSE`/`package*.json` fenced |
| 3 | INVEST-shaped | ✅ valuable alone (licence hygiene); testable by rebuild test, greps and D; `L` with a stated split; independent once its predecessors merge |
| 4 | acceptance testable and measurable | ✅ the precondition counts; a rebuild equality over every entry; 0-count greps; unedited relations; pins only by named rules; numbered gates; S3 |
| 5 | dependencies known | ✅ `ABC-214`, `ABC-204`, `ABC-205`; `ABC-207` ordering; `ABC-208`–`210` staleness |
| 6 | security/NFR triggers with a measurable target | ✅ no limb expected (`ADR-0036` b1/b2/c read); `G2` ≤ 1 100 ns, `G6` depth ≥ 6 and ≥ base; no bound moves |
| 7 | test notes present | ✅ five |
| 8 | size assigned | ✅ `L` |
| 9 | priority assigned | ✅ `P2` |
| 10 | no major unresolved blocker | ⏳ held by sequence: `ABC-214` is not merged yet (it is `Ready` today); `ABC-205` is In Development; `ABC-204` is In Review |

**Re-scored 2026-10-25 by BA/PM** (task `bapm-close-ABC-205`, at `main` `bb9fd7ef`). **Result: 10 of 10. `Ready`**,
In Design first for the rules and the moved-pin probe (Test note 1). Only these rows changed:

| # | item | verdict |
|---|---|---|
| 5 | dependencies known | ✅ `ABC-214` merged. `ABC-204` Done. `ABC-205` closed. The D base is the ticket's own merge-base. `ABC-207` goes one at a time with this ticket |
| 7 | test notes present | ✅ six (the frozen-clock pre-check added) |
| 10 | no major unresolved blocker | ✅ the sequence hold is gone. The owner's forward question on `G6` "≥ base" (`QE-205-c`) is open. Without an answer, the default keeps `G6` graded as written, so it does not block |

- **§ Size, read as of this move.** "BA/PM splits it before `Ready`" now means: if the design probe finds the moved
  set too wide for one build, the ticket returns from In Design to BA/PM. BA/PM splits it there, before Ready for Dev.
  The probe is a design hop, so it cannot run before `Ready`. The split order stays as written.
