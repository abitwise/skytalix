---
subtask: secnfr-catalog-abc173
role: security-nfr
tickets: [ABC-173]
branch: grugops/secnfr-catalog-abc173 @ 2ce60fde (from ad71aec4); worktree ../wt-secnfr-catalog-abc173
ref: .grugops/context/secnfr-catalog-abc173/notes/20261019T172059Z-security-nfr-artifact-ref-catalog-abc173-nfr010-placed-nfr008-heap-clause-stack-r173-accepted-e21560a4.md
done_at: 2026-10-19T17:22:00Z
result: DONE (records only). NFR-010 placed verbatim; NFR-008 heap clause inserted verbatim at the named place; dated forward-only stack correction to Node v26.11.1 / vitest 4.1.11; R-173-1 and R-173-2 recorded as accepted on the owner's word, with their arms. NFR-001..007 and NFR-009 byte-identical. Nothing run or timed, pushed or merged.
---

# Security/NFR catalog edit for ABC-173

**Commit:** `2ce60fde` on `grugops/secnfr-catalog-abc173`. 2 files changed: `plans/nfr-catalog.md` (+96 / −1)
and one note (+68). The "−1" is the `NFR-008` line, which is rewritten as itself plus the inserted text.

## What changed in `plans/nfr-catalog.md`
1. **`NFR-010` row** is added after `NFR-009`. It is `secnfr-ABC-173` `…bec09225` § A, byte for byte: extracted by
   script from the note's code block, and `grep -cF` reads 1.
2. **`NFR-008` heap clause** (§ B, byte for byte) is inserted straight after "… / Node v26.11.0 / vitest 3.2.7.
   v24.12.0 is no longer installed on this machine; figures taken on it are history.".
3. **Stack correction:** one dated, forward-only sentence follows the clause. It reads "live stack Mac15,13 / 8 cores
   / Darwin 25.5.0 arm64 / Node v26.11.1 / vitest 4.1.11".
   - Read from `node --version`, `node_modules/vitest/package.json` (pinned `~4.1.11`), `sysctl` and `uname`.
   - The 2026-10-10 sentence is kept, and no earlier figure is re-labelled.
   - When v26.11.1 replaced v26.11.0 on this machine is `UNKNOWN - verify`.
4. **New closing section, "`ABC-173` MERGED (`03859f2e`)".** It carries `ACCEPTED RISK R-173-1` (`A9` owed) and
   `ACCEPTED RISK R-173-2` (`N8-LANE` owed).
   - Both are LOW. Owner: Olger Oeselg, *"Yes, merge owed (Recommended)"* (`…5c8d2f71`).
   - Each has an arms table:
     - `A9`: `H` / `H2` = `git archive 9c97dd23`, `npm test` as spelled, `lane173.mjs` with `CONDS=H,H2`, 9 rounds,
       `readout-a9.py`.
     - `N8-LANE`: `B` / `T` = `git archive 68bbf33f` with the unprefixed command, `H` = `git archive 9c97dd23` with
       the `=128` prefix, the 5-file set, 650 ms.
   - The head arms must be re-archived at `9c97dd23`.
   - The Orchestrator takes both readings in the first quiet window.
5. **One `_Updated:` line** is added at the top.

**Checks:** `NFR-001`–`NFR-007` and `NFR-009` have the same sha256 before and after. The `NFR-008` change is a pure
insertion. Every table row has 5 cells.

## For the router
- **`R-167-2` and `R-171-1` are not in the catalog** (0 hits each). Both new risks use the catalog's own
  `ACCEPTED RISK` form (`AR-NFR004-A`, `AR-N8LANE-078`). Recording `R-167-2` and `R-171-1` was outside this brief,
  and they are not recorded.
- **`NFR-010`'s "MET at `9c97dd23`" is the branch tip.** At `03859f2e`, the guard and its command files are
  byte-identical. `ABC-171`'s `src/` is added, so the combined tree's pass/OOM is `QE-173-g` (in progress on `main`,
  not recorded): `UNKNOWN - verify`.
- **The owner-word note `…5c8d2f71` is stamped 18:30Z, but its commit `f6e69877` is 17:15:33Z.** It is a bookkeeping
  inconsistency only.

## Proposed trace row (not written; `plans/traceability.md` is fenced from this hop)
| ABC-173 (Security/NFR catalog) | NFR-010 placed verbatim (…bec09225 §A); NFR-008 heap clause verbatim (§B) + forward-only stack correction Node v26.11.1 / vitest 4.1.11; R-173-1 (A9 owed) and R-173-2 (N8-LANE owed) accepted LOW on the owner's word …5c8d2f71, arms 68bbf33f (B/T) / 9c97dd23 (H); secnfr-catalog-abc173 | — | — | NFR-010 (placed, binds from 03859f2e), NFR-008 (heap clause; A9 OWED → R-173-1), N8-LANE (OWED → R-173-2) | grugops/secnfr-catalog-abc173 @ 2ce60fde; plans/nfr-catalog.md only; 0 production lines | nothing run or timed; NFR-001..007, NFR-009 sha256 identical | n/a (records only) | — | R-173-1/-2 open until first quiet-window reading; QE-173-g before Done; note …e21560a4 |

## Fences kept
I touched no `src/`, `tools/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or ticket page. I ran no
vitest and took no timing. I wrote nothing to main's working tree except these two files. Nothing was pushed or
merged.
