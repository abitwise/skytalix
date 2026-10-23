---
subtask: bapm-cut-levels-6-7
role: ba-pm
ticket: plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
ref: .grugops/context/bapm-cut-levels-6-7/
width: next free slot (records only)
---

# Record EPIC-008 Q1/Q2 and cut difficulty levels 6 (5 s) and 7 (up to 30 s)

## Do
- On EPIC-008 (dated): Q1 answered (+100, interval above 0); Q2 answered (whenever idle, one at a time, AC, alone). Re-read gate G9 as "levels 1–5 byte-identical".
- Cut the levels 6–7 ticket (next free ABC id; which epic it belongs to is yours to rule — EPIC-008 or EPIC-004's levels line). Settle testably: budgets (6 = 5 000 ms; 7 = up to 30 000 ms — "up to" means what: fixed 30 s, or stop early when the search is clearly done? rule it), blunder rate 0, every surface (CLI `--difficulty`, the startup question, UCI `Skill Level` max, help/usage text, AGENTS.md/runbook mentions), default stays 5.
- **Bounds the owner moved (name them exactly):** NFR-004's "hard ceiling 5 s at any difficulty" → per-level ceilings (propose the text, e.g. ceiling = budget + margin), `HARD_CEILING_MS`, the ABC-204 harness `timemargin` rule (5000 − budget), NFR-005 if touched. The NFR text and an ADR-0045 amendment go to the owner as PROPOSED — mark them for the Orchestrator.
- Interactions: test-lane cost (virtual clock?), NFR-008, UCI GUIs that time out on 30 s, ABC-204/EPIC-008 readings (level 5 only).
- DoR, size, priority.
- **Also cut (separate XS ticket, EPIC-006):** the ABC-203 follow-up per Security/NFR `…eaaa1133` §5: guard the cleanup `unlinkSync` in `src/pgn-file.ts` (report the first error code; `AR-203-UNLINK`), plus one fault-injection child pinning "no partial file" (QE-203-b) and the double fault (QE-203-c), optionally the CLI-level A10 (QE-203-a). Rule its spawn cost against N8-SPAWN (SEC-203-a is yours). QE's resolve-hook reproduction (`.grugops/context/qe-ABC-203/raw/` on main once merged) is the red test.

## Fences
- Work on `grugops/bapm-cut-levels-6-7` (worktree from `main`). Only the EPIC-008 page, the new ticket page, an epic page if you place it elsewhere, and your notes. No `src/`, ADRs, `plans/nfr-catalog.md`, board, trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-lvl/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-levels-6-7`), `at` from `date -u`, with a `kind: decision`. Write `## Result` (board card line) plus 10-cell trace rows into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Done 2026-10-24 by BA/PM.** Branch `grugops/bapm-cut-levels-6-7` @ `d58811d4` (worktree `../wt-bapm-cut-levels-6-7`,
from `main` `6c0ab29e`). Records only. Not merged, not pushed. Notes (`bapm-cut-levels-6-7`):
observation `20261023T213354Z-ba-pm-observation-78d4532b`, decision `20261023T213402Z-ba-pm-decision-44bee405`.

**What changed:**
- **`EPIC-008`:**
  - Q1 ANSWERED: M1 = point estimate ≥ +100 Elo AND interval above 0.
  - Q2 ANSWERED: whenever idle, alone, on AC.
  - `G9` re-read as levels 1–5 byte-identical (plus level 5's ceiling of 5 000 ms). `G5` re-read as 5 s at levels
    1–5.
  - `ABC-204`'s `timemargin` is unchanged at level 5.
  - Levels 6–7 are out of this epic.
- **`ABC-212`** (`EPIC-004`, post-close addition): levels 6 = 5 000/0 and 7 = 30 000/0 at every surface, default 5.
  "Up to 30 s" is ruled as **spends 30 s** (no early stop; OQ-212-2).
- **`ABC-213`** (`EPIC-006`): guard the cleanup unlink, report the first code, and pin `QE-203-b` and `-c`.
  `QE-203-a` is not cut. `N8-SPAWN` charge 0. `SEC-203-a` is agreed.
- `EPIC-004` and `EPIC-006`: one dated line each.

**For the Orchestrator: PROPOSED texts to put to the owner** (on the `ABC-212` page, § Owner decisions owed):
- **OD-212-1, `NFR-004` (blocks the `ABC-212` SE pull):** *"Engine returns a move in ≤ 3 s at default difficulty
  (level 5); hard ceiling per level: 5 s at levels 1–5, 7 s at level 6, 32 s at level 7 (a level above 5 gets its
  budget + 2 s)."* Options: (b) + 0.5 s; (c) one 32 s ceiling.
- **OD-212-2:** the `ADR-0045` amendment points (D1, D2, D3, D4, D6, Consequences, Rollback). Architect/Design writes
  the text at `ABC-212`'s design hop.
- **Non-blocking, each with a default:** OQ-212-1 (level 6 ≈ level 5: +0.36 ply, 2/50 moves differ), OQ-212-2 (early
  stop), OQ-212-3 (UCI GUIs at 6–7), OQ-212-4 (ordering verdict).

**For the Orchestrator: also found:** `ABC-203`'s code (`5e23e249`) is already on `main` (through the records merge
`d4b8996c`), while the board holds it In Security/NFR with `N8-LANE` "owed before merge".

