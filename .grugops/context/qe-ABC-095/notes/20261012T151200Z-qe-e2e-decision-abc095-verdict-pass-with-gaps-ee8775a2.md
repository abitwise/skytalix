---
id: 20261012T151200Z-qe-e2e-decision-abc095-verdict-pass-with-gaps-ee8775a2
kind: decision
by: qe-e2e
task: qe-ABC-095
at: 2026-10-12T15:12:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - ABC-042
  - ABC-043
  - plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
  - NFR-004
  - NFR-008
  - N8-LANE
  - ADR-0035
  - ADR-0036
  - ADR-0037
  - 20261012T143800Z-qe-e2e-observation-abc095-criteria-plants-children-e11e8176
  - 20261012T151000Z-qe-e2e-observation-abc095-timing-a2-r3-n8-lane-3283096f
  - 20261012T150900Z-qe-e2e-artifact-ref-abc095-branch-commands-probe-4e66067b
  - 20261012T140000Z-software-engineer-observation-gates-cli-deep-plants-clause-b-s3-adc2b5bb
supersedes:
---

# QE `ABC-095` on `grugops/ABC-095-book-before-engine` (tip `2307fc11`, code `521a8513` + `09740ea4`): **PASS_WITH_GAPS**. `A1`–`A7` all MET, `A2` and R3 read in a clean window. `N8-LANE` NOT READ

This is a hand-authored, unsealed note (`AGENTS.md`: no `finding` is admissible on this install). The review ran on
QE's own branch, `grugops/qe-ABC-095` off `2307fc11`. Readings: `…e11e8176` (criteria, plants, children, SE readings)
and `…3283096f` (timing).

| item | ruling | basis |
|---|---|---|
| `A1` hit: search called 0 times | **MET** | suite row green; QE's own 200 fresh probes through `readBookFile`: 0 inner calls, every reply a book entry |
| `A2` ≤ 30 ms cold | **MET** | clean window `t-w1`: max **8.300 ms** of 10 fresh processes (median 5.960) on QE's strict instrument. The SE's reads 7.139 ms max |
| `A3` miss: search once, silent | **MET** | 4 out-of-book positions: 1 inner call, its move returned, 0 warnings, 0 stderr writes. **R3 warm miss: max 0.0149 ms ≤ 5 ms**, MET (3 × 200; medians ~0.0009, p99 ~0.007 ms) |
| `A4` invisible transition | **MET** | suite row green, plus a real child: ply 2 (book) and ply 4 (search) frames have the same rows, 0 extra message rows, 0 "book" text, 0 stderr bytes |
| `A5` no book | **MET** | game half green; stream half `CLI_DEEP` green, plus QE's child with 3 searched engine plies: stderr is exactly 1 warning line, 0 on stdout, exit 0 on quit |
| `A6` engine untouched | **MET** | 0 numstat lines over the engine, search, eval, ordering, TT, levels, virtual clock, `turn-loop.ts`, `book.ts` and `data/`. Clause (d): exactly the six files |
| `A7` real session consults the book | **MET** | `engine:` is the only changed line in the call; the probe is bound with `readBookFile`, a stderr `warn` and `Math.random`. `CLI_DEEP` green; QE ×10: every reply a book entry (e5 7, c5 2, e6 1), stderr 0 B |
| `CLI_DEEP` | **9 / 9**, exit 0 | 0 `abc095-book-absent-*` left behind (census before and after) |
| Gates | **green** | lint, typecheck, build exit 0; `npm test` 58 / 1780, skip 0; `No findings.` |
| QE's 18 plants | all caught **except P6b, P10a, P10b** (named below) | ABC-119 `A6` M1 and M2 red `CLI_DEEP` `A1` alone with the default lane green (1780): **`ABC-119` `A6` holds on the amended lane** |
| 10 re-targeted children | **each exercises its criterion** | each is read by ≥ 1 row; P1a reds the 6 rows that need the double reached; `src/cli.test.ts` ×20: **20 / 20 green** (`mate` rows green in all 20) against the naive wiring's 4 / 10 red. The default lane reads the book **0** times (P12) |
| SE reading (a): the copy rule | **honest and sufficient** | P9a and P9b (a linked `src/`, a linked `src/book-file.ts`) are both red. The wording gap is `QE-095-e` |
| SE reading (b): "both halves pinned" | **honest; a superset** | every plant touching the expression or the initializer reds on it |
| `N8-LANE` (650 ms CPU, both named costs) | **NOT READ** | 4 pre-registered windows, all VOID: foreign kit vitest on S1; an idle orphan `oeselg-labs/platform` process on S2. The count pins hold: +1 file, 0 new spawns |
| UAT waiver | **does not apply** | the delivered pair `0974102f..2307fc11` names `src/book-engine.ts`, `src/book-file.ts`, `src/cli.ts`. **The owner's UAT word is owed** |

