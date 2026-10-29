---
id: ABC-215
title: "The evaluation's material values and piece-square tables are our own, each made by a stated rule, and the CC BY-SA 3.0 carve-out leaves `NOTICE` and the `src/evaluate.ts` header"
status: done
column: Done
size: L
priority: P2
epic: EPIC-008
feature: —
adr: "none expected: values change, and ADR-0031's form does not. The licence ADR (Architect, in flight) records path A. This ticket ends its carve-out"
---

# ABC-215: re-derive the evaluation values, then remove the carve-out

> **DONE 2026-10-25, merged to `main` as `5c91e2e4`.** BA/PM, task `bapm-epic008-g6-rule`. QE PASS at `7d4cea3e`
> (`…c2c3540f`), which signs UAT; D NEUTRAL +15.6 ± 23.8, S3 met. The Orchestrator accepted and merged (`…ccf209d9`).
> See § Reading.
>
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
   *2026-10-25 (BA/PM, `bapm-amend-ABC-215`):* the same change also corrects `README.md`'s licence sentence, which
   names the CC BY-SA 3.0 values. Only that sentence changes (`A8`, as amended, and `A8a`).
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

  > **Amended 2026-10-25 by BA/PM** (task `bapm-amend-ABC-215`, records only, at `main` `da480b78`). The text
  > above is the old text, kept. It is superseded by the two bullets below, which add `README.md` and nothing else.
  > The source is Architect/Design `arch-design-ABC-215` `…e04234f4` (§ Design ruling, § Fences).
  > - **Why.** `README.md:84-86` (from `ABC-216`) says `NOTICE` lists "the evaluation values in
  >   `src/evaluate.ts` (CC BY-SA 3.0)". Once Scope 3 lands, that is false. The old `A8` fenced `README.md` out, so
  >   the build could not fix it.

  - **`A8` (fences, as amended).**
    - `git diff --name-only <base> <tip>` lists only `NOTICE`, `src/evaluate.ts`, **`README.md`**, and
      `src/*.test.ts` or `src/__snapshots__/*` files that `A2` or `A5` explains.
    - `git diff <base> <tip> -- tools data src/levels.ts src/status-panel.ts` is empty (unchanged).
  - **`A8a` (the README's licence sentence, and only it).** At `da480b78`, lines 84–86 of `README.md` read:

    ```text
    skytalix is licensed under Apache-2.0; see [LICENSE](LICENSE). Some parts are under other
    terms, and [NOTICE](NOTICE) lists them: the evaluation values in `src/evaluate.ts`
    (CC BY-SA 3.0) and four grugops kit files (MIT).
    ```

    At the tip, the sentence reads exactly as below. Line 84 is unchanged, and lines 85–86 become one line:

    ```text
    skytalix is licensed under Apache-2.0; see [LICENSE](LICENSE). Some parts are under other
    terms, and [NOTICE](NOTICE) lists them: four grugops kit files (MIT).
    ```

    Every other line of `README.md` is byte-equal to `<base>`. The checks:
    - `git diff -U0 <base> <tip> -- README.md` has exactly one hunk, `@@ -85,2 +85 @@`. It removes the two old lines
      85–86 and adds the one new line 85;
    - `grep -c -i -E 'michniewski|by-sa|chessprogramming' README.md` is `0`;
    - `grep -c 'four grugops kit files (MIT)' README.md` is `1`.

    `ABC-216`'s acceptance still holds at the tip:
    - `A7`: Apache-2.0 is named, `LICENSE` and `NOTICE` are linked, `NOTICE` is said to list parts under other terms,
      and no sentence says that every file is Apache-2.0;
    - `A2`: `wc -l < README.md` is 87 (≤ 100), and the `## ` heading count is unchanged (8);
    - `A9`: `LICENSE` and `NOTICE` still resolve.

    If `<base>` is later than `da480b78` and the sentence has moved, the hop note gives its lines at `<base>`, and the
    result is still exactly the two lines above. If the sentence has changed or is gone, stop to BA/PM.

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
    *2026-10-25:* `A8`, as amended, adds one prose sentence in `README.md`. It is not code and adds no limb token,
    so no trigger fires.
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

**Re-scored 2026-10-25 by BA/PM** (task `bapm-amend-ABC-215`, at `main` `da480b78`, after the design ruling).
**Result: 10 of 10. In Design → Ready for Dev.** Only these rows changed:

| # | item | verdict |
|---|---|---|
| 2 | scope and out-of-scope clear | ✅ the design's seven rules and values (§ Design ruling). Scope 3 also takes `README.md`'s licence sentence, only that sentence (`A8` amended, `A8a`). Nothing else is added |
| 3 | INVEST-shaped | ✅ no split: the probe moves 16 rows in 5 files, all by existing rules. The page's split would predict a `G6` miss on its first half (`pv` +2.15 %) and cost a second D |
| 4 | acceptance testable and measurable | ✅ `A8a`: one `-U0` hunk `@@ -85,2 +85 @@` with exact text, 0 `michniewski\|by-sa\|chessprogramming` hits in `README.md`, 1 kit-files hit, and `ABC-216` `A2`/`A7`/`A9` re-read at the tip |
| 8 | size assigned | ✅ `L`, confirmed by the probe (one build) |
| 10 | no major unresolved blocker | ✅ design ruled (`…e04234f4`), with no ADR and no owner word. The `README.md` gap is closed by `A8a`. `QE-205-c` is still open and does not block: `G6` is graded as written, and `c2` is predicted to meet it (`UNKNOWN - verify` until QE reads it) |

## Design ruling

> **Architect/Design, 2026-10-25** (task `arch-design-ABC-215`, records plus probes, at `main` `15f42dd2`). Notes:
> `.grugops/context/arch-design-ABC-215/notes/`. The probes ran on scratch clones in `<scratchpad>/arch215/`
> (`trees/base`, `trees/c2`, `trees/pv`, `trees/tb`), never on `src/`. Plain node v26.11.1. **No real-clock search
> was run and no timing is quoted.** The real-clock rows of the deep lanes were filtered out by name. No `G6`, no
> game, no D. Every count below is deterministic: a frozen clock, a fixed depth, or a virtual clock.
> `src/` at `15f42dd2` is byte-identical to `d5690c5c`, the base `qe-ABC-205` read `G6` on. The base tree
> reproduces that note's frozen-clock counts exactly.

**Result.** One candidate, `c2`, made by seven stated rules. Every relation row is green, unedited. No level and no
NFR bound moves. **16 pinned rows move in 5 files**, all by rules that already exist. `G1` reads 54/58 (= baseline).
The frozen-clock pre-check predicts **`G6` MET**: position-6 needs **6.65 % fewer** nodes than base to complete
depth 8. **Build it as one `L` ticket. Do not split** (§ Split, below). No ADR and no owner word is needed.
One BA/PM scope line is owed before Ready for Dev: `README.md:84-86` (§ Fences).

### The rules (one per array; the design did not start from the base numbers)

Notation, all from WHITE's side (Black reads the rank flipped, as today): `R` is the rank counted from the piece's own
side, 1 to 8. `e(f)` is the file's steps from the edge: a/h 0, b/g 1, c/f 2, d/e 3. `ring` is the square's steps from
the board's edge, `min(e(f), min(R − 1, 8 − R))`, 0 to 3.

| array | rule (its comment states this) | range | why |
|---|---|---|---|
| `PIECE_VALUE` | the classical scale P 1, N 3, B 3, R 5, Q 9 pawns, × 100, **plus 25 on each minor**: `[0, 100, 325, 325, 500, 900, 0]`. King 0 (reason unchanged) | — | The scale is the chess primers' convention, the same one `src/status-panel.ts` shows. The quarter pawn makes one minor outweigh three pawns. Bishop = knight: the bishop's wider reach is paid by mobility (`ABC-083`) |
| `PAWN_TABLE` | `2 × e(f) × (R − 2)`; 0 on ranks 1 and 8 | 0 … 30 | A pawn gains as it advances, and more on the central files. Shelter is left to king safety (`ABC-083`), which already charges a missing shelter pawn |
| `KNIGHT_TABLE` | `10 × n − 50`, n = the knight's moves from the square on an empty board (2 … 8) | −30 … 30 | A knight is worth its reach |
| `BISHOP_TABLE` | `5 × (n − 9)`, n = the squares on its diagonals on an empty board (7 … 13); equal to `10 × ring − 10` | −10 … 20 | A bishop is worth its reach |
| `ROOK_TABLE` | 20 on the rank `R = 7`, else 0 | 0 … 20 | The seventh rank. Open files are left to mobility, which counts a rook's reach along them |
| `QUEEN_TABLE` | `5 × ring − 5` | −5 … 10 | A small pull to the centre. An early queen trip is `ABC-207`'s, not a table's |
| `KING_TABLE` | `max(−50, −10 × d − 10 × (R − 1))`, d = file distance to the nearer of the b- and g-files | −50 … 0 | The castled squares b1 and g1 are home (0). Each file toward the centre and each rank up costs 10. Untapered, as today |

- **Each rule is a formula over file, rank or reach** (Scope 2). The whole start position still scores exactly 0.
- **How `c2` was reached, stated so that nobody reads it as tuned.** The first set, `c1`, used `(R − 2) × (2 + 2 e(f))`
  for pawns and gave rooks +5 on the d- and e-files. It reddened two relation rows: `ABC-083` `A2`'s equal-material
  g6/g2 row and `A4`'s premise "both rooks on squares their table scores 0". Under `A4` a relation red is a STOP. So
  the design changed exactly those two rules and nothing else. The node counts were read only after `c2` was fixed.
  No candidate was chosen by a count.
- **Entries that differ from base:** `PIECE_VALUE` 2 of 7 (N, B). Pawn 46 of 64 (16 of the 18 equal cells are on ranks 1
  and 8, which are never read). Knight 64 of 64. Bishop 18 of 64. Rook 20 of 64. Queen 27 of 64. King 50 of 64.
  - The bishop and queen tables match base on many cells. Any ring rule lands there: border −10, then 0, then 10.
  - *Engineering reading, not legal advice:* a stated ring or reach rule is a method, not the page's values. This is
    `ADR-0048` decision 4's reading of `KING_ENDGAME_TABLE`, and it is `UNKNOWN - verify`.

#### The values (`c2`, rank 8 first, as the file lays them out)

```text
PIECE_VALUE  0, 100, 325, 325, 500, 900, 0

PAWN_TABLE
   0,   0,   0,   0,   0,   0,   0,   0
   0,  10,  20,  30,  30,  20,  10,   0
   0,   8,  16,  24,  24,  16,   8,   0
   0,   6,  12,  18,  18,  12,   6,   0
   0,   4,   8,  12,  12,   8,   4,   0
   0,   2,   4,   6,   6,   4,   2,   0
   0,   0,   0,   0,   0,   0,   0,   0
   0,   0,   0,   0,   0,   0,   0,   0

KNIGHT_TABLE
 -30, -20, -10, -10, -10, -10, -20, -30
 -20, -10,  10,  10,  10,  10, -10, -20
 -10,  10,  30,  30,  30,  30,  10, -10
 -10,  10,  30,  30,  30,  30,  10, -10
 -10,  10,  30,  30,  30,  30,  10, -10
 -10,  10,  30,  30,  30,  30,  10, -10
 -20, -10,  10,  10,  10,  10, -10, -20
 -30, -20, -10, -10, -10, -10, -20, -30

BISHOP_TABLE
 -10, -10, -10, -10, -10, -10, -10, -10
 -10,   0,   0,   0,   0,   0,   0, -10
 -10,   0,  10,  10,  10,  10,   0, -10
 -10,   0,  10,  20,  20,  10,   0, -10
 -10,   0,  10,  20,  20,  10,   0, -10
 -10,   0,  10,  10,  10,  10,   0, -10
 -10,   0,   0,   0,   0,   0,   0, -10
 -10, -10, -10, -10, -10, -10, -10, -10

ROOK_TABLE
   0,   0,   0,   0,   0,   0,   0,   0
  20,  20,  20,  20,  20,  20,  20,  20
   0,   0,   0,   0,   0,   0,   0,   0
   0,   0,   0,   0,   0,   0,   0,   0
   0,   0,   0,   0,   0,   0,   0,   0
   0,   0,   0,   0,   0,   0,   0,   0
   0,   0,   0,   0,   0,   0,   0,   0
   0,   0,   0,   0,   0,   0,   0,   0

QUEEN_TABLE
  -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5
  -5,   0,   0,   0,   0,   0,   0,  -5
  -5,   0,   5,   5,   5,   5,   0,  -5
  -5,   0,   5,  10,  10,   5,   0,  -5
  -5,   0,   5,  10,  10,   5,   0,  -5
  -5,   0,   5,   5,   5,   5,   0,  -5
  -5,   0,   0,   0,   0,   0,   0,  -5
  -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5

KING_TABLE
 -50, -50, -50, -50, -50, -50, -50, -50
 -50, -50, -50, -50, -50, -50, -50, -50
 -50, -50, -50, -50, -50, -50, -50, -50
 -50, -40, -50, -50, -50, -50, -40, -50
 -40, -30, -40, -50, -50, -40, -30, -40
 -30, -20, -30, -40, -40, -30, -20, -30
 -20, -10, -20, -30, -30, -20, -10, -20
 -10,   0, -10, -20, -20, -10,   0, -10
```

### `A2`: how the test reaches the arrays

- **Keep the seven arrays as 8×8 literals** under their rule comment. The hot path is unchanged: the same `readonly
  number[]` lookups, with no load-time builder. So `G2` should not move. That is `UNKNOWN - verify` until QE reads it.
- **One TEST-ONLY export** from `src/evaluate.ts`: an object that names the seven arrays (for example
  `VALUE_TABLES_FOR_TEST`). This follows the `evaluateWithoutMobility` precedent. Production does not read it.
- **The rebuild rows are appended to `src/evaluate.test.ts`**, `ABC-076`'s file that owns the tables. No new file
  (`NFR-008`). The test imports only `./evaluate.ts`, so `ADR-0036` (c) does not fire.
  - The test implements each rule on its own, by counting knight steps and diagonal squares on an 8×8 grid, and
    asserts all 64 entries and every `pieceType` index.
  - It asserts that the export's keys are exactly `A1`'s seven names.
  - It asserts at least one entry per array differs from `<base>`. A literal of the base values in the test is enough.
- **A mutant to show the row bites:** one cell changed by 1 in any table reddens the rebuild row.

### The header and `NOTICE` (Scope 3; `ADR-0048` decision 7 already rules this, so no ADR is owed)

- **`src/evaluate.ts`:** lines `:16`–`:22` (the credit sentence, "The values are unchanged…", and `ABC-214`'s two lines)
  become one line: the values in `PIECE_VALUE` and the six piece-square tables are this project's own, each made by
  the rule written above it.
  - `:12`–`:14` ("HAND-TUNED and expected to move") stays true: the coefficients are hand-picked.
  - `:57` ("Deliberately small and hand-written…") is reworded to point at the rules.
- **`NOTICE`:** delete lines 7–15 (the `Evaluation values (CC BY-SA 3.0)` section and the blank line after it).
  - The file is then **byte-equal to `ABC-214` Scope 5's common part**. That is a one-line check for the build
    (`diff`).
  - Line 5, "The parts listed below are not licensed under the License", stays: the kit files are still MIT.
- **After the merge** (records only, not this build): one dated line on `ADR-0048` § Status, "decision 7 done by
  `ABC-215` (`<merge sha>`)" (Architect/Design). The `LIC-PUB-1` and `OQ-214-4` dispositions are Security/NFR's, and
  `LIC-PUB-1` is owned by the owner.

### Fences: one scope gap, BA/PM's (before Ready for Dev)

- **`README.md:84-86`** reads "…[NOTICE](NOTICE) lists them: the evaluation values in `src/evaluate.ts` (CC BY-SA 3.0)
  and four grugops kit files (MIT)." `ABC-216` added that line after this page was cut. Once this ticket merges, the
  line is false.
- `A8` allows only `NOTICE`, `src/evaluate.ts` and tests. **BA/PM adds `README.md` to `A8`'s list**, limited to that
  sentence ("…lists them: four grugops kit files (MIT)."), or opens a one-line follow-up that merges with this one.
- `A3`'s greps cover only `src/evaluate.ts` and `NOTICE`. A tree-wide `git grep -i -E 'michniewski|by-sa'` outside
  `.grugops/`, `plans/` and `memory-bank/` finds only those two files and `README.md`.

### Rows the candidate moves (probed on `c2`; base clean)

- **Base clone:** default lane 2 075 / 2 075 green. Deep lanes green, real-clock rows excluded.
- **`c2`, default lane:** 13 reds in 4 files, 2 062 / 2 075 green. **None is a relation and none is a level.**
- **`c2`, deep lanes (`SEARCH_DEEP`, `ENGINE_DEEP` with no real-clock rows, `PUZZLE_DEEP`):** the same rows, plus 3
  deep pins in `quiescence.test.ts`.

| # | row | before → after | kind | route |
|---|---|---|---|---|
| 1 | `engine.test.ts` `A3` (2 rows): budget 3 on a 1 ms tick must complete depth 2 and abort inside 3 | now completes depth 3 (score −64 → −2) | a fixture premise is lost | re-find under `ADR-0028` d2 (the `a3scan.ts` precedent, re-fixtured four times). The deep literal `g4g5` row stays green |
| 2 | `search.ordering.test.ts` Scope "the fixture bites" (tie at depth 1) | unordered now also `g5e3` | a fixture premise is lost | re-find under `ADR-0028` d2 (the `tiescan.ts` precedent) |
| 3 | `search.ordering.test.ts` `A4` position-6 d2 (and the row's other pins) | 8 887 → 10 371 | pinned values | re-pin, `before → after` in the hop note (`ABC-083` `A10` precedent) |
| 4 | `search.ordering.test.ts` `A4` promotion-capture d3 | 262 → 232 | pinned value | re-pin |
| 5 | `search.ordering.test.ts` `G1` position-3, 3 ticks | 354 → 342 | pinned value | re-pin |
| 6 | `search.pvs-lmr.test.ts` `A4` (2 rows): a null-window reduced fail-high is re-searched | the property is lost (score 4 against 19; chooseMove: 0 re-searches) | a fixture premise is lost | re-find under `ADR-0028` d2 (`ABC-083` and `ABC-205` re-found this row too) |
| 7 | `transposition.test.ts` `A1` knight-g1 (2 rows) | 894 → 939 | pinned values | re-pin |
| 8 | `transposition.test.ts` `A1` position-3 nodes | 1 325 → 1 377 | pinned value | re-pin |
| 9 | `transposition.test.ts` `A5` nodes; depth-3 score | 7 832 → 7 295; −488 → −485 | pinned values | re-pin |
| 10 | `quiescence.test.ts` `A4` position-6 d3 bare-leaf nodes `[deep]` | 2 355 → 2 398 | pinned value | re-pin |
| 11 | `quiescence.test.ts` `A5` `ORACLE_AT_DEPTH_3` kiwipete and position-6 `[deep]` | kiwipete 70 / e2a6 → **8 / e2a6**; position-6 84 / c3d5 → **85 / c3d5**. The oracle was re-run on `c2` (`searchWithoutPruning(p, 3)`) and equals `searchWithoutPvsOrReductions` and `search()` on score and move on both boards. The moves are unchanged | pinned values | re-pin **only by the oracle rule** (that file's comment) |

- **Levels and gates on `c2`, read by the probe:**
  - The six `ABC-079` `A5` multiplier cells (base → `c2`, level). Kiwipete: d1 12.31 → 17.92x (180), d2 15.11 →
    20.48x (50), d3 4.09 → 3.51x (70). Position-6: d1 **9.19 → 8.96x (10)**, d2 28.46 → 23.36x (42), d3 4.86 → 5.20x (13).
    All are under their level. The tightest cell gains headroom.
  - `ADR-0026` d5 drift on the 190, both recursions: 97.86 % within 25 cp (base 97.33 / 97.86). The maximum is 63 cp
    (base 51), at position-6/f3h4. That is under the row's 75 cp. There are 0 mate flips.
  - `G1` puzzle suite (virtual clock): **54/58, baseline 54/58.** The same four mate-in-3 rows miss, two with a
    different move.
  - Relation margins (base → `c2`):
    - `ABC-076` `A3`: 284 → 309 (window 250–400). `A4`: 80 → 70.
    - `ABC-083` `A2` g6: 11 → 3. This is the tightest: it is green but thin. `A3` e5/f5: 5 → 14. `A4`: without
      mobility 0 → 0, with mobility 60 → 60.
    - `QE-G2`: −556 → −556. `QE-G3`: 851 → 858.
- **Not run here:** the real-clock rows (`ENGINE_DEEP` engine × 6, levels × 4, transposition `A7`, pvs-lmr `A2`), `G2`,
  `G5`, `G6`, `G8`, `G9`, `G11` and D. Those are the build's and QE's.

### Frozen-clock pre-check (Test note 6; a count, not a reading)

`chooseMove`, `now: () => 0`, `maxDepth: k`. Nodes to complete depth k:

| tree | kiwipete d7 | kiwipete d8 | position-6 d7 | position-6 d8 |
|---|---|---|---|---|
| base (`15f42dd2` = `d5690c5c`) | 566 233 | 1 638 196 | 644 469 | 1 451 759 |
| **`c2` (candidate)** | 609 900 (+7.71 %) | 1 735 339 (+5.93 %) | 586 333 (−9.02 %) | **1 355 149 (−6.65 %)** |
| `pv` (`PIECE_VALUE` alone) | 573 147 (+1.22 %) | 1 655 163 (+1.04 %) | 648 480 (+0.62 %) | **1 483 000 (+2.15 %)** |
| `tb` (the six tables alone) | 593 030 (+4.73 %) | 1 694 996 (+3.47 %) | 631 127 (−2.07 %) | 1 438 596 (−0.91 %) |

- **The straddled depth is position-6 d8.** Base reached it in 3 of 5 runs and searched 1 444 505–1 457 817 nodes in
  3 s (`qe-ABC-205` `…35de132c`). `c2` needs 1 355 149, which is **below base's lowest run by 6.2 %**.
- **Kiwipete straddles nothing.** Base's runs (1.22–1.29 M nodes) complete depth 7 (need 566 k) and never depth 8
  (need 1.64 M). `c2`'s depth-7 need, 610 k, is half of a run. Its depth-8 need, 1.74 M, is out of reach as before.
- **Prediction: `G6` MET.** Kiwipete 7 = 7. Position-6 reaches 8 in every run, against base's median 8. This holds
  while `c2`'s throughput cost stays below about 6 %. The eval code does not change, so a cost that large is
  unlikely. It is `UNKNOWN - verify` until QE's real-clock reading. This is a prediction, not a grade.

### Split: no

- **One `L` build carries it.** The moved set is 16 rows in 5 files, against `ABC-205`'s 11 plus 3 deep. Every row
  routes by an existing rule (re-pin, the `ADR-0028` d2 re-find, or the oracle rule), as `ABC-083` and `ABC-205` did.
  No level, no NFR bound and no relation moves.
- **The page's split would hurt.** `PIECE_VALUE` first, alone (`pv`), needs **2.15 % more** nodes than base at
  position-6 d8. That predicts a `G6` miss on the first half. It would also cost a second D reading (6–12 h), and the
  carve-out could not end until both halves merged. The material change moves only 3 rows on its own; the tables carry
  the rest.
- **So BA/PM need not split.** The ticket goes to Ready for Dev as it is, once the `README.md` scope line is settled.

### Accepted and open

- **ADR:** none. The values change and `ADR-0031`'s form does not. The carve-out's end is `ADR-0048` decision 7.
- **Owner word:** none. No level moves. `QE-205-c` stays open and does not block: with no answer, `G6` is graded as
  written, and `c2` is predicted to meet it.
- **D and S3:** strength is not predicted. The rules were not tuned for it, and `A7` reads it.
- **For the Engineer:** take the rules and the values from this section. Do not re-derive them. If a relation row
  turns red on the build, that is a STOP to BA/PM, not a new rule.

### Next move

- **BA/PM:** the `README.md:84-86` line into `A8` (or a twin follow-up). This is records only.
- **Orchestrator:** merge this records branch. After BA/PM's line, ABC-215 goes In Design → Ready for Dev → In
  Development (Software Engineer), at width 1 against `ABC-207`.

## Reading

> **QE/E2E, 2026-10-25** (task `qe-ABC-215`, branch `grugops/qe-ABC-215`, merge `7d4cea3e` = `b778ab13` + `main`
> `cac2b4e9`; base = merge-base `cac2b4e9`). **One run per reading under `…4c3f7639`** (scope `…1976d0e9`), pre-registered.
> Notes: gate `…dc2c86cc`, pre-check/G2/G6/G11 `…a34270bf`, D `…0c9bab9a`, verdict `…c2c3540f`
> (`.grugops/context/qe-ABC-215/notes/`). Raw files, `SHA256SUMS` and the scripts that ran: `.grugops/context/qe-ABC-215/raw/`
> (personal paths redacted, `ADR-0049` d4).

| # | state | the reading |
|---|---|---|
| `A1` | **MET** | at `cac2b4e9`: `NOTICE` section count 1, `See NOTICE` count 1; seven arrays named |
| `A2` | **MET** | QE's own rebuild equals all seven arrays over every entry; differ counts 2/7, 46, 64, 18, 20, 27, 50 of 64; each one-cell mutant reds its own row; base values red 14 rows |
| `A3` | **MET** | 0 hits in `src/evaluate.ts`, `NOTICE`, `README.md`; `NOTICE` byte-equal to `ABC-214` Scope 5's common part; `LICENSE`/`package*.json` diff empty |
| `A4` | **MET** | no relation assertion edited; all relation rows, `QE-G2`, `QE-G3` green |
| `A5` | **MET** | 16 moved rows = the ruling's set (cross-run both ways); oracle re-run: kiwipete 8/e2a6, position-6 85/c3d5; three companions keep their guards |
| `A6` | **MET** | gates green, 2 090/2 090, skips `No findings.`; `G1` 54/58; `G2` head 642.6 / 641.2 ns (base 641.1 / 637.8); `G6` kiwipete 7 = 7, position-6 head 8 8 8 8 8 against base 7 7 8 7 7; `G8` 7.11 s; `G9` empty |
| `A7` | **MET** | **D NEUTRAL, X = +15.6 ± 23.8** (W/L/D 107/89/204, 400/400, 0 faults, 0 vitest overlap); S3: not LOSS and X ≥ 0, no extension. `G11`: head d3 (4.Qa4), exd6 (10.Ne4); the other three agree with base |
| `A8`/`A8a` | **MET** | product diff `NOTICE`, `README.md`, `src/evaluate.ts`, six test files; `README.md` one hunk `@@ -85,2 +85 @@` |

**Pre-check (frozen clock, nodes to complete depth k):** base kiwipete d7 566 233 / d8 1 638 196, position-6 d7 644 469 / d8
1 451 759; head 609 900 / 1 735 339, 586 333 / 1 355 149. **QE verdict: PASS. UAT signed by it (`…5aaf7cec` item 2).**
