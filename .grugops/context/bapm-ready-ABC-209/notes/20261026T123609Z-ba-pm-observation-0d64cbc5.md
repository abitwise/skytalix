---
id: 20261026T123609Z-ba-pm-observation-0d64cbc5
kind: observation
by: ba-pm
at: 2026-10-26T12:36:09Z
verified_by: 
confidence: high (git and grep reads at 53b67d53)
refs:
  - ABC-209
  - ABC-208
  - ABC-204
  - ABC-210
  - EPIC-008
  - S1
  - A1
  - A4
  - A6
  - G1
  - G6
  - NFR-009
  - QE-205-c
  - QE-207-g
  - ADR-0025
  - ADR-0026
  - ADR-0006
  - ADR-0032
  - ADR-0034
  - ADR-0050
  - plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md
  - orch-2026-10-26q/20261026T122626Z-orchestrator-decision-836cb92d
  - bapm-ready-ABC-208/20261026T010656Z-ba-pm-decision-75bf6402
  - orch-2026-10-26c/20261026T010824Z-orchestrator-decision-d25ab770
  - bapm-epic008-g6-rule/20261025T122057Z-ba-pm-decision-8e51ba1e
  - bapm-close-ABC-205/20261025T043809Z-ba-pm-decision-84a05b3a
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-word-2026-10-23/20261023T203000Z-orchestrator-decision-7feb0553
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - grugops/bapm-ready-ABC-209
  - 53b67d53
  - b5c67ab7
supersedes: 
seal: sha256:7d67ba486a7adcc91fc1c6f52c93b4dc6a595f8e41ce8f37c7114877e8df2873
---

# BA/PM re-reads at main 53b67d53 for the ABC-209 DoR re-score. Records only

Task `bapm-ready-ABC-209`. Branch `grugops/bapm-ready-ABC-209` from `main` `53b67d53`. No npm, no vitest, no
timing, no `src/` edit.

- **Page cite:** `src/transposition.ts:17-20` holds ("LIFETIME: ONE SEARCH (`ADR-0025` Decision 4) …").
  `git log 55a8f4ef..53b67d53 -- src/transposition.ts` is empty. It is the page's only `file:line` cite.
- **Clear sites, moved by null move (ABC-208):**
  - `src/engine.ts` `clearTable();` is at `:550` (`:492` at the cut `55a8f4ef`, `:497` at `b5c67ab7^1`);
  - `src/search.ts` `if (switches.table) clearTable();` is at `:605` (`:498` at the cut, `:496` at `b5c67ab7^1`);
  - the text at both is unchanged.
- **Comments that state the one-search lifetime:**
  - `src/transposition.ts:17-20`, and its replacement-policy lines `:22-26`;
  - `src/engine.ts:57-62`;
  - `src/search.ts:24-26` and `:594-597`.
- **Entry paths:**
  - `src/cli.ts:200` `newGame(START_FEN)`;
  - `src/uci-session.ts:370` `ucinewgame` and `:374` `position`;
  - the blunder path calls `chooseMove` per child at `src/levels.ts:154`.
- **Exports:**
  - `src/transposition.ts` already exports `clearTable` (`:78`) and `tableByteLength` (`:89`);
  - `EngineOptions` carries `now?` (`src/engine.ts:166`) and `maxDepth?` (`:173`), so the frozen-clock pre-check
    can be read on the shipped `chooseMove`.
- **`ADR-0025`:**
  - decision 4 (`:71-77`): "It does not persist across moves";
  - § Alternatives (`:99-107`): persistence is rejected "now, not forever", with three objections, and it is
    re-opened by "a measurement of depth gained across a real game";
  - `T1` (`:154`);
  - § Rollback (`:142`): "a change of when the table is cleared, plus an aging field".
- **Texts that rely on per-search clearing:**
  - `ADR-0026` decision 7's 2026-09-26 sentence (`:172-173`);
  - `ADR-0006`'s two 2026-09-26 errata (`:283`, `:293-294`).
- **`ADR-0050`** (`:117-118`): a null-move cutoff "stores no table entry".
- **`ADR-0034` decision 2:** `transposition.ts` and `engine.ts` are on the scope instrument's list, so the diff has
  no drift class.
- **The owner's words read:**
  - `…7feb0553` item 2: the TT-across-moves ADR work has its go-ahead, and the text is reported when it lands;
  - `…5aaf7cec` item 3: changing or reversing an accepted ADR is the owner's;
  - `…4c3f7639`: one reading, final;
  - `…d25ab770` is the reading (b) precedent for `ABC-208`.
- **History:**
  - `git merge-base --is-ancestor b5c67ab7 53b67d53` holds;
  - `git log b5c67ab7..53b67d53 -- src data tools package.json` is empty.
- **Board:** Ready 0/8 and In Design 0/2. No board edit was made.
- **The page diff:** 1 file, +73/−2. A grep of the diff for personal paths, usernames and hostnames counts 0.
