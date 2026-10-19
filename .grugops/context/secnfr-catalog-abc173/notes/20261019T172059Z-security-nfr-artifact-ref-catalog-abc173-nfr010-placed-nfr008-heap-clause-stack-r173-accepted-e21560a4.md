---
id: 20261019T172059Z-security-nfr-artifact-ref-catalog-abc173-nfr010-placed-nfr008-heap-clause-stack-r173-accepted-e21560a4
kind: artifact-ref
by: security-nfr
task: secnfr-catalog-abc173
at: 2026-10-19T17:20:59Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - NFR-010
  - NFR-008
  - R-173-1
  - R-173-2
  - QE-173-g
  - ADR-0008
  - ADR-0035
  - plans/nfr-catalog.md
  - .grugops/queue/pending/secnfr-catalog-abc173.md
  - .grugops/context/secnfr-ABC-173/notes/20261019T151900Z-security-nfr-observation-abc173-nfr010-row-and-nfr008-heap-clause-text-bec09225.md
  - .grugops/context/secnfr-ABC-173/notes/20261019T152000Z-security-nfr-observation-abc173-a9-and-n8-lane-owed-two-windows-f6b9071f.md
  - .grugops/context/qe-ABC-173/notes/20261019T145000Z-qe-e2e-observation-abc173-a9-and-n8-lane-owed-c9e4a7d1.md
  - .grugops/context/wave-2026-09-25/notes/20261019T183000Z-orchestrator-decision-owner-word-abc171-accepted-r173-sec1731-5c8d2f71.md
supersedes:
---

# `plans/nfr-catalog.md` after `ABC-173` merged (`03859f2e`): `NFR-010` placed, `NFR-008` heap clause and stack correction inserted, `R-173-1` / `R-173-2` recorded as accepted on the owner's word

Hand-authored and unsealed: `scripts/context-io.*` is absent from this install. Branch
`grugops/secnfr-catalog-abc173` from `ad71aec4`. Records only. Nothing was run or timed.

**What changed in `plans/nfr-catalog.md`.**
1. **`NFR-010` row added** after `NFR-009`. It is `…bec09225` § A, byte for byte: extracted from the note's code
   block by script, and `grep -cF` of the extracted text reads 1 in the file.
2. **`NFR-008` heap clause inserted** at the place § B names: straight after the sentence ending "… / Node v26.11.0 /
   vitest 3.2.7. v24.12.0 is no longer installed on this machine; figures taken on it are history.". It is § B, byte
   for byte.
3. **Stack correction:** one dated, forward-only sentence follows the heap clause. It reads "live stack Node v26.11.1
   / vitest 4.1.11". The 2026-10-10 sentence is kept as written, and no earlier figure is re-labelled.
   - Read today from `node --version` (v26.11.1), `node_modules/vitest/package.json` (4.1.11, pinned `~4.1.11`),
     `sysctl` (Mac15,13, 8 cores) and `uname` (Darwin 25.5.0 arm64).
   - When v26.11.1 replaced v26.11.0 on this machine is `UNKNOWN - verify`.
4. **`R-173-1` (`A9` owed) and `R-173-2` (`N8-LANE` owed)** are recorded in a new section at the end of the file.
   - Both are LOW. Owner: Olger Oeselg, on his word *"Yes, merge owed (Recommended)"* (`…5c8d2f71`).
   - Each has its arms tabled: `A9` uses `H` / `H2` = `git archive 9c97dd23`. `N8-LANE` uses `B` / `T` =
     `git archive 68bbf33f` and `H` = `git archive 9c97dd23`.
   - Discharge: the first admissible quiet-window reading. The Orchestrator takes both.
5. **One `_Updated:` line** added at the top.

**Byte-identical:** `NFR-001`–`NFR-007` and `NFR-009`, each row sha256-hashed before and after. `NFR-008` changed
only by insertion: removing the inserted text gives back the old row exactly. Every table row has 5 cells.

**Observations for the router.**
- **`R-167-2` and `R-171-1` are not in this catalog** (`grep` 0 for each). So the brief's "same form, if those are in
  the catalog" did not apply. Both new risks use the catalog's own `ACCEPTED RISK` blockquote form (`AR-NFR004-A`,
  `AR-N8LANE-078`). This hop did not record `R-167-2` or `R-171-1`: that was outside the brief. The Orchestrator
  routes it.
- **`NFR-010`'s "MET at `9c97dd23`" describes the branch tip.** At `03859f2e`, the guard, `run-bounded.js`,
  `package.json` and `vitest.config.ts` are byte-identical (`git diff` empty). The tree adds `ABC-171`'s
  `src/uci-session*.ts`. So the as-spelled pass/OOM on the combined tree is `QE-173-g`, which was in progress on
  `main` at this hop and is not recorded here: `UNKNOWN - verify`.
- **The owner-word note `…5c8d2f71` is stamped 18:30Z.** Its commit `f6e69877` is 17:15:33Z (20:15:33 +0300). The
  note's timestamp is later than the commit that wrote it. That is a bookkeeping inconsistency, and it does not
  change the word.

**Not touched:** `src/`, `tools/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, every ticket page.
Nothing was pushed or merged.
