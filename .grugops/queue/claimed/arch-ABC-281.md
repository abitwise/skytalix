---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T03:07:56Z
subtask: arch-ABC-281
role: architect-design
ref: .grugops/context/arch-ABC-281/
branch: new grugops/arch-ABC-281 from main — worktree .claude/worktrees/arch-ABC-281
width: wrap EVERY run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. Small reads only (≤ 20 min); mutant probes on a scratch copy. Host paths only as placeholders.
---
# ABC-281 DoR row 11: one form per row (W / S / K)
Read plans/tickets/ABC-281*.md, BA/PM notes (…45c342fe, …d012231e), Security/NFR (…8a4fb936, …69126dca), ADR-0046 (T2b census, § Consequences kill parity), ADR-0050 (abort guard), ABC-248's ruling, QE-087-d.
For R1 (QE-208-a pos-6 → SEARCH_DEEP), R2 (ABC-230 A4 → ENGINE_DEEP), R3 (levels A9 → ENGINE_DEEP) pick W (move whole), S (slice: name the small default-lane remnant that keeps the kill) or K (keep). Say whether ADR-0046's option (b) binds for any W (if it does, that row becomes an owner question — prefer a form that doesn't need one if coverage holds). A small mutant read is allowed to confirm a slice keeps the kill. Write the dated line in ADR-0046 (and ADR-0050 if R1 touches its guard). Forecast the wall saving of your forms vs the 0.38 s probe.
## Fences
memory-bank/50-decisions, your records, scratch. No ticket edits (list the dated DoR line for BA/PM, or write it on the ticket only if the page's DoR row 11 says the Architect writes it). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-ABC-281, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
