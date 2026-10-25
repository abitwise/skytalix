---
subtask: security-nfr-lic-pub-1
role: security-nfr
ref: .grugops/context/security-nfr-lic-pub-1/
branch: new grugops/security-nfr-lic-pub-1 from main, worktree ../wt-security-nfr-lic-pub-1
width: 2 of 3 (beside arch-design-ABC-207; records only, no timing)
---

# LIC-PUB-1 / OQ-214-4 dispositions at the tip; EPIC-008 path redaction; stale NFR row

## Do
- Per Orchestrator `orch-2026-10-25x/…26f4e001` and `orch-2026-10-25w/…ccf209d9`:
  1. Re-read `LIC-PUB-1` and `OQ-214-4` against `main` after ABC-215 merged at `5c91e2e4`, which ended the CC BY-SA carve-out. Record the evidence and dispose of `OQ-214-4`. For the owner-held `LIC-PUB-1`, write a recommended disposition the owner can close.
  2. Redact, at the tip only, the absolute host paths in EPIC-008 § Dependencies. Replace the owner's home-directory path to cutechess-cli with a neutral placeholder; keep the version and sha256. Treat the system-package Stockfish path the same way if ADR-0049 d4 calls for it. This applies ADR-0049 d4 forward to a live page. Dated history and sealed notes are not touched, and history is not rewritten (SEC-PUB-1 accepted).
  3. If `plans/nfr-catalog.md` still has the stale "no bin, ten modules" row noted after SEC-212-b, correct it with a dated line.

## Fences
- Only your worktree and `<scratchpad>/sec-lic/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only. Copy no personal path, username or hostname into any record.

## Publish
- Commit on your branch. Seal notes (task security-nfr-lic-pub-1). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Done by Security/NFR, 2026-10-25. Branch `grugops/security-nfr-lic-pub-1` from `main` `cc30eebe`; records commit `794d5c04`, note commit `f9da57df` (tip). Not pushed, not merged. Nothing run: no npm, vitest, build or timing (git, file reads and `git grep` only; local refs only, no network).

- **OQ-214-4: DISPOSED, moot at `main`'s tip.** Since `ABC-215` (`5c91e2e4`), `NOTICE` has no CC BY-SA section, the `src/evaluate.ts` header claims the values as this project's own and rule-made, and the README no longer names CC BY-SA. The tree grep finds 0 CC BY-SA hits outside records. QE `A2`/`A3` are MET. Whether the carve-out met § 4(b) for the versions that carried it is a history question and stays `UNKNOWN - verify` (legal), under LIC-PUB-1's residual.
- **LIC-PUB-1 (MEDIUM, owner-owned): recommended for the owner to close.** Suggested words: *"LIC-PUB-1 closed at the tip; history not rewritten."* Part 1 (the licence) closed 2026-10-24 (`ADR-0048` plus `ABC-214` `59f50717`, `…04b04305`). Part 2 (the Adaptation remainder kept open by `ADR-0048` § Consequences and `ABC-215`) ended at `5c91e2e4`. The 2026-10-24 "CLOSED" record and the later "owner-held" framing now give the same state. Nothing is reopened, and no sealed note is edited.
  - Residuals, INFO, owner Olger Oeselg:
    1. public history keeps the earlier versions, 3 without attribution, then the carve-out versions; no rewrite;
    2. per local refs, the public tip (last push `3497aad2`) still carries the `ABC-214` carve-out until the owner pushes;
    3. 164 of 391 value cells equal the earlier values because their rules produce them (provenance, not a licence ruling);
    4. every legal reading stays `UNKNOWN - verify`.
  - Re-open trigger: third-party values brought into `src/` again, or legal advice that the coincident cells or the history need action.
- **EPIC-008 § Dependencies redacted at the tip:** 1 personal path (class: absolute home-directory path to the `cutechess-cli` build) → placeholder `<local build dir>/cutechess-cli`. Version and sha256 are unchanged, and a dated bracket says why (`ADR-0049` decision 4, applied forward). The page's personal-path count is now 0. **Stockfish's system-package path is kept:** it is none of d4's classes and is `SEC-PUB-4` host-fingerprint (LOW, no remedy needed). Dated history, sealed notes and the board are untouched. No history rewrite.
- **`plans/nfr-catalog.md`:** the stale line "no `bin`, ten modules with no entry point" (`…f2ef08e0`) is dated in place. Re-read at `cc30eebe`: 1 `bin` entry, 46 production modules, 2 entry points; the cell's own grep gives 0 code matches (5 hits, all comment prose). The conclusion holds and no bound moved. One `_Updated` line was added; no `NFR-0xx` row changed.
- **Diff:** `794d5c04` changes 2 files, 6 lines added and 3 removed (EPIC-008 +4/−2, the catalog +2/−1). Notes plus index add 181 lines. Class scan of every added line (personal paths, account name, hostnames, private IPv4, time-zone offset): 0 hits.
- **Notes** (sealed with the sanctioned writer; index rendered): `.grugops/context/security-nfr-lic-pub-1/notes/20261025T122908Z-security-nfr-observation-8127705e.md` (licence evidence), `…/20261025T122917Z-security-nfr-observation-5a234bae.md` (records edited), `…/20261025T122918Z-security-nfr-decision-7522161b.md` (dispositions, PASS_WITH_RISKS).
- **Result: PASS_WITH_RISKS.** 0 HIGH and 0 MEDIUM newly raised; nothing blocks (`block_on: high`). ASVS L1: no requirement in scope.
- **Owed:** the owner's LIC-PUB-1 closing word, and the push, which is his. The Orchestrator places the trace row and board line, and merges.
- **Not touched:** board, `plans/traceability.md`, `src/`, tickets, ADRs, sealed notes.

Trace row (10 cells) for the Orchestrator to place in `plans/traceability.md`:

| LIC-PUB-1 / OQ-214-4 (security-nfr-lic-pub-1) | Security/NFR at main's tip after ABC-215 (5c91e2e4): OQ-214-4 DISPOSED (moot at the tip: no carve-out, values rule-made); LIC-PUB-1 close recommended to the owner ("closed at the tip; history not rewritten"), residuals INFO; EPIC-008 § Dependencies personal path → placeholder (ADR-0049 d4, tip only); stale NFR availability row ("no bin, ten modules") dated | EPIC-008 | licence | none moves (nfr.availability unchanged; no NFR-0xx row changed); ADR-0048 d7/d8; ADR-0049 d4; ASVS L1 none in scope | `grugops/security-nfr-lic-pub-1` @ `f9da57df` (records `794d5c04`, from `cc30eebe`)<br>plans/epics/EPIC-008-…md; plans/nfr-catalog.md<br>notes …8127705e, …5a234bae, …7522161b | git diff numstat 2 files +6/−3; NOTICE/evaluate.ts/README/LICENSE/package.json read at cc30eebe; tree grep 0 CC BY-SA; class scan 0 | — | — | PASS_WITH_RISKS; LIC-PUB-1 awaits the owner's closing word |
