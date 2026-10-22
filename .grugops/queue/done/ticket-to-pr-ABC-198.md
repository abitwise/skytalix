---
subtask: ticket-to-pr-ABC-198
role: software-engineer
tickets: [ABC-198]
branch: grugops/ABC-198 (from main @ the main tip at your start); worktree ../wt-ABC-198
ref: .grugops/context/ticket-to-pr-ABC-198/
width: 3 (beside qe-ABC-178b and bapm-rule-QE-189)
---

# SE: ABC-198. In-range lock bump of the vitest family (4.1.12) and vite (7.3.7) clears the AR-1 drift; one test literal re-pinned after the bump re-run list. `package.json` unchanged

## Read first
- The ticket page `plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md`: every criterion (A1–A8), § Scope (the exact command), § Out of scope, § Test notes, and the vite fallback.
- BA/PM `.grugops/context/bapm-cut-AR-1-drift/notes/` (`…1a123d24` ruling, `…63b88f5d` readings); Security/NFR `security-nfr-ABC-190` (`…140008ff`, `…56bf0b02`); Orchestrator `…e4ef897b`; ABC-192's page and `BUMP_RERUN_LIST` in `src/cli.test.ts`; `AGENTS.md` (`RISK-ABC143-01`, the vitest notes).

## Do
- Create the worktree `../wt-ABC-198` on `grugops/ABC-198` from the current `main`. Install its own `node_modules` with `npm ci --ignore-scripts` **inside the worktree**. Never symlink main's `node_modules` here (the bump changes it), and never run npm in main's checkout.
- Run the page's command exactly. The lock diff must match A1 (10 packages, numstat `53 53`, `package.json` byte-equal). If it doesn't, stop and report with the diff.
- **A4 red first:** at the bumped lock, ABC-192's A2 row goes red on `CAPTURE_ARM_READ_ON_VITEST`. Run `BUMP_RERUN_LIST` items (1)–(3) on 4.1.12 and record each result. Only then re-pin the literal. If any item fails, stop and report.
- A2: the audit set pair by pair before and after (`npm audit --json`), with nothing added. A3: `npm ci` clean on a fresh clone of the tip. A6: `RISK-ABC143-01`, meaning the reporter writes `success: true` and a planted red run writes `false` (scratch copy).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success with test counts and names equal to base (60 / 1995); skip-count capture as spelled → `test-skip-integrity.js`; `CLI_DEEP`, `UCI_DEEP`, `PERFT_DEEP`. Heap 128 multi-file, 400 one-file. **No timing claims.**
- UAT waiver form must print nothing (the only `src/` line is in a `.test.ts` file).
- Vite fallback exactly as the page says: if gates go red only with vite, drop vite and hand back with the measurement.

## Fences
- Only `package-lock.json` and the one literal in `src/cli.test.ts` (plus your notes in `../wt-ABC-198/.grugops/context/ticket-to-pr-ABC-198/`, the context root to pass). Never `package.json`, `AGENTS.md`, `plans/`, `memory-bank/`, `tools/`, git config, main's `node_modules`, other worktrees. Commit on `grugops/ABC-198` only. Never push, merge or `--force`. Temp files in your scratch area, not `/tmp`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-198`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/ticket-to-pr-ABC-198.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**Delivered.** Branch `grugops/ABC-198` in worktree `../wt-ABC-198`, tip **`ef1d5ebc`**, from `main` `4952425a`. Three commits: `a42f4bbb` (lock), `d1a175f5` (literal and readings note) and `ef1d5ebc` (notes). Not pushed, not merged. No timing was taken. **The vite fallback was not needed.**

Notes are sealed via `admitAndAppend` and read back 4/4 by `readContext`, in `../wt-ABC-198/.grugops/context/ticket-to-pr-ABC-198/notes/`:
- observation `…59297619`: `BUMP_RERUN_LIST` (1)–(3) readings, cited by `d1a175f5`;
- observation `…f4334765`: A1/A2/A3;
- observation `…240b63df`: A4/A5/A6;
- decision `…7e9699c3`.

### Per criterion
| crit | result |
|---|---|
| A1 | **MET**. numstat `53 53 package-lock.json`, and `package.json` byte-equal. 123 entries at both ends, exactly 10 differ: 9 `vitest`/`@vitest/*` move 4.1.11 → 4.1.12 and `vite` moves 7.3.6 → 7.3.7. 20 `"version"` lines. The rest are `4.1.11` → `4.1.12` pins plus the `browser-webdriverio` `^4.1.11` peer. All `resolved` are on registry.npmjs.org. The sha prefix `5d48a904…` equals BA/PM V5 |
| A2 | **MET** (builder reading; QE re-reads). Base has 13 rows, `{mod 4, high 3, total 7}`. Head has 3: nanoid GHSA-2v37, postcss GHSA-fxqj, source-map-js GHSA-68fv, `{mod 1, high 2, total 3}`. Removed: exactly the 7 pairs and 3 via rows. Added: none, so no drift. `--omit=dev` 0 |
| A3 | **MET**. In a fresh clone: `npm ci` rc 0 with an empty status. `npm ls` shows only 4.1.12/4.1.12/4.1.12/7.3.7. Re-running the command plus a plain lock-only install gives no diff |
| A4 | **MET**. Red first: 1/1995 failed (ABC-192 A2, printing `BUMP_RERUN_LIST`). (1)–(3) PASS on 4.1.12. Then `src/ tools/` numstat is only `1 1 src/cli.test.ts` (the literal) |
| A5 | **MET**. lint/typecheck/build 0. `npm test` 60/1995, names byte-equal to base. Skip-count capture 0 → `No findings.`. CLI_DEEP 11/11, UCI_DEEP 5/5, PERFT_DEEP 32/32. The waiver form prints nothing |
| A6 | **MET**. `last-run.json` mtime is after the start, success true, 60/1995. In a scratch clone, a planted inverted assertion gives `success: false`, exit 1. All seven header rows were re-run |
| A7 | owed: QE |
| A8 | owed: Security/NFR |

### Flag for QE
On the reporter's exit-code-only row (`--coverage --coverage.thresholds.lines=100`), 1 of 5 head runs had 1 failed test, `src/engine.test.ts` `ABC-170 A2`. Its message was lost, so the cause is `UNKNOWN - verify`. The other 4 head runs and 3 of 3 base runs met every field. The reporter still read the run truthfully. See decision `…7e9699c3` item 5.

### Trace row
| ABC-198 (ticket-to-pr-ABC-198) | in-range lock bump: vitest family 4.1.11 → 4.1.12 (9 pkgs) and vite 7.3.6 → 7.3.7 via the page command; CAPTURE_ARM_READ_ON_VITEST re-pinned 4.1.12 after BUMP_RERUN_LIST (1)–(3) PASS; package.json unchanged | — | — | AR-1; RISK-ABC143-01; RISK-ABC173-STATE; ABC-192; GHSA-qxg6/-xp26 (mocker), GHSA-9jrq/-rq7h/-587h/-698v/-r825 (vite) cleared | grugops/ABC-198 @ ef1d5ebc (lock a42f4bbb, literal d1a175f5)<br>package-lock.json (53/53), src/cli.test.ts (1/1), .grugops/context/ticket-to-pr-ABC-198/notes/ (4) | lint/typecheck/build 0; npm test 60/1995 = base (names equal), success true; skips 0, No findings.; CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32 green; red-first 1/1995 (ABC-192 A2); audit 13 → 3 rows, nothing added; --omit=dev 0 | UAT waived (0 production lines; waiver form empty; not a signature) | — | In Development → In Review (QE A1–A7, Security/NFR A8 owed) |
