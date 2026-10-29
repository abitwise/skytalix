---
subtask: arch-epic009-settings
role: architect-design
ref: .grugops/context/arch-epic009-settings/
branch: new grugops/arch-epic009-settings from main, worktree ../wt-arch-epic009-settings
---

# Design: two new settings, simple-tournament (fixed T, 22.5 s ceiling) and uci-clock-mode (60 s ceiling)

## Read
- The owner's words: `orch-2026-10-29g/…a67f71ac` (they govern). The EPIC-009 page and ABC-219..222, as merged.
- The SA time note `sa-ideas-verify/…1ccf0010`: the level table, the UCI `go` rule, the 32 s clamp at `src/engine.ts`,
  and what blocks a named level. The ADRs and NFRs it names: ADR-0044 (D4/D5), ADR-0045, NFR-004, and ADR-0002 where relevant.
- BA/PM `bapm-amend-epic009` runs in parallel and amends the tickets to these words. You rule the design; it cites you.

## Do
- **Rule the input form** for both settings. Levels 1–7 must stay unchanged and ordered weakest to strongest. The owner
  allows "maybe separate inputs". Options include:
  - a UCI option of its own (for example a combo or check), apart from the Skill Level spin;
  - a named value outside 1–7;
  - a CLI flag, if CLI parity is kept.
  - Pick one, with the trade-offs: GUI and cutechess ergonomics, the type surface (`Difficulty`, `LEVELS`), the tests,
    and the blunder path. Show the exact cutechess `option.<Name>=<value>` line that selects each setting.
- **simple-tournament:**
  - The hard ceiling is 22.5 s. A per-move budget T sits under it, so that 40 moves at 40/15 keep the closest call
    ≥ 500 ms.
  - Show the overhead model: the engine's stop latency, the 50 ms reserve, the margin in the UCI `go` rule. Propose T.
  - Rule how it interacts with the UCI `go` rule. Does a GUI clock cap it, or does it ignore `wtime`?
- **uci-clock-mode (later milestone, design now):**
  - The allocation rule (remaining ÷ movestogo, increment, a fallback without `movestogo`), the safety margin, a hard
    stop on the real remaining clock, and the 60 s per-move ceiling replacing the 32 s clamp for this mode only.
  - Stop/`isready` latency on a single thread with budgets up to 60 s: name the risk, and what NFR row and test it owes.
- **Write the ADR amendments** (dated addenda to ADR-0044 / ADR-0045, or a new ADR if cleaner), status PROPOSED, and
  name the NFR-004 change (the new ceilings). The owner accepts or declines the ADR.
- Name any security/NFR trigger.

## Fences
- Records only: `plans/adr/` (or the repo's ADR folder), your context. No `src/`, `tools/`, epic or ticket edits.
  Never push, force, amend or rebase. Never merge into main. No board edits. No games. Single-position probes are
  allowed, under 5 min of CPU, only when `ps` shows no cutechess.

## Publish
- Seal notes (task `arch-epic009-settings`) with `at` from `date -u`: the design decision (form, T, clock rule, ceilings)
  and the owner questions, if any. Commit on your branch. Write `## Result` plus a 10-cell trace row into this brief,
  then move it and its claim.md to done/.

## Result

- **Done 2026-10-29 by Architect/Design** on `grugops/arch-epic009-settings` @ `2550aa98` (worktree
  `../wt-arch-epic009-settings`, from `main` `b5df6cde`). Records only: one new ADR plus this task's context. No `src/`,
  `tools/`, epic, ticket, board or `plans/traceability.md` edit. No probe and no game (cutechess source read at tag
  `v1.5.1`; allocation arithmetic on a simulated clock, `raw/alloc.mjs`/`raw/alloc.txt`). Not pushed. Notes published with the plugin's
  sanctioned writer (`context-io.js` `appendNote`), because the `propose_note` MCP tool was not available in this session.
- **ADR:** `memory-bank/50-decisions/ADR-0052-two-uci-time-modes-simple-tournament-and-uci-clock-mode-arrive-as-one-timemode-combo-beside-skill-level-over-one-safe-clock-share.md`,
  status **proposed**, for the owner (OQ-0052-1). On acceptance, folds owed: `ADR-0044` D3/D4/D5/D11 and `ADR-0045` A3.
- **Form:** UCI `combo` `TimeMode`, with values `level` (the default, today's behaviour), `simple-tournament`, and
  `uci-clock-mode`. The last value is added only at its own build. In cutechess: `option.TimeMode=simple-tournament`
  and `option.TimeMode=uci-clock-mode`. `Skill Level`, `LEVELS`, `Difficulty` and the CLI are unchanged. In a mode,
  `Skill Level` is not read, and the mode plays rate 0.
- **Safe share (both modes):** `C = max(1, min((t − 1000 − m·100)/m + inc, t − 1100))`, where m is `movestogo`, or 20 without it.
- **simple-tournament:** T = 22 000 ms (ceiling 22 500 − 500). The budget is `min(T, C)` with a clock (`wtime` is
  not ignored), `min(movetime, T)` with `movetime`, and T with no clock. At 40/15, T binds every move: 18 760 ms left
  after move 40, and 97.9 % used.
- **uci-clock-mode:** the budget is `min(59 500, C)`. The 60 s ceiling moves `HARD_CEILING_MS` from 32 000 to 60 000
  at that build only; levels 1–7 are value-identical. At 40/15 the closest call is 1 069 ms and 99.9 % is used.
- **NFR-004 (proposed text, the owner's):** add "22.5 s in `simple-tournament`" now, and "60 s in `uci-clock-mode`;
  one clamp at the largest ceiling" at the clock-mode build. Also owed: an `NFR-009` re-read at 59.5 s, and an
  accepted-risk entry beside `NFR-011` for the mid-search `isready`/`stop` latency (≤ 22.5 s / ≤ 60 s).
- **Notes:** `…04fdc439` (observation), `…fa9e821e` (decision: the ruling), `…3b11f12e` (decision: owner question
  OQ-0052-1).

| Ticket | Title | Epic | Feature | NFRs | Code (PR/files) | Tests | UAT | Release | Status |
|---|---|---|---|---|---|---|---|---|---|
| arch-epic009-settings | Architect: EPIC-009's two settings designed. UCI `TimeMode` combo (`level` / `simple-tournament` / `uci-clock-mode`) beside an unchanged `Skill Level`. simple-tournament T = 22.0 s under the 22.5 s ceiling, capped by one safe clock share C (1 s reserve, 100 ms per move, hard stop). uci-clock-mode `min(59.5 s, C)`, with the one clamp moved 32 → 60 s at its own build. ADR-0052 PROPOSED, OQ-0052-1 to the owner | EPIC-009 (ABC-219..222) | — | NFR-004 (proposed text: 22.5 s / 60 s; owner's), NFR-009 (re-read at 59.5 s owed), NFR-011 (accepted-risk entry owed, no bound), NFR-008; ADR-0044 D3/D4/D5/D11 and ADR-0045 A3 folds on acceptance; RISK-EPIC009-01..03 | grugops/arch-epic009-settings @ 2550aa98 (records only): memory-bank/50-decisions/ADR-0052-…md; .grugops/context/arch-epic009-settings/notes/ (3) + raw/ (alloc.mjs, alloc.txt) | no gates run (records only); no probe, no game; arithmetic on a simulated clock only | | | Proposed (owner acceptance owed) |