**Routing:**
- `ABC-212`: Ready → In Design (Architect/Design: the `ADR-0045` amendment PROPOSED, the `ADR-0044` D4/D5/D11 folds,
  the clamp shape, a D5 ruling) → the owner's acceptance → SE.
- `ABC-213`: Ready → In Design (one question: the rig under `ADR-0015`, recommended (a)) → SE → QE → In Security/NFR
  (Ruling 2). Pull it after `qe-timing-ABC-203`.
- Ready count +2.
- **Next free id: `ABC-214`.**

**Not touched:** `src/`, the ADRs, `plans/nfr-catalog.md`, `plans/board.md`, `plans/traceability.md`, the `ABC-203`
and `ABC-204` pages. In main's checkout only this record and its claim moved, and both are uncommitted.

### Board card lines

`- [ABC-212] Two stronger levels: 6 thinks 5 s and 7 thinks 30 s a move, at every surface, and the default stays 5  (owner: software-engineer, after Architect/Design (ADR-0045 amendment + ADR-0044 D4/D5/D11 folds) and the owner's acceptance of the NFR-004 text, size: M, priority: P2, epic: EPIC-004 (post-close addition), since: 2026-10-24, DoR 10/10; cut in \`bapm-cut-levels-6-7\` (\`…44bee405\`). Owner word \`…e44d2903\`. LEVELS 6 = 5 000/0, 7 = 30 000/0, HARDEST 7, default 5; "up to 30 s" = spends 30 s (no early stop). Flag/usage/question 1–7, Skill Level max 7, bare go = level budget. L6 5.0–7.0 s 30/30, L7 30–32 s 10/10 (ENGINE_DEEP); L1–5 identical 50/50; L7 depth ≥ L5 + 1. PROPOSED to owner: NFR-004 per-level ceiling (5/7/32 s). D5 worker trigger fires; UCI split pre-registered. 0 files, 0 spawns)`

`- [ABC-213] A failed PGN save reports its first error code even when the cleanup also fails, and a single fault leaves no partial file  (owner: software-engineer, after one Architect/Design question (rig under ADR-0015), size: XS, priority: P3, epic: EPIC-006, since: 2026-10-24, DoR 10/10; cut in \`bapm-cut-levels-6-7\` (\`…44bee405\`) from Security/NFR \`…eaaa1133\` § 5. Guard the cleanup unlinkSync in src/pgn-file.ts; double fault → { ok: false, first code }; single fault → 0 files; non-errno still rethrown; plants X1/X3/X4/X5; QE unlinkfault.mjs red→green (exit 70 → 0, \`PGN not saved: EFBIG\`). Closes AR-203-UNLINK + AR-203-LANEGAP (b); QE-203-a stays residual. N8-SPAWN 0. ADR-0036 Ruling 2 → In Security/NFR. Pull after qe-timing-ABC-203)`

### Trace rows (10 cells, header order)

| EPIC-008 (bapm-cut-levels-6-7) | Owner answers recorded: Q1 M1 ≥ +100 Elo point estimate AND interval above 0; Q2 readings whenever idle, alone, on AC. G9 re-read: levels 1–5 byte-identical (LEVELS[1..5], DEFAULT_LEVEL 5, level 5 ceiling 5 000 ms); G5: 5 s at levels 1–5 | EPIC-008 | — | no bound moved by this epic; ABC-204 timemargin unchanged at level 5 | grugops/bapm-cut-levels-6-7 @ d58811d4 (records only)<br>plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md | — | — | — | records updated |
| ABC-212 (bapm-cut-levels-6-7) | Two stronger levels: 6 thinks 5 s and 7 thinks 30 s a move, at every surface, and the default stays 5 | EPIC-004 | difficulty levels | NFR-004 MOVES (owner; PROPOSED per-level ceiling 5 s L1–5 / 7 s L6 / 32 s L7); NFR-009 re-read at 30 s (≤ 16 MiB, growth ≤ 1 MiB); NFR-005 untouched; NFR-008 0 files / 0 spawns / ≤ 30 readings; ADR-0045 amendment PROPOSED; ADR-0044 D4/D5/D11 folds | grugops/bapm-cut-levels-6-7 @ d58811d4 (records only)<br>plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md | — | owed (QE verdict signs) | — | cut → Ready (M, P2, DoR 10/10) |
| ABC-213 (bapm-cut-levels-6-7) | A failed PGN save reports its first error code even when the cleanup also fails, and a single fault leaves no partial file | EPIC-006 | PGN export | ADR-0047 D4/D5; ADR-0036 Ruling 2 (In Security/NFR); N8-SPAWN 0; writer child CPU +≤ 50 ms else N8-LANE; closes AR-203-UNLINK, AR-203-LANEGAP (b); SEC-203-a agreed | grugops/bapm-cut-levels-6-7 @ d58811d4 (records only)<br>plans/tickets/ABC-213-a-failed-pgn-save-reports-its-first-error-code-even-when-the-cleanup-also-fails-and-leaves-no-partial-file.md | — | owed (QE verdict signs) | — | cut → Ready (XS, P3, DoR 10/10) |
