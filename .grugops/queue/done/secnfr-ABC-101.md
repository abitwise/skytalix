---
task: wave-2026-09-25
subtask: secnfr-ABC-101
role: security-nfr
ticket: plans/tickets/ABC-101-difficulty-selection.md
ref: .grugops/context/secnfr-ABC-101/
enqueued_by: orchestrator
enqueued_at: 2026-10-13T00:00:00Z
branch: grugops/secnfr-ABC-101 (off QE tip dee6562a; ABC-101 tip 98ea0a84; code ac8deab1; base main 3ea3e352)
---

# Subtask: ABC-101's `In Security/NFR` gate. You are the ONLY hop running (width 1).

QE `qe-ABC-101` is PASS_WITH_GAPS (verdict note `.grugops/context/qe-ABC-101/notes/…2fa04d14` on the QE branch; all criteria MET; N8-LANE MET on 3 sets; gaps LOW/INFO only). Delivered pair: `3ea3e352..98ea0a84`. Run the triggers the page names (§ Security / NFR triggers, and § Re-score — 2026-10-12 "Triggers"):
- **Input handling:** `--difficulty`'s parser and the level lookup — the `Object.hasOwn` forward rule (own keys only; `__proto__`, `constructor` and other prototype keys refused), the closed accepted set, ASVS **V2.2.2 [L1]** and the page's falsifiable firing threshold. Plant your own in scratch copies outside the repo (removed by exact path, counted before/after).
- **ADR-0036 clause (b)** on the delivered pair with `.grugops/context/design-F-072-1/probe/clause-b.mjs`, limbs 1–3, **plus Ruling 2 by hand with holders taken at BOTH base and head** (`AR-095-L1UNIT`; the empty-pathspec trap from `secnfr-ABC-095-s3`). Report the holder set at the tip (expected still 4) and every new edge (`cli.ts → level-seam.ts`, `level-seam.ts → levels.ts`).
- **The seed** (`Math.floor(Math.random() * 2 ** 32)` at the root, `ADR-0037` D3): confirm it is the only randomness source added, and that nothing reads it from input.
- **`AR-NFR004-A` re-read** (`plans/nfr-catalog.md` § NFR-004 and "THE LEVEL LAYER"): the first time a played move goes through a level. Rule whether it stands as written at the tip — level 3 equals the old construction by value (QE: `LEVELS[DEFAULT_LEVEL]` = `{3000, 0}`, 60/60 equivalence to `createLevel`), and levels 4/5 (4,000 / 4,500 ms) are now reachable by a player; say what the 5 s ceiling clause needs. A fresh timing reading is optional and only in a clean window (no foreign vitest, no `oeselg-labs/platform` process, logged before and after; wait budget 30 min, else NOT READ — never estimate). If you can rule by reading the code and the existing catalogue numbers, do that instead.
- **QE gaps for your view:** QE-101-a (LOW: the A8′ row cannot tell a seam that rebuilds the level on every move; QE tested a third-call fix) — say whether it bears on any security/NFR property; QE-101-d (repeated `--difficulty` takes the last value) — any security bearing?

## Fences
Own worktree: `git worktree add ../wt-secnfr-ABC-101 -b grugops/secnfr-ABC-101 dee6562a`; `node_modules` symlinked into the WORKTREE root only — never `ln -s` in the main checkout. Edit only `memory-bank/50-decisions/` (dated, append-only ADR blocks), `plans/nfr-catalog.md` only if a row or accepted risk moves (dated), the ticket page's § Security/NFR (append-only), your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, tests, `AGENTS.md` (24,576 B, at budget), `plans/board.md`. Never kill or touch other sessions' processes. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`, rebase. Never merge or push. If you change any committed file other than notes, run the gates before your last commit (`npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, `.test-results/last-run.json` success true, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`). End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/secnfr-ABC-101` in the main checkout, then FLAT `.grugops/queue/done/secnfr-ABC-101.md` and `.claim.md`, uncommitted; `rmdir` the claim dir.

Report: branch tip; result (PASS / PASS_WITH_RISKS / FAIL) with each item's reading; the `AR-NFR004-A` ruling; any required fix (who, before merge or not); accepted risks; anything owed by others.