## Gaps

| id | sev | gap | owner |
|---|---|---|---|
| `QE-095-N8` | MEDIUM | **`N8-LANE` NOT READ** on both costs `UNKNOWN - verify` on the page (S1 `src/cli.test.ts`, S2 `src/cli.real-engine.test.ts` default lane). 4 windows were void, and one re-attempt per set was spent. Counts hold (+1 file, `N8_SPAWN` 27, 0 default-lane book reads) | Orchestrator: route a re-read in a quiet window (Security/NFR's gate or a QE re-read hop), or take the owner's ruling as at `ABC-105` |
| `QE-095-a` | LOW | **No test pins how `readBookFile` resolves its path.** A cwd-relative `readFileSync("data/opening-book/book.json")` (P6b) is green in the default lane and in `CLI_DEEP`: the `A7` child runs with cwd = the repository, and the book-absent copies have no book at any path. A player launching `node /abs/src/cli.ts` from another directory would silently lose the book (one warning). The delivered code is correct (`new URL(…, import.meta.url)`); today only S3 item 2 (by hand) and § S1's routing guard it | BA/PM (`A7`'s child could run with cwd = a neutral directory) / Security/NFR (S3 item 2) |
| `QE-095-b` | LOW | **`A7`'s child row does not discriminate**: green on P1a, P2, P3 and P7. An unwired build is caught (1 pin, 6 child rows, 2 deep rows). A hit that is not used (P2, P3) is caught only by `book-engine.test.ts`, and by composition (unit `A1` plus the root pin). **Enough for `A7` as written.** A sharper Given (a fixture book in a copy whose only entry after 1. e4 is a move the search does not choose) is optional | BA/PM |
| `QE-095-c` | LOW | **"Exactly 1 warning for the whole process" is not behavioural in `CLI_DEEP`**: each book-absent child plays one engine ply, so P7 (probe per move) is green there. It is caught structurally (`createBookProbe(` once, the const pin) and incidentally. QE's 3-ply child reads exactly 1 on the delivered build | BA/PM (the `A5` stream-half child could play ≥ 2 engine plies, about +3 s `CLI_DEEP`) |
| `QE-095-d` | LOW | **A copy left behind is seen by no test**: P10a (deep `afterAll` disabled) and P10b (default row without `finally`, on failure) are green or red for other reasons, with census +1. The delivered removal is correct: census 0 after every run, P8's failure included | Orchestrator (accept), or BA/PM |
| `QE-095-e` | LOW | **Wording**: test note 4 / `ABC-119` § Amendment say "every entry under its `src/` is a regular file", but `src/__snapshots__` is a directory. The implemented and sufficient rule is "no entry is a symbolic link; every entry that is not a directory is a regular file" | BA/PM (and S3 item 7's text, Security/NFR) |
| `QE-095-h` | LOW | **`src/book-engine.test.ts` (the added file) has no `N8-LANE` content reading** on any hop (decision 2 would read it against a placeholder). Its 160 ms floor is charged by count | Orchestrator, with `QE-095-N8` |
| `QE-095-f` | INFO | "Both halves pinned" is stricter than either reading (reordering the probe's properties would red it). It is not a defect | — |
| `QE-095-g` | INFO | **The waiver's literal form is a trap here**: `git diff --name-only 2307fc11~1 2307fc11` is empty, because the tip is a records commit. Measured on the delivered pair, it names 3 production files | Orchestrator, at the UAT exit |
| `QE-095-i` | INFO | **The inherited void clause** (any `oeselg-labs/platform` process voids a round, from `qe-ABC-154`) voided both S2 windows on a 0.0 %-CPU orphan from another session. Whether an idle process should void a round is a forward-only protocol question | Architect/Design |

## Next

The page's `## Security / NFR triggers` route this ticket to **`In Security/NFR`** (S3 checklist; `ADR-0036` (b1)
fires on `src/book-file.ts` and `src/cli.ts`, and (b2) on `cli.ts -> book-file.ts`). Then UAT on the owner's word.
The board move is the Orchestrator's. QE did not merge, push or touch `plans/board.md`.
