---
id: 20261010T185733Z-qe-e2e-observation-abc093-mutants-gap-register-cce9af72
kind: observation
by: qe-e2e
at: 2026-10-10T18:57:33Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ADR-0037
  - QE-093-a
  - QE-093-b
  - QE-093-c
  - QE-093-d
  - QE-093-e
  - .grugops/context/qe-ABC-093/probe/mutate.ts
  - .grugops/context/qe-ABC-093/probe/run-mutants.sh
  - .grugops/context/qe-ABC-093/probe/mutants-at-5332f501.tsv
  - .grugops/context/qe-ABC-093/probe/mutants-at-e68b5e68.tsv
  - 20261010T183947Z-software-engineer-claim-abc093-agents-md-regeneration-line-owed-a6cb510f
  - 20261010T183612Z-security-nfr-decision-catalog-r1-provisional-retired-node26-risk003-measured-ar133-recorded-d1e00b44
supersedes:
---

# `ABC-093`: the 37-mutant ledger (15 green at `5332f501`, 4 green at `e68b5e68`) and the gap register

## How the mutants were run

- **Where.** Each mutant ran in a fresh rsync copy of the worktree, never the worktree itself.
- **The command.** `npx vitest run tools/opening-book/book.test.ts`.
- **The control.** A no-op control was green both times.
- **The two sets.** The A-series mutates `book.json` (or `src/zobrist.ts`). The C-series mutates `compile.ts`.
- **Data.** Rows are in `probe/mutants-at-*.tsv`.
- **One spoiled row.** The first `C4` row at `5332f501` is a broken mutant (a syntax error); the valid re-run
  follows it in the file.

## Killed at `5332f501` (22)

- **Artifact mutants.**
  - `A2` kills: an illegal move, an unreachable key, a weight of `0` / `1.5` / `"3"`, and Zobrist drift.
  - `A3` kills: `maxPly` 13, and a ply-13 move on a reachable leaf.
  - `A4` kills: two replies after `1. e4`.
  - `A5` kills: a 700 kB pad.
  - `A6`/`A7` kills: the attribution field changed, and a `.js` file in `data/`.
- **Compiler mutants.**
  - `A8` kills: a bad SAN skipped; no header check; no column check; no two-names check; no control-byte check;
    the control boundary moved from `0x20` to `0x07`; and **write-before-validate (7 red)**.
  - `A1` kills: a `Date.now()` stamp (3 of 3 runs), an absolute source path, and a random key order.

## Survived at `5332f501` (15), and what QE did

- **Closed by QE's test-only additions (11):**
  - `A11` keys unsorted, `A12` `m` unsorted, `A13` a duplicate UCI, `A14` an empty `m` with no name, `A15` a
    control byte in an artifact name, `A16` the commit truncated to 8 hex, `A17` `format` 2 plus an extra field.
    The new D1(e) shape test kills all seven.
  - `C8` key sort removed, `C9` `m` sort removed. The new row-order `A1` test kills both.
  - `C7` collision check removed. The new D1(f) test, with a stubbed `zobristKey`, kills it.
  - `C15` SAN validated only to ply 12. The new `A8` row with a broken 13th SAN kills it.
- **Still green at `e68b5e68` (4), recorded and not closed:**
  - `C10` `WEIGHT_POLICY = "uniform"`. **By design**: it is the owner-veto switch. A lane pin would make the veto
    two edits. QE's harness proved all 5,825 real weights equal their line counts.
  - `C11` `MAX_PLY = 14`, and `C18` names written past 12 plies. The lane compiles fixtures only (`ADR-0037`
    D1(g) rejected an in-lane real compile). Any regenerated artifact goes red on `A3`/`A2` before it can ship.
  - `C17` the `commit` argument ignored in favour of the constant. Harmless today: the CLI passes the constant,
    and the artifact's commit is now pinned to `SOURCE_COMMIT`.

## Gap register

- **`QE-093-a` — MEDIUM — routed to the Orchestrator (an `AGENTS.md` Scribe hop).**
  - **What is missing.** § Scope bullet 4's regeneration command is not in `AGENTS.md` on the delivered tree.
    It was RUN 3× by the Engineer and 2× by QE, exit 0 and `cmp` 0 each time.
  - **Budget.** Main's `AGENTS.md` is now 23,216 B, which leaves 1,360 B of the 24,576 B target.
  - **Severity.** A scope deliverable, not a defect in what shipped. It does not block merge quality. It does
    block calling the ticket's scope complete.
- **`QE-093-b` — LOW — routed to Architect/Design (`ADR-0037` D1(f) list), with the owner informed.**
  - **The gap.** `compile.ts` never checks the five inputs' sha256 against the pin. Any directory of
    well-formed TSVs compiles under `source.commit = a6189a30…`, so the field is a label, not a proof.
  - **What mitigates it.** `ATTRIBUTION.md` records the five hashes for a manual check, and the Engineer
    recorded the option (`…79cc28a5` call 2).
- **`QE-093-c` — INFO.** The survivors `C10`, `C11`, `C17` and `C18` above, each with its reason.
- **`QE-093-d` — INFO — Architect/Design's, already flagged in `…d1e00b44`.**
  - **Confirmed.** `vitest list --dir src` lists 52 files, while `npm test` and `lane-inventory` read 53.
  - **Where `book.test.ts` runs.** It runs only in the root lane.
- **`QE-093-e` — INFO — unattributed.**
  - **What happened.** One `npm test` run at `5332f501` was red: 1 failed of 1,676, in 42 s, while load1 read
    about 183. QE's capture kept only the summary tail, so **the failing test is UNKNOWN - verify**.
  - **What followed.** Seven later full-lane runs were green: 2 at `5332f501` at load1 147–165, and 5 at QE's
    tree at load1 7–16. In isolation, `book.test.ts` was green on every run, including all 4 control runs.
  - **Reading.** Most likely a load-sensitive test elsewhere in the lane. It is not attributed to this ticket.
