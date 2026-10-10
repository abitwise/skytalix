---
id: 20261010T104855Z-orchestrator-decision-owner-word-d7a1c3e5
kind: decision
by: orchestrator
at: 2026-10-10T10:48:55Z
verified_by: 
confidence: high
refs:
  - ABC-036
  - ABC-051
  - ABC-127
  - ABC-074
  - ABC-083
  - ADR-0029
  - ADR-0033
  - main
supersedes: 
---

Owner (Olger Oeselg), 2026-10-10, verbatim: "Accept ABC-036, ABC-051, ABC-127; accept ADR-0029, ADR-0033 ; Explain R4 ; R2 - keep depth 7 ; ABC-074 - rule the test out ; Worktree cleanup - yes"

1. UAT ACCEPTED: `ABC-036` (QE PASS_WITH_GAPS `06b03dc`), `ABC-051` (QE PASS_WITH_GAPS `6a1c6cd`, QE-051-a fixed `a9ed126`), `ABC-127` (QE PASS_WITH_GAPS `1087a42`, Security/NFR PASS_WITH_RISKS `4c09b5c`, Scribe A9 `f063ebce`). Merged into the wave `4a745a77`, `a154d306`, `d45a0261` (append-only trace conflicts, both sides kept). Merged-tip: lint 0, typecheck 0, build 0, unit 51 files / 1581 / 0 skips, skip integrity "No findings", `lane-inventory.js` "No findings", `PERFT_DEEP` 32/32, `PUZZLE_DEEP=1` 17/17 (58/62 = baseline, gating 21.5 s, load1 ~4–5). `AGENTS.md` 24 433 B / 24 576 cap. Local `main` fast-forwarded (no remote).
   Not answered, so kept as delivered: `ABC-036` count wording `legal moves: <n>`; the comment-only-diff waiver question (acceptance given directly on `ABC-051`; rule unchanged).
2. `ADR-0029` and `ADR-0033` ACCEPTED (status lines updated). Read literally: the owner named these two; `ADR-0030`, `ADR-0031`, `ADR-0032`, `ADR-0034` remain PROPOSED — confirmation asked.
3. R2 (`ABC-083`): KEEP depth 7 on kiwipete. Under proposed `ADR-0031`: if depth 7 is lost, mobility is cut first and depth re-read on king safety alone; if still lost, nothing ships and it returns to the owner.
4. `ABC-074` DROPPED — the non-M3 spike is ruled out; not delivered. Security/NFR owes the `plans/nfr-catalog.md` "Any non-M3 machine" open-item closure.
5. Worktree cleanup authorised — merged worktrees removed (branches kept); in-flight hops' worktrees kept.
6. R4 (`ABC-038`) — explanation requested; no decision yet.
