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
