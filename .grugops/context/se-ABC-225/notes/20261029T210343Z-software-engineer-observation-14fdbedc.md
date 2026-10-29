---
id: 20261029T210343Z-software-engineer-observation-14fdbedc
kind: observation
by: software-engineer
at: 2026-10-29T21:03:43Z
verified_by: 
confidence: medium: the real-run behaviours listed are UNKNOWN - verify until QE's A5
refs:
  - ABC-225
  - EPIC-010
  - EPIC-008
  - tools/rating/rating.ts
  - tools/rating/pair.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 83751dc0
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - arch-epic008-rd/20261029T195200Z-architect-design-observation-9d172446
  - bapm-owner-words-b/20261029T204500Z-ba-pm-decision-2930f1bd
  - se-tools-rating-concurrency/20261029T081027Z-software-engineer-observation-58723347
  - ADR-0049
  - NFR-008
supersedes: 
seal: sha256:e7c95f0db73a1bffda5bf125dfb82f75acc43ba76ba2d7aca877e6066fec3844
---

# SE observation, se-ABC-225: what QE owes (A5, A6) and what to watch

The SE hop played no game. **A5 and A6 are QE's, ALONE, on AC, with the host quiet.**

## A5: the real 2-block smoke (40 games)
- Command: `node tools/rating/rating.ts rpair <base-sha> <candidate-sha> <out> --rounds 10` (E 1 910 and width 2 are the defaults). One block per build: base on openings 1–10, then candidate on 1–10. That is 40 games, ≈ 1 h at 44–46 games/h.
- Read: `nps.log` has 2 lines (one per block per build). `thermal.log` has ≥ 1 line per 10 s across `schedule.log`'s span. `summary.txt` has both builds, the pair and the pentanomial line.
- Scan every file under `<out>` but `clone-*` for host paths, the login name, the host name and email. The harness redacts paths, user and host. It does not redact email, and it never writes one.
- **Watch:** `artifacts.txt` carries the engine's `id author Olger Oeselg` line (it does for `r` too). That is the author's name, not the login name, and a case-sensitive scan does not hit it. QE decides whether it counts under A5.
- **Not proven offline (UNKNOWN - verify in A5):**
  - that cutechess-cli 1.5.1 honours `-openings … start=S` as the stub assumed. The coverage check makes any miss visible: wrong FENs are a cause, so the run reads UNRESOLVED.
  - that real `-debug all` logs give a value in every `nps.log` line.
  - that Tctl reads on this host through k10temp (`?` otherwise).
  - that a real block's printed Elo line matches the pooling formula (4 recorded 200/100-game lines match).

## A6: the cost
Report the smoke's wall from `schedule.log` (first start to last end), and the build time from `host.log` `before` to the first block start. Project the full pair (400 games) at width 2. The ticket's target is ≤ 10 h.

## Not this ticket's to decide
- Whether `thermal.log` should make a reading UNRESOLVED on a frequency fall over 5 % (EPIC-010's smoke rule). `rpair` only logs it.
- A halted pair is a re-run, per EPIC-008's "re-run once".
